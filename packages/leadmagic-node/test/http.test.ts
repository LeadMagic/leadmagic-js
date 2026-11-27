import { describe, expect, it } from "vitest";
import { LeadMagic } from "../src/index";
import { hangingReply, mockFetch, problem, VALID_EMAIL_BODY } from "./helpers";

const apiKey = "lm_live_test_key_123";
const client = (fetch: typeof globalThis.fetch, maxRetries = 2) =>
  new LeadMagic({ apiKey, fetch, maxRetries });

describe("requests", () => {
  it("sends the key, a user agent and one idempotency key for every attempt", async () => {
    const mock = mockFetch(
      {
        status: 503,
        body: problem(503, "service_unavailable"),
        headers: { "retry-after": "0" },
      },
      { body: VALID_EMAIL_BODY }
    );
    const { error } = await client(mock.fetch).email.validate("ada@stripe.com");

    expect(error).toBeNull();
    expect(mock.calls).toHaveLength(2);
    const [first, second] = mock.calls;
    expect(first?.headers["x-api-key"]).toBe(apiKey);
    expect(first?.headers["user-agent"]).toMatch(/^leadmagic-node\//u);
    expect(first?.headers["x-idempotency-key"]).toBeTruthy();
    expect(second?.headers["x-idempotency-key"]).toBe(
      first?.headers["x-idempotency-key"]
    );
  });

  it("uses the caller's idempotency key", async () => {
    const mock = mockFetch({ body: VALID_EMAIL_BODY });
    await client(mock.fetch).email.validate("ada@stripe.com", {
      idempotencyKey: "signup-ada-0001",
    });
    expect(mock.calls[0]?.headers["x-idempotency-key"]).toBe("signup-ada-0001");
  });

  it("sends no idempotency key on GET", async () => {
    const mock = mockFetch({ body: { credits: 10 } });
    await client(mock.fetch).credits.get();
    expect(mock.calls[0]?.method).toBe("GET");
    expect(mock.calls[0]?.headers["x-idempotency-key"]).toBeUndefined();
  });

  it("builds query strings and skips empty values", async () => {
    const mock = mockFetch({ body: { results: [], count: 0 } });
    await client(mock.fetch).localLeads.categories({
      country: "US",
      categoryGroup: "food_and_drink",
      q: "",
      limit: 20,
    });
    expect(mock.calls[0]?.url).toBe(
      "https://api.leadmagic.io/v3/local-leads/categories?country=US&category_group=food_and_drink&limit=20"
    );
  });

  it("encodes path parameters", async () => {
    const mock = mockFetch({ body: {} });
    await client(mock.fetch).analytics.day("2026-11-25");
    expect(mock.calls[0]?.url).toBe(
      "https://api.leadmagic.io/v1/analytics/day/2026-11-25"
    );
  });

  it("reaches any endpoint through request()", async () => {
    const mock = mockFetch({ body: { posts: [] } });
    const { data } = await client(mock.fetch).request({
      method: "POST",
      path: "/v1/people/posts-search",
      body: { profile_url: "ada" },
    });
    expect(data).toEqual({ posts: [] });
    expect(mock.calls[0]?.body).toEqual({ profile_url: "ada" });
  });
});

describe("meta", () => {
  it("reads credits, rate limits, lane and deprecation from headers", async () => {
    const mock = mockFetch({
      body: VALID_EMAIL_BODY,
      headers: {
        "x-request-id": "req_abc123",
        "x-credits-consumed": "0.25",
        "x-credits-remaining": "99.75",
        "ratelimit-limit": "300",
        "ratelimit-remaining": "299",
        "ratelimit-reset": "1764100000",
        "x-leadmagic-rate-lane": "validation",
        deprecation: "true",
        "x-deprecation-notice": "Use /v3/companies/search.",
      },
    });
    const { meta } = await client(mock.fetch).email.validate("ada@stripe.com");
    expect(meta).toMatchObject({
      status: 200,
      requestId: "req_abc123",
      sandbox: false,
      deprecation: "Use /v3/companies/search.",
      credits: { consumed: 0.25, remaining: 99.75 },
      rateLimit: {
        limit: 300,
        remaining: 299,
        reset: 1_764_100_000,
        lane: "validation",
      },
    });
  });

  it("falls back to credits_consumed in the body", async () => {
    const mock = mockFetch({ body: VALID_EMAIL_BODY });
    const { meta } = await client(mock.fetch).email.validate("ada@stripe.com");
    expect(meta.credits.consumed).toBe(0.25);
  });

  it("reports a non-JSON success as unexpected_response", async () => {
    const mock = mockFetch(() => new Response("<html>", { status: 200 }));
    const { error } = await client(mock.fetch).credits.get();
    expect(error?.code).toBe("unexpected_response");
    expect(error?.kind).toBe("unavailable");
  });
});

describe("retries", () => {
  it("retries a 429 after Retry-After", async () => {
    const mock = mockFetch(
      {
        status: 429,
        body: problem(429, "rate_limit_exceeded"),
        headers: { "retry-after": "0" },
      },
      { body: { credits: 1 } }
    );
    const { error } = await client(mock.fetch).credits.get();
    expect(error).toBeNull();
    expect(mock.calls).toHaveLength(2);
  });

  it("retries a duplicate that is still in progress", async () => {
    const mock = mockFetch(
      {
        status: 409,
        body: problem(409, "idempotency_in_progress"),
        headers: { "retry-after": "0" },
      },
      { body: VALID_EMAIL_BODY }
    );
    const { error } = await client(mock.fetch).email.validate("ada@stripe.com");
    expect(error).toBeNull();
    expect(mock.calls).toHaveLength(2);
  });

  it("does not retry a daily budget, which answers 429 but will not clear", async () => {
    const mock = mockFetch({
      status: 429,
      body: problem(429, "daily_budget_exceeded"),
      headers: { "retry-after": "0" },
    });
    const { error } = await client(mock.fetch).credits.get();
    expect(error?.kind).toBe("billing");
    expect(mock.calls).toHaveLength(1);
  });

  it("returns the error instead of waiting more than a minute", async () => {
    const mock = mockFetch({
      status: 503,
      body: problem(503, "ads_unavailable"),
      headers: { "retry-after": "300" },
    });
    const { error } = await client(mock.fetch).ads.google({
      domain: "stripe.com",
    });
    expect(error?.code).toBe("ads_unavailable");
    expect(error?.retryAfter).toBe(300);
    expect(mock.calls).toHaveLength(1);
  });

  it("does not retry a 400", async () => {
    const mock = mockFetch({
      status: 400,
      body: problem(400, "validation_error"),
    });
    await client(mock.fetch).credits.get();
    expect(mock.calls).toHaveLength(1);
  });

  it("stops after maxRetries", async () => {
    const mock = mockFetch({
      status: 502,
      body: problem(502, "external_service_error"),
      headers: { "retry-after": "0" },
    });
    const { error } = await client(mock.fetch, 1).credits.get();
    expect(error?.code).toBe("external_service_error");
    expect(mock.calls).toHaveLength(2);
  });

  it("retries a network failure and redacts the key from the message", async () => {
    const mock = mockFetch(new TypeError(`fetch failed for ${apiKey}`));
    const { error } = await client(mock.fetch, 1).credits.get();
    expect(mock.calls).toHaveLength(2);
    expect(error?.code).toBe("network_error");
    expect(error?.message).not.toContain(apiKey);
  });

  it("times out each attempt", async () => {
    const mock = mockFetch(hangingReply);
    const lm = new LeadMagic({
      apiKey,
      fetch: mock.fetch,
      timeoutMs: 20,
      maxRetries: 1,
    });
    const { error } = await lm.credits.get();
    expect(error?.code).toBe("timeout");
    expect(mock.calls).toHaveLength(2);
  });

  it("stops at once when the caller cancels", async () => {
    const mock = mockFetch(hangingReply);
    const controller = new AbortController();
    const pending = client(mock.fetch).credits.get({
      signal: controller.signal,
    });
    controller.abort();
    const { error } = await pending;
    expect(error?.message).toBe("The request was cancelled.");
    expect(mock.calls).toHaveLength(1);
  });
});
