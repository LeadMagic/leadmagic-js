import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createClient } from "../src/index";
import { createValidateEmailHandler } from "../src/next/index";
import { hangingReply, mockFetch, problem, VALID_EMAIL_BODY } from "./helpers";

const ORIGIN = "https://shop.example.com";

function post(
  body: unknown,
  headers: Record<string, string> = { origin: ORIGIN }
) {
  return new Request(`${ORIGIN}/api/leadmagic/validate-email`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      host: "shop.example.com",
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function handlerWith(fetchImpl: typeof fetch, extra = {}) {
  return createValidateEmailHandler({
    client: createClient({ apiKey: "lm_live_test", fetch: fetchImpl }),
    ...extra,
  });
}

beforeEach(() => {
  vi.unstubAllEnvs();
  vi.stubEnv("LEADMAGIC_API_KEY", "");
  vi.stubEnv("LEADMAGIC_SANDBOX", "");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("origin check", () => {
  it("refuses other sites", async () => {
    const mock = mockFetch({ body: VALID_EMAIL_BODY });
    const res = await handlerWith(mock.fetch)(
      post({ email: "ada@stripe.com" }, { origin: "https://evil.example" })
    );
    expect(res.status).toBe(403);
    expect(mock.calls).toHaveLength(0);
  });

  it("refuses requests without an Origin", async () => {
    const mock = mockFetch({ body: VALID_EMAIL_BODY });
    const res = await handlerWith(mock.fetch)(
      post({ email: "ada@stripe.com" }, {})
    );
    expect(res.status).toBe(403);
  });

  it("accepts Sec-Fetch-Site: same-origin and listed origins", async () => {
    const mock = mockFetch({ body: VALID_EMAIL_BODY });
    const handler = handlerWith(mock.fetch, {
      allowedOrigins: ["https://www.example.com/"],
    });
    expect(
      (
        await handler(
          post({ email: "a@stripe.com" }, { "sec-fetch-site": "same-origin" })
        )
      ).status
    ).toBe(200);
    expect(
      (
        await handler(
          post({ email: "b@stripe.com" }, { origin: "https://www.example.com" })
        )
      ).status
    ).toBe(200);
  });
});

describe("answers", () => {
  it("returns only verdict and roleBased", async () => {
    const mock = mockFetch({
      body: { ...VALID_EMAIL_BODY, is_role_based: true },
    });
    const res = await handlerWith(mock.fetch)(
      post({ email: "info@stripe.com" })
    );
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(await res.json()).toEqual({
      verdict: "deliverable",
      roleBased: true,
    });
  });

  it("caches per email, case-insensitively", async () => {
    const mock = mockFetch({ body: VALID_EMAIL_BODY });
    const handler = handlerWith(mock.fetch);
    await handler(post({ email: "Ada@Stripe.com" }));
    await handler(post({ email: "ada@stripe.com" }));
    expect(mock.calls).toHaveLength(1);
  });

  it("calls a not-an-email undeliverable without calling the API", async () => {
    const mock = mockFetch({ body: VALID_EMAIL_BODY });
    const res = await handlerWith(mock.fetch)(post({ email: "nope" }));
    expect(await res.json()).toEqual({
      verdict: "undeliverable",
      roleBased: false,
    });
    expect(mock.calls).toHaveLength(0);
  });

  it("rejects malformed bodies", async () => {
    const mock = mockFetch({ body: VALID_EMAIL_BODY });
    expect((await handlerWith(mock.fetch)(post("{"))).status).toBe(400);
    expect((await handlerWith(mock.fetch)(post({ mail: "x" }))).status).toBe(
      400
    );
    expect(
      (await handlerWith(mock.fetch)(post({ email: "a".repeat(3000) }))).status
    ).toBe(413);
  });
});

describe("fails open", () => {
  it.each([
    [
      "out of credits",
      { status: 402, body: problem(402, "insufficient_credits") },
    ],
    [
      "rate limited",
      {
        status: 429,
        body: problem(429, "rate_limit_exceeded"),
        headers: { "retry-after": "60" },
      },
    ],
    [
      "outage",
      {
        status: 503,
        body: problem(503, "service_unavailable"),
        headers: { "retry-after": "60" },
      },
    ],
    ["bad key", { status: 401, body: problem(401, "invalid_api_key") }],
  ])("answers unknown when %s", async (_label, reply) => {
    const mock = mockFetch(reply);
    const res = await handlerWith(mock.fetch)(
      post({ email: "ada@stripe.com" })
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ verdict: "unknown", roleBased: false });
  });

  it("answers unknown on timeout and does not cache it", async () => {
    const mock = mockFetch(hangingReply, { body: VALID_EMAIL_BODY });
    const handler = handlerWith(mock.fetch, { timeoutMs: 30 });
    expect(
      await (await handler(post({ email: "ada@stripe.com" }))).json()
    ).toEqual({
      verdict: "unknown",
      roleBased: false,
    });
    expect(
      await (await handler(post({ email: "ada@stripe.com" }))).json()
    ).toEqual({
      verdict: "deliverable",
      roleBased: false,
    });
  });

  it("names the error code in a header during development", async () => {
    const mock = mockFetch({
      status: 402,
      body: problem(402, "insufficient_credits"),
    });
    const res = await handlerWith(mock.fetch)(
      post({ email: "ada@stripe.com" })
    );
    expect(res.headers.get("x-leadmagic-error")).toBe("insufficient_credits");
  });
});

describe("configuration", () => {
  it("explains a missing key with a 500 during development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const res = await createValidateEmailHandler()(
      post({ email: "ada@stripe.com" })
    );
    expect(res.status).toBe(500);
    expect((await res.json()).error.code).toBe("missing_api_key");
  });

  it("fails open and logs once in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const handler = createValidateEmailHandler();
    await handler(post({ email: "a@stripe.com" }));
    const res = await handler(post({ email: "b@stripe.com" }));
    expect(await res.json()).toEqual({ verdict: "unknown", roleBased: false });
    expect(log).toHaveBeenCalledTimes(1);
  });
});

