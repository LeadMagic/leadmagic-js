import type { Server } from "node:http";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { afterEach, describe, expect, it } from "vitest";
import { createClient } from "../src/index";
import { hangingReply, mockFetch, problem, VALID_EMAIL_BODY } from "./helpers";

const apiKey = "lm_live_test";

describe("responses", () => {
  it("returns data and meta read from headers", async () => {
    const mock = mockFetch({
      body: VALID_EMAIL_BODY,
      headers: {
        "x-request-id": "req_abc123",
        "x-credits-consumed": "0.25",
        "x-credits-remaining": "99.75",
        "x-ratelimit-limit": "300",
        "x-ratelimit-remaining": "299",
      },
    });
    const client = createClient({ apiKey, fetch: mock.fetch });

    const result = await client.validateEmail("ada@stripe.com");

    expect(result.error).toBeNull();
    expect(result.meta).toMatchObject({
      status: 200,
      requestId: "req_abc123",
      credits: { consumed: 0.25, remaining: 99.75 },
      rateLimit: { limit: 300, remaining: 299 },
    });
    expect(mock.calls[0]?.headers["user-agent"]).toMatch(/^leadmagic-js\//u);
    expect(mock.calls[0]?.headers["x-idempotency-key"]).toBeTruthy();
  });

  it("falls back to credits_consumed from the body", async () => {
    const mock = mockFetch({ body: VALID_EMAIL_BODY });
    const { meta } = await createClient({
      apiKey,
      fetch: mock.fetch,
    }).validateEmail("ada@stripe.com");
    expect(meta.credits.consumed).toBe(0.25);
  });

  it("reports a non-JSON success as unexpected_response", async () => {
    const mock = mockFetch(() => new Response("<html>", { status: 200 }));
    const { error } = await createClient({
      apiKey,
      fetch: mock.fetch,
    }).getCredits();
    expect(error?.code).toBe("unexpected_response");
    expect(error?.kind).toBe("unavailable");
  });
});

describe("error contract", () => {
  it.each([
    [401, "invalid_api_key", "auth"],
    [403, "insufficient_permissions", "auth"],
    [403, "ip_not_allowed", "auth"],
    [402, "insufficient_credits", "billing"],
    [429, "daily_budget_exceeded", "billing"],
    [429, "rate_limit_exceeded", "rate_limit"],
    [400, "validation_error", "invalid_input"],
    [404, "route_not_found", "invalid_input"],
    [500, "internal_error", "unavailable"],
    [503, "service_unavailable", "unavailable"],
  ] as const)("%i %s is %s", async (status, code, kind) => {
    const mock = mockFetch({ status, body: problem(status, code) });
    const client = createClient({ apiKey, fetch: mock.fetch, maxRetries: 0 });

    const { data, error } = await client.validateEmail("ada@stripe.com");

    expect(data).toBeNull();
    expect(error?.code).toBe(code);
    expect(error?.kind).toBe(kind);
    expect(error?.status).toBe(status);
    expect(error?.message).toBe(`detail for ${code}`);
    expect(error?.requestId).toBe("req_test_123456");
  });

  it("reads context.reason, param, action and docs", async () => {
    const mock = mockFetch({
      status: 403,
      body: problem(403, "insufficient_permissions", {
        context: { reason: "api_key_scope" },
        param: ["email"],
        action: "Use a key with email validation scope.",
        docs: "https://leadmagic.io/docs/v1/authentication",
      }),
    });
    const { error } = await createClient({
      apiKey,
      fetch: mock.fetch,
    }).validateEmail("a@b.co");
    expect(error?.reason).toBe("api_key_scope");
    expect(error?.param).toEqual(["email"]);
    expect(error?.action).toBe("Use a key with email validation scope.");
    expect(error?.docsUrl).toBe("https://leadmagic.io/docs/v1/authentication");
    expect(error?.retryable).toBe(false);
  });

  it("reads the errors[0] error shape", async () => {
    const mock = mockFetch({
      status: 402,
      body: {
        success: false,
        errors: [
          {
            status: 402,
            code: "insufficient_credits",
            title: "Insufficient credits",
          },
        ],
        meta: { request_id: "5ebcbab4-bab5-4438" },
      },
    });
    const { error } = await createClient({
      apiKey,
      fetch: mock.fetch,
    }).validateEmail("a@b.co");
    expect(error?.code).toBe("insufficient_credits");
    expect(error?.message).toBe("Insufficient credits");
    expect(error?.requestId).toBe("5ebcbab4-bab5-4438");
  });

  it("names a status when the body is not Problem Details", async () => {
    const mock = mockFetch(() => new Response("Bad Gateway", { status: 502 }));
    const { error } = await createClient({
      apiKey,
      fetch: mock.fetch,
      maxRetries: 0,
    }).getCredits();
    expect(error?.code).toBe("http_502");
    expect(error?.kind).toBe("unavailable");
  });

  it("serializes without the stack", async () => {
    const mock = mockFetch({
      status: 402,
      body: problem(402, "insufficient_credits"),
    });
    const { error } = await createClient({
      apiKey,
      fetch: mock.fetch,
    }).validateEmail("a@b.co");
    expect(JSON.parse(JSON.stringify(error))).toMatchObject({
      code: "insufficient_credits",
      kind: "billing",
    });
  });
});

describe("retries", () => {
  it("retries 429 after Retry-After with the same idempotency key", async () => {
    const mock = mockFetch(
      {
        status: 429,
        body: problem(429, "rate_limit_exceeded"),
        headers: { "retry-after": "0" },
      },
      { body: VALID_EMAIL_BODY }
    );
    const { data } = await createClient({
      apiKey,
      fetch: mock.fetch,
    }).validateEmail("a@b.co");

    expect(data?.verdict).toBe("deliverable");
    expect(mock.calls).toHaveLength(2);
    expect(mock.calls[0]?.headers["x-idempotency-key"]).toBe(
      mock.calls[1]?.headers["x-idempotency-key"]
    );
  });

  it("gives up when Retry-After is longer than the time left", async () => {
    const mock = mockFetch(
      {
        status: 429,
        body: problem(429, "rate_limit_exceeded"),
        headers: { "retry-after": "30" },
      },
      { body: VALID_EMAIL_BODY }
    );
    const { error } = await createClient({
      apiKey,
      fetch: mock.fetch,
      timeoutMs: 2000,
    }).validateEmail("a@b.co");
    expect(error?.kind).toBe("rate_limit");
    expect(error?.retryAfter).toBe(30);
    expect(mock.calls).toHaveLength(1);
  });

  it("does not retry client errors", async () => {
    const mock = mockFetch(
      { status: 400, body: problem(400, "validation_error") },
      { body: VALID_EMAIL_BODY }
    );
    await createClient({ apiKey, fetch: mock.fetch }).validateEmail("a@b.co");
    expect(mock.calls).toHaveLength(1);
  });

  it("retries network errors, then reports network_error", async () => {
    const mock = mockFetch(new TypeError("fetch failed"));
    const { error } = await createClient({
      apiKey,
      fetch: mock.fetch,
      maxRetries: 1,
    }).getCredits();
    expect(error?.code).toBe("network_error");
    expect(error?.retryable).toBe(true);
    expect(mock.calls).toHaveLength(2);
  });
});

describe("timeouts and cancellation", () => {
  it("reports timeout within the budget", async () => {
    const mock = mockFetch(hangingReply);
    const started = Date.now();
    const { error, meta } = await createClient({
      apiKey,
      fetch: mock.fetch,
      timeoutMs: 50,
    }).validateEmail("a@b.co");
    expect(error?.code).toBe("timeout");
    expect(error?.kind).toBe("unavailable");
    expect(meta.status).toBe(0);
    expect(Date.now() - started).toBeLessThan(1000);
  });

  it("honours the caller's AbortSignal", async () => {
    const mock = mockFetch(hangingReply);
    const controller = new AbortController();
    const pending = createClient({ apiKey, fetch: mock.fetch }).getCredits({
      signal: controller.signal,
    });
    controller.abort();
    const { error } = await pending;
    expect(error?.code).toBe("network_error");
    expect(error?.message).toContain("cancelled");
  });
});

describe("key safety", () => {
  const servers: Server[] = [];

  function listen(server: Server): Promise<string> {
    servers.push(server);
    return new Promise((resolve) => {
      server.listen(0, "127.0.0.1", () => {
        const { port } = server.address() as AddressInfo;
        resolve(`http://127.0.0.1:${port}`);
      });
    });
  }

  afterEach(() => {
    for (const server of servers.splice(0)) {
      server.close();
    }
  });

  it("does not follow a redirect, so the key goes nowhere else", async () => {
    const seen: Array<string | undefined> = [];
    const elsewhere = await listen(
      createServer((req, res) => {
        seen.push(req.headers["x-api-key"] as string | undefined);
        res.setHeader("content-type", "application/json");
        res.end("{}");
      })
    );
    const api = await listen(
      createServer((_req, res) => {
        res.writeHead(307, { location: `${elsewhere}/v1/credits` });
        res.end();
      })
    );

    // The real fetch, so this checks the runtime and not a mock.
    const { error, meta } = await createClient({
      apiKey,
      baseUrl: api,
    }).getCredits();

    expect(seen).toEqual([]);
    expect(meta.status).toBe(307);
    expect(error?.code).toBe("http_307");
    expect(error?.kind).toBe("unavailable");
  });

  it("removes the key from a network error's message", async () => {
    const mock = mockFetch(
      new TypeError(`Headers.append: "${apiKey}" is an invalid header value.`)
    );
    const { error } = await createClient({
      apiKey,
      fetch: mock.fetch,
      maxRetries: 0,
    }).getCredits();
    expect(error?.code).toBe("network_error");
    expect(error?.message).not.toContain(apiKey);
    expect(JSON.stringify(error)).not.toContain(apiKey);
  });
});
