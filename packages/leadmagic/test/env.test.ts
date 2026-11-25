import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetEnvWarnings, SANDBOX_BASE_URL } from "../src/env";
import { createClient, LeadMagicError, validateEmail } from "../src/index";
import { mockFetch, VALID_EMAIL_BODY } from "./helpers";

const KEY = "lm_live_0123456789abcdef0123456789abcdef01234567";

function thrown(fn: () => unknown): LeadMagicError {
  try {
    fn();
  } catch (error) {
    if (error instanceof LeadMagicError) {
      return error;
    }
    throw error;
  }
  throw new Error("expected a LeadMagicError");
}

beforeEach(() => {
  vi.unstubAllEnvs();
  vi.stubEnv("LEADMAGIC_API_KEY", "");
  vi.stubEnv("LEADMAGIC_SANDBOX", "");
  vi.stubEnv("LEADMAGIC_BASE_URL", "");
  vi.stubEnv("NEXT_PUBLIC_LEADMAGIC_API_KEY", "");
  resetEnvWarnings();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("key detection", () => {
  it("reads LEADMAGIC_API_KEY and sends it as X-API-Key", async () => {
    vi.stubEnv("LEADMAGIC_API_KEY", KEY);
    const mock = mockFetch({ body: VALID_EMAIL_BODY });
    vi.stubGlobal("fetch", mock.fetch);

    const { data, error } = await validateEmail("ada@stripe.com");

    expect(error).toBeNull();
    expect(data?.verdict).toBe("deliverable");
    expect(mock.calls[0]?.url).toBe(
      "https://api.leadmagic.io/v1/people/email-validation"
    );
    expect(mock.calls[0]?.headers["x-api-key"]).toBe(KEY);
  });

  it("prefers an explicit apiKey", async () => {
    vi.stubEnv("LEADMAGIC_API_KEY", KEY);
    const mock = mockFetch({ body: VALID_EMAIL_BODY });
    const client = createClient({
      apiKey: "lm_live_explicit",
      fetch: mock.fetch,
    });
    await client.validateEmail("ada@stripe.com");
    expect(mock.calls[0]?.headers["x-api-key"]).toBe("lm_live_explicit");
  });

  it("throws missing_api_key with a pointer to the Sandbox", () => {
    const error = thrown(() => createClient());
    expect(error.code).toBe("missing_api_key");
    expect(error.kind).toBe("config");
    expect(error.message).toContain("LEADMAGIC_API_KEY");
    expect(error.message).toContain("LEADMAGIC_SANDBOX=1");
  });

  it("never prints the key in errors", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_LEADMAGIC_API_KEY", KEY);
    const error = thrown(() => createClient({ apiKey: KEY }));
    expect(error.message).not.toContain(KEY);
  });
});

describe("exposed key guards", () => {
  it("refuses a NEXT_PUBLIC_ key outside production", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_LEADMAGIC_API_KEY", KEY);
    const error = thrown(() => createClient({ apiKey: KEY }));
    expect(error.code).toBe("public_api_key");
    expect(error.message).toContain("NEXT_PUBLIC_LEADMAGIC_API_KEY");
  });

  it("warns once in production instead of breaking the site", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_LEADMAGIC_API_KEY", KEY);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    createClient({ apiKey: KEY });
    createClient({ apiKey: KEY });
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("refuses to run in a browser with a key", () => {
    vi.stubGlobal("window", {});
    vi.stubGlobal("document", {});
    const error = thrown(() => createClient({ apiKey: KEY }));
    expect(error.code).toBe("browser_runtime");
  });
});

describe("sandbox", () => {
  it("needs no key and targets the public Sandbox", async () => {
    vi.stubEnv("LEADMAGIC_SANDBOX", "1");
    const mock = mockFetch({
      body: VALID_EMAIL_BODY,
      headers: { "x-sandbox": "true" },
    });
    const client = createClient({ fetch: mock.fetch });

    const { meta } = await client.validateEmail("ada@stripe.com", {
      sandboxOutcome: "402",
    });

    expect(client.sandbox).toBe(true);
    expect(meta.sandbox).toBe(true);
    expect(mock.calls[0]?.url).toBe(
      `${SANDBOX_BASE_URL}/v1/people/email-validation`
    );
    expect(mock.calls[0]?.headers["x-api-key"]).toBeUndefined();
    expect(mock.calls[0]?.headers["x-sandbox-outcome"]).toBe("402");
    expect(mock.calls[0]?.headers["x-idempotency-key"]).toBeUndefined();
  });

  it("works in the browser because there is no key to leak", () => {
    vi.stubGlobal("window", {});
    vi.stubGlobal("document", {});
    expect(createClient({ sandbox: true }).sandbox).toBe(true);
  });
});