describe("request limits", () => {
  it("only reads JSON, which other sites cannot post without a preflight", async () => {
    const mock = mockFetch({ body: VALID_EMAIL_BODY });
    const res = await handlerWith(mock.fetch)(
      post(
        { email: "ada@stripe.com" },
        {
          origin: ORIGIN,
          "content-type": "text/plain",
        }
      )
    );
    expect(res.status).toBe(415);
    expect(mock.calls).toHaveLength(0);
  });

  it("stops reading a body that has no length once it is too large", async () => {
    const mock = mockFetch({ body: VALID_EMAIL_BODY });
    let pulled = 0;
    const body = new ReadableStream<Uint8Array>({
      pull(controller) {
        pulled += 1;
        controller.enqueue(new Uint8Array(1024).fill(97));
      },
    });
    const res = await handlerWith(mock.fetch)(
      new Request(`${ORIGIN}/api/leadmagic/validate-email`, {
        method: "POST",
        headers: { "content-type": "application/json", origin: ORIGIN },
        body,
        duplex: "half",
      } as RequestInit)
    );
    expect(res.status).toBe(413);
    expect(pulled).toBeLessThan(10);
    expect(mock.calls).toHaveLength(0);
  });

  it("marks answers as not cacheable and not sniffable", async () => {
    const mock = mockFetch({ body: VALID_EMAIL_BODY });
    const res = await handlerWith(mock.fetch)(post({ email: "a@stripe.com" }));
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
  });
});

describe("rate limit", () => {
  function from(ip: string, email: string) {
    return post({ email }, { origin: ORIGIN, "x-real-ip": ip });
  }

  it("caps one visitor without touching the others", async () => {
    const mock = mockFetch({ body: VALID_EMAIL_BODY });
    const events: Array<{ error: { code: string; reason?: string } | null }> =
      [];
    const handler = handlerWith(mock.fetch, {
      rateLimit: { perIp: 2 },
      onResult: (event: (typeof events)[number]) => events.push(event),
    });

    await handler(from("203.0.113.7", "a@stripe.com"));
    await handler(from("203.0.113.7", "b@stripe.com"));
    const third = await handler(from("203.0.113.7", "c@stripe.com"));
    const other = await handler(from("203.0.113.8", "d@stripe.com"));

    expect(third.status).toBe(200);
    expect(await third.json()).toEqual({
      verdict: "unknown",
      roleBased: false,
    });
    expect(await other.json()).toMatchObject({ verdict: "deliverable" });
    expect(mock.calls).toHaveLength(3);
    expect(events[2]?.error).toMatchObject({
      code: "rate_limit_exceeded",
      reason: "route_limit_per_ip",
    });
  });

  it("does not count answers served from the cache", async () => {
    const mock = mockFetch({ body: VALID_EMAIL_BODY });
    const handler = handlerWith(mock.fetch, { rateLimit: { perIp: 1 } });
    for (let i = 0; i < 5; i += 1) {
      // biome-ignore lint/performance/noAwaitInLoops: requests must be in order.
      const res = await handler(from("203.0.113.7", "a@stripe.com"));
      expect(await res.json()).toMatchObject({ verdict: "deliverable" });
    }
    expect(mock.calls).toHaveLength(1);
  });

  it("caps the total, whatever IP each request claims", async () => {
    const mock = mockFetch({ body: VALID_EMAIL_BODY });
    const handler = handlerWith(mock.fetch, { rateLimit: { total: 3 } });
    const verdicts: string[] = [];
    for (let i = 0; i < 5; i += 1) {
      // biome-ignore lint/performance/noAwaitInLoops: requests must be in order.
      const res = await handler(from(`198.51.100.${i}`, `u${i}@stripe.com`));
      verdicts.push(((await res.json()) as { verdict: string }).verdict);
    }
    expect(verdicts).toEqual([
      "deliverable",
      "deliverable",
      "deliverable",
      "unknown",
      "unknown",
    ]);
    expect(mock.calls).toHaveLength(3);
  });

  it("starts again in the next window", async () => {
    vi.useFakeTimers();
    try {
      const mock = mockFetch({ body: VALID_EMAIL_BODY });
      const handler = handlerWith(mock.fetch, {
        rateLimit: { perIp: 1, windowMs: 1000 },
      });
      await handler(from("203.0.113.7", "a@stripe.com"));
      await handler(from("203.0.113.7", "b@stripe.com"));
      expect(mock.calls).toHaveLength(1);
      vi.advanceTimersByTime(1001);
      await handler(from("203.0.113.7", "c@stripe.com"));
      expect(mock.calls).toHaveLength(2);
    } finally {
      vi.useRealTimers();
    }
  });

  it("is on by default and can be turned off", async () => {
    const mock = mockFetch({ body: VALID_EMAIL_BODY });
    const byDefault = handlerWith(mock.fetch);
    for (let i = 0; i < 12; i += 1) {
      // biome-ignore lint/performance/noAwaitInLoops: requests must be in order.
      await byDefault(from("203.0.113.7", `u${i}@stripe.com`));
    }
    expect(mock.calls).toHaveLength(10);

    const off = handlerWith(mock.fetch, { rateLimit: false });
    for (let i = 0; i < 12; i += 1) {
      // biome-ignore lint/performance/noAwaitInLoops: requests must be in order.
      await off(from("203.0.113.7", `v${i}@stripe.com`));
    }
    expect(mock.calls).toHaveLength(22);
  });
});

