import { describe, expect, it } from "vitest";
import { createClient } from "../src/index";
import { mockFetch, VALID_EMAIL_BODY } from "./helpers";

const apiKey = "lm_live_test";

describe("validateEmail", () => {
  it.each([
    ["valid", "deliverable"],
    ["invalid", "undeliverable"],
    ["unknown", "unknown"],
    ["catch_all", "unknown"],
    ["not_found", "unknown"],
  ])("maps email_status %s to %s", async (status, verdict) => {
    const mock = mockFetch({
      body: { ...VALID_EMAIL_BODY, email_status: status },
    });
    const { data } = await createClient({
      apiKey,
      fetch: mock.fetch,
    }).validateEmail("ada@stripe.com");
    expect(data?.verdict).toBe(verdict);
    expect(["valid", "invalid", "unknown"]).toContain(data?.email_status);
  });

  it("rejects non-addresses locally without spending a request", async () => {
    const mock = mockFetch({ body: VALID_EMAIL_BODY });
    const { error, meta } = await createClient({
      apiKey,
      fetch: mock.fetch,
    }).validateEmail("not an email");
    expect(error?.code).toBe("invalid_input");
    expect(error?.kind).toBe("invalid_input");
    expect(meta.credits.consumed).toBe(0);
    expect(mock.calls).toHaveLength(0);
  });

  it("sends the optional flags with API names", async () => {
    const mock = mockFetch({ body: VALID_EMAIL_BODY });
    await createClient({ apiKey, fetch: mock.fetch }).validateEmail(
      " ada@stripe.com ",
      {
        verificationPolicy: "strict",
        includeExtendedInfo: true,
        includeVerificationDetails: true,
      }
    );
    expect(mock.calls[0]?.body).toEqual({
      email: "ada@stripe.com",
      verification_policy: "strict",
      include_extended_info: true,
      include_verification_details: true,
    });
  });
});

describe("findCompany", () => {
  it("reads the single-lookup shape", async () => {
    const company = { company_domain: "stripe.com", company_name: "Stripe" };
    const mock = mockFetch({
      body: { found: true, company, companies: [company], credits_consumed: 1 },
    });
    const { data } = await createClient({
      apiKey,
      fetch: mock.fetch,
    }).findCompany({ domain: "stripe.com" });
    expect(data).toEqual({ found: true, company, credits_consumed: 1 });
    expect(mock.calls[0]?.url).toBe(
      "https://api.leadmagic.io/v3/companies/search"
    );
    expect(mock.calls[0]?.body).toEqual({ company_domain: "stripe.com" });
  });

  it("reads the list shape", async () => {
    const mock = mockFetch({
      body: {
        message: "Companies found",
        companies: [{ company_name: "Stripe" }],
      },
    });
    const { data } = await createClient({
      apiKey,
      fetch: mock.fetch,
    }).findCompany({ name: "Stripe" });
    expect(data?.found).toBe(true);
    expect(data?.company?.company_name).toBe("Stripe");
  });

  it("reports not found without an error", async () => {
    const mock = mockFetch({
      body: { found: false, company: null, credits_consumed: 0 },
    });
    const { data, error } = await createClient({
      apiKey,
      fetch: mock.fetch,
    }).findCompany({ domain: "nope.invalid" });
    expect(error).toBeNull();
    expect(data).toEqual({ found: false, company: null, credits_consumed: 0 });
  });

  it("needs at least one identifier", async () => {
    const mock = mockFetch({ body: {} });
    const { error } = await createClient({
      apiKey,
      fetch: mock.fetch,
    }).findCompany({});
    expect(error?.code).toBe("invalid_input");
    expect(mock.calls).toHaveLength(0);
  });
});

describe("getCredits", () => {
  it("prefers credits_available and reports frozen", async () => {
    const mock = mockFetch({
      body: { credits: 120, credits_available: 100, is_frozen: true },
    });
    const { data } = await createClient({
      apiKey,
      fetch: mock.fetch,
    }).getCredits();
    expect(data?.available).toBe(100);
    expect(data?.frozen).toBe(true);
    expect(mock.calls[0]?.method).toBe("GET");
    expect(mock.calls[0]?.headers["x-idempotency-key"]).toBeUndefined();
  });

  it("falls back to credits", async () => {
    const mock = mockFetch({ body: { credits: 2200 } });
    const { data } = await createClient({
      apiKey,
      fetch: mock.fetch,
    }).getCredits();
    expect(data?.available).toBe(2200);
  });
});