describe("route options", () => {
  it("skip answers unknown without calling LeadMagic", async () => {
    const mock = mockFetch({ body: VALID_EMAIL_BODY });
    const handler = handlerWith(mock.fetch, {
      skip: (email: string) => email.endsWith("@ourcompany.com"),
    });
    const skipped = await handler(post({ email: "me@ourcompany.com" }));
    expect(await skipped.json()).toEqual({
      verdict: "unknown",
      roleBased: false,
    });
    expect(mock.calls).toHaveLength(0);

    const checked = await handler(post({ email: "ada@stripe.com" }));
    expect(await checked.json()).toMatchObject({ verdict: "deliverable" });
    expect(mock.calls).toHaveLength(1);
  });

  it("failOpen false answers 503 when LeadMagic cannot", async () => {
    const mock = mockFetch({
      status: 402,
      body: problem(402, "insufficient_credits"),
    });
    const res = await handlerWith(mock.fetch, { failOpen: false })(
      post({ email: "ada@stripe.com" })
    );
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({
      error: "Email validation is unavailable.",
    });
  });

  it("failOpen false also covers the route's own rate limit", async () => {
    const mock = mockFetch({ body: VALID_EMAIL_BODY });
    const handler = handlerWith(mock.fetch, {
      failOpen: false,
      rateLimit: { total: 1 },
    });
    expect((await handler(post({ email: "a@stripe.com" }))).status).toBe(200);
    expect((await handler(post({ email: "b@stripe.com" }))).status).toBe(503);
  });

  it("passes verificationPolicy to LeadMagic", async () => {
    const mock = mockFetch({ body: VALID_EMAIL_BODY });
    await handlerWith(mock.fetch, { verificationPolicy: "strict" })(
      post({ email: "ada@stripe.com" })
    );
    expect(mock.calls[0]?.body).toMatchObject({
      email: "ada@stripe.com",
      verification_policy: "strict",
    });
  });
});

describe("hooks", () => {
  it("protect can refuse or answer", async () => {
    const mock = mockFetch({ body: VALID_EMAIL_BODY });
    const refuse = handlerWith(mock.fetch, { protect: () => false });
    expect((await refuse(post({ email: "ada@stripe.com" }))).status).toBe(403);

    const custom = handlerWith(mock.fetch, {
      protect: () => new Response("slow down", { status: 429 }),
    });
    expect((await custom(post({ email: "ada@stripe.com" }))).status).toBe(429);
    expect(mock.calls).toHaveLength(0);
  });

  it("onResult sees every answer and cannot break the route", async () => {
    const mock = mockFetch({ body: VALID_EMAIL_BODY });
    const events: unknown[] = [];
    const handler = handlerWith(mock.fetch, {
      onResult: (event: unknown) => {
        events.push(event);
        throw new Error("logger down");
      },
    });
    const res = await handler(post({ email: "ada@stripe.com" }));
    await handler(post({ email: "ada@stripe.com" }));
    expect(res.status).toBe(200);
    expect(events).toMatchObject([
      { verdict: "deliverable", cached: false, error: null },
      { verdict: "deliverable", cached: true, error: null },
    ]);
  });
});
