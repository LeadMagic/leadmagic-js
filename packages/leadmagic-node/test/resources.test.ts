import { describe, expect, it } from "vitest";
import { LeadMagic } from "../src/index";
import { mockFetch, problem } from "./helpers";

const apiKey = "lm_live_test_key_123";
const lm = (fetch: typeof globalThis.fetch) =>
  new LeadMagic({ apiKey, fetch, maxRetries: 0 });
const BASE = "https://api.leadmagic.io";

/** Each method: what it sends, and the body that counts as found. */
const CASES: {
  name: string;
  call: (client: LeadMagic) => Promise<{ found?: boolean }>;
  method: string;
  path: string;
  body?: Record<string, unknown>;
  hit?: Record<string, unknown>;
  miss?: Record<string, unknown>;
}[] = [
  {
    name: "email.find",
    call: (c) =>
      c.email.find({
        firstName: "Ada",
        lastName: "Lovelace",
        domain: "stripe.com",
      }),
    method: "POST",
    path: "/v1/people/email-finder",
    body: { first_name: "Ada", last_name: "Lovelace", domain: "stripe.com" },
    hit: { email: "ada@stripe.com", status: "valid" },
    miss: { email: null, status: null, message: "No email found." },
  },
  {
    name: "email.findPersonal",
    call: (c) => c.email.findPersonal({ profileUrl: "ada-lovelace" }),
    method: "POST",
    path: "/v1/people/personal-email-finder",
    body: { profile_url: "ada-lovelace" },
    hit: { personal_emails: ["ada@gmail.com"] },
    miss: { personal_emails: [] },
  },
  {
    name: "email.fromProfile",
    call: (c) => c.email.fromProfile({ profileUrl: "ada-lovelace" }),
    method: "POST",
    path: "/v1/people/b2b-profile-email",
    body: { profile_url: "ada-lovelace" },
    hit: { email: "ada@stripe.com" },
    miss: { email: null },
  },
  {
    name: "people.getProfile",
    call: (c) => c.people.getProfile({ profileUrl: "ada-lovelace" }),
    method: "POST",
    path: "/v1/people/profile-search",
    body: { profile_url: "ada-lovelace" },
    hit: { full_name: "Ada Lovelace" },
    miss: { full_name: null, first_name: null },
  },
  {
    name: "people.fromEmail",
    call: (c) => c.people.fromEmail({ workEmail: "ada@stripe.com" }),
    method: "POST",
    path: "/v1/people/b2b-profile",
    body: { work_email: "ada@stripe.com" },
    hit: { profile_url: "https://example.com/in/ada" },
    miss: { profile_url: null },
  },
  {
    name: "people.findMobile",
    call: (c) => c.people.findMobile({ profileUrl: "ada-lovelace" }),
    method: "POST",
    path: "/v1/people/mobile-finder",
    body: { profile_url: "ada-lovelace" },
    hit: { mobile_number: "+15550100" },
    miss: { mobile_number: null },
  },
  {
    name: "people.findByRole",
    call: (c) => c.people.findByRole({ jobTitle: "CEO", domain: "stripe.com" }),
    method: "POST",
    path: "/v1/people/role-finder",
    body: { job_title: "CEO", company_domain: "stripe.com" },
    hit: { name: "Patrick Collison", profile_url: "x" },
    miss: { message: "Role not found." },
  },
  {
    name: "people.findEmployees",
    call: (c) => c.people.findEmployees({ domain: "stripe.com", limit: 5 }),
    method: "POST",
    path: "/v1/people/employee-finder",
    body: { company_domain: "stripe.com", limit: 5 },
    hit: { employees: [{ first_name: "Ada" }] },
    miss: { employees: [] },
  },
  {
    name: "people.detectJobChange",
    call: (c) =>
      c.people.detectJobChange({ profileUrl: "ada", domain: "stripe.com" }),
    method: "POST",
    path: "/v1/people/job-change-detector",
    body: { profile_url: "ada", company_domain: "stripe.com" },
    hit: { profile_found: true, job_change_detected: false },
    miss: { profile_found: false, status: "PROFILE_NOT_FOUND" },
  },
  {
    name: "companies.find",
    call: (c) => c.companies.find({ domain: "stripe.com" }),
    method: "POST",
    path: "/v3/companies/search",
    body: { company_domain: "stripe.com" },
    hit: { companies: [{ company_domain: "stripe.com" }] },
    miss: { companies: [], found: false },
  },
  {
    name: "companies.funding",
    call: (c) => c.companies.funding({ domain: "stripe.com" }),
    method: "POST",
    path: "/v1/companies/company-funding",
    body: { company_domain: "stripe.com" },
    hit: { basicInfo: { name: "Stripe" } },
    miss: { basicInfo: null },
  },
  {
    name: "companies.competitors",
    call: (c) =>
      c.companies.competitors({ domain: "stripe.com", profileUrl: "stripe" }),
    method: "POST",
    path: "/v1/companies/competitors-search",
    body: { company_domain: "stripe.com", company_url: "stripe" },
    hit: { competitors: [{ name: "Adyen" }] },
    miss: { competitors: [] },
  },
  {
    name: "companies.technographics",
    call: (c) => c.companies.technographics({ domain: "stripe.com" }),
    method: "POST",
    path: "/v1/companies/technographics",
    body: { company_domain: "stripe.com" },
    hit: { data: { analytics: ["Segment"] } },
    miss: { data: {} },
  },
  {
    name: "ads.google",
    call: (c) => c.ads.google({ domain: "stripe.com", limit: 3 }),
    method: "POST",
    path: "/v1/ads/google-ads-search",
    body: { company_domain: "stripe.com", limit: 3 },
    hit: { ads: [{ id: 1 }] },
    miss: { ads: [] },
  },
  {
    name: "ads.meta",
    call: (c) => c.ads.meta({ companyName: "Stripe" }),
    method: "POST",
    path: "/v1/ads/meta-ads-search",
    body: { company_name: "Stripe" },
    hit: { ads: [{ id: 1 }] },
    miss: { ads: [] },
  },
  {
    name: "ads.b2b",
    call: (c) => c.ads.b2b({ domain: "stripe.com" }),
    method: "POST",
    path: "/v1/ads/b2b-ads-search",
    body: { company_domain: "stripe.com" },
    hit: { ads: [{ id: 1 }] },
    miss: { ads: [] },
  },
  {
    name: "ads.b2bDetails",
    call: (c) => c.ads.b2bDetails({ adUrl: "123" }),
    method: "POST",
    path: "/v1/ads/b2b-ads-details",
    body: { ad_url: "123" },
    hit: { ad_details: { id: "123" } },
    miss: { ad_details: null },
  },
];

describe.each(CASES)("$name", ({ call, method, path, body, hit, miss }) => {
  it(`sends ${method} ${path} with API field names`, async () => {
    const mock = mockFetch({ body: hit });
    await call(lm(mock.fetch));
    expect(mock.calls[0]?.method).toBe(method);
    expect(mock.calls[0]?.url).toBe(`${BASE}${path}`);
    expect(mock.calls[0]?.body).toEqual(body);
  });

  it("reports found and not found", async () => {
    expect((await call(lm(mockFetch({ body: hit }).fetch))).found).toBe(true);
    expect((await call(lm(mockFetch({ body: miss }).fetch))).found).toBe(false);
  });

  it("is not found when the API fails", async () => {
    const mock = mockFetch({
      status: 402,
      body: problem(402, "insufficient_credits"),
    });
    const result = (await call(lm(mock.fetch))) as {
      found: boolean;
      error: unknown;
    };
    expect(result.found).toBe(false);
    expect(result.error).toBeTruthy();
  });
});

describe("input the SDK refuses without a call", () => {
  it.each([
    ["email.validate", (c: LeadMagic) => c.email.validate("not-an-email")],
    [
      "email.find without a company",
      (c: LeadMagic) => c.email.find({ firstName: "Ada" }),
    ],
    [
      "email.findPersonal blank",
      (c: LeadMagic) => c.email.findPersonal({ profileUrl: "  " }),
    ],
    ["people.fromEmail empty", (c: LeadMagic) => c.people.fromEmail({})],
    [
      "people.findByRole without a company",
      (c: LeadMagic) => c.people.findByRole({ jobTitle: "CEO" }),
    ],
    [
      "people.detectJobChange without a company",
      (c: LeadMagic) => c.people.detectJobChange({ profileUrl: "ada" }),
    ],
    [
      "people.search with no filter",
      (c: LeadMagic) => c.people.search({ limit: 10 }),
    ],
    ["companies.find empty", (c: LeadMagic) => c.companies.find({})],
    [
      "companies.search with no filter",
      (c: LeadMagic) => c.companies.search({}),
    ],
    [
      "companies.lookalikes with no seed",
      (c: LeadMagic) => c.companies.lookalikes({ limit: 5 }),
    ],
    ["ads.google empty", (c: LeadMagic) => c.ads.google({})],
    ["localLeads.search empty", (c: LeadMagic) => c.localLeads.search({})],
    ["analytics.day bad date", (c: LeadMagic) => c.analytics.day("25/11/2026")],
  ])("%s", async (_name, call) => {
    const mock = mockFetch({ body: {} });
    const result = await call(lm(mock.fetch));
    expect(mock.calls).toHaveLength(0);
    expect(result.error?.code).toBe("invalid_input");
    expect(result.error?.issues.length).toBeGreaterThan(0);
    expect(result.meta.credits.consumed).toBe(0);
  });
});

describe("email.validate", () => {
  it("maps options to API fields", async () => {
    const mock = mockFetch({
      body: { email: "ada@stripe.com", email_status: "valid" },
    });
    await lm(mock.fetch).email.validate(" ada@stripe.com ", {
      includeExtendedInfo: true,
      verificationPolicy: "strict",
    });
    expect(mock.calls[0]?.body).toEqual({
      email: "ada@stripe.com",
      include_extended_info: true,
      verification_policy: "strict",
    });
  });
});

describe("search pages", () => {
  it("people.search maps inputs and reads the page", async () => {
    const mock = mockFetch({
      body: {
        people: [{ full_name: "Ada" }],
        has_more: true,
        next_cursor: "c2",
        credits_consumed: 1,
      },
    });
    const { page } = await lm(mock.fetch).people.search({
      domain: "stripe.com",
      titles: ["CEO"],
      peopleFilters: { seniority: ["c_suite"] } as never,
      limit: 1,
    });
    expect(mock.calls[0]?.url).toBe(`${BASE}/v3/people/search`);
    expect(mock.calls[0]?.body).toEqual({
      company_domain: "stripe.com",
      titles: ["CEO"],
      people_filters: { seniority: ["c_suite"] },
      limit: 1,
    });
    expect(page).toEqual({
      items: [{ full_name: "Ada" }],
      hasMore: true,
      nextCursor: "c2",
      nextOffset: null,
    });
  });

  it("jobs.search reads the cursor from pagination", async () => {
    const mock = mockFetch({
      body: {
        signals: [{ title: "SRE" }],
        pagination: { next_cursor: "j2", has_more: true },
      },
    });
    const { page } = await lm(mock.fetch).jobs.search({
      postedWithin: 7,
      limit: 1,
    });
    expect(mock.calls[0]?.body).toEqual({ postedWithin: 7, limit: 1 });
    expect(page?.nextCursor).toBe("j2");
    expect(page?.hasMore).toBe(true);
  });

  it("localLeads.search sends camelCase filters as snake_case", async () => {
    const mock = mockFetch({
      body: { leads: [], has_more: false, next_cursor: null },
    });
    const { page } = await lm(mock.fetch).localLeads.search({
      country: "US",
      regionCode: "TX",
      categoryContains: "roof",
      hasBusinessEmail: true,
      radiusM: 1000,
    });
    expect(mock.calls[0]?.body).toEqual({
      country: "US",
      region_code: "TX",
      category_contains: "roof",
      has_business_email: true,
      radius_m: 1000,
    });
    expect(page?.hasMore).toBe(false);
  });

  it("companies.lookalikes pages by offset", async () => {
    const full = {
      companies: [{ a: 1 }, { a: 2 }],
      count: 2,
      returned_count: 2,
    };
    const mock = mockFetch({ body: full });
    const { page } = await lm(mock.fetch).companies.lookalikes({
      domain: "stripe.com",
      limit: 2,
      offset: 4,
    });
    expect(page?.nextOffset).toBe(6);
    expect(page?.nextCursor).toBeNull();
    expect(page?.hasMore).toBe(true);

    const short = mockFetch({
      body: { companies: [{ a: 1 }], count: 1, returned_count: 1 },
    });
    const last = await lm(short.fetch).companies.lookalikes({
      domain: "stripe.com",
      limit: 2,
    });
    expect(last.page?.hasMore).toBe(false);
  });
});

describe("searchAll", () => {
  it("follows cursors and stops at maxItems", async () => {
    const mock = mockFetch(
      {
        body: {
          people: [{ id: 1 }, { id: 2 }],
          has_more: true,
          next_cursor: "c2",
        },
      },
      {
        body: {
          people: [{ id: 3 }, { id: 4 }],
          has_more: true,
          next_cursor: "c3",
        },
      }
    );
    const seen: unknown[] = [];
    for await (const person of lm(mock.fetch).people.searchAll(
      { domain: "stripe.com" },
      { maxItems: 3, pageSize: 2 }
    )) {
      seen.push(person);
    }
    expect(seen).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    expect(mock.calls.map((c) => c.body)).toEqual([
      { company_domain: "stripe.com", limit: 2 },
      { company_domain: "stripe.com", limit: 1, cursor: "c2" },
    ]);
  });

  it("stops on the last page", async () => {
    const mock = mockFetch({
      body: { companies: [{ id: 1 }], has_more: false, next_cursor: null },
    });
    const seen: unknown[] = [];
    for await (const company of lm(mock.fetch).companies.searchAll(
      { query: "fintech" },
      { maxItems: 100 }
    )) {
      seen.push(company);
    }
    expect(seen).toHaveLength(1);
    expect(mock.calls).toHaveLength(1);
  });

  it("throws the error of a failed page", async () => {
    const mock = mockFetch({
      status: 410,
      body: problem(410, "snapshot_limit_reached"),
    });
    const iterator = lm(mock.fetch).people.searchAll(
      { query: "cto" },
      { maxItems: 10 }
    );
    await expect(iterator.next()).rejects.toMatchObject({
      code: "snapshot_limit_reached",
      kind: "not_found",
    });
  });
});

describe("account and catalogs", () => {
  it.each([
    [(c: LeadMagic) => c.credits.get(), "/v1/credits"],
    [(c: LeadMagic) => c.analytics.dashboard(), "/v1/analytics/dashboard"],
    [
      (c: LeadMagic) => c.analytics.usage({ days: 7 }),
      "/v1/analytics/usage?days=7",
    ],
    [(c: LeadMagic) => c.analytics.products(), "/v1/analytics/products"],
    [
      (c: LeadMagic) => c.analytics.credits({ days: 30 }),
      "/v1/analytics/credits?days=30",
    ],
    [(c: LeadMagic) => c.analytics.daily(), "/v1/analytics/daily"],
    [
      (c: LeadMagic) =>
        c.analytics.summary({ startDate: "2026-11-01", endDate: "2026-11-25" }),
      "/v1/analytics/summary?start_date=2026-11-01&end_date=2026-11-25",
    ],
    [(c: LeadMagic) => c.jobs.stats(), "/v3/jobs/search/stats"],
    [(c: LeadMagic) => c.jobs.lookup.catalogs(), "/v3/jobs/search/catalogs"],
    [
      (c: LeadMagic) => c.jobs.lookup.titles({ q: "devops", limit: 5 }),
      "/v3/jobs/search/titles?q=devops&limit=5",
    ],
    [
      (c: LeadMagic) => c.jobs.lookup.tags({ q: "react", tagType: 2 }),
      "/v3/jobs/search/tags?q=react&tag_type=2",
    ],
    [
      (c: LeadMagic) => c.jobs.lookup.occupations({ q: "nurse" }),
      "/v3/jobs/search/occupation-taxonomy?q=nurse",
    ],
    [(c: LeadMagic) => c.jobs.catalog.countries(), "/v1/jobs/countries"],
    [(c: LeadMagic) => c.jobs.catalog.jobTypes(), "/v1/jobs/job-types"],
    [(c: LeadMagic) => c.jobs.catalog.companyTypes(), "/v1/jobs/company-types"],
  ] as const)("GET %#", async (call, path) => {
    const mock = mockFetch({ body: [] });
    const { error } = await call(lm(mock.fetch));
    expect(error).toBeNull();
    expect(mock.calls[0]?.method).toBe("GET");
    expect(mock.calls[0]?.url).toBe(`${BASE}${path}`);
  });

  it.each([
    [(c: LeadMagic) => c.jobs.export({ limit: 10 }), "/v3/jobs/search/export"],
    [
      (c: LeadMagic) => c.jobs.resolveFilters({ titles: ["sre"] } as never),
      "/v3/jobs/search/resolve",
    ],
    [
      (c: LeadMagic) => c.jobs.searchStats({ products: ["jobs"] } as never),
      "/v3/search/stats",
    ],
  ] as const)("POST %#", async (call, path) => {
    const mock = mockFetch({ body: {} });
    await call(lm(mock.fetch));
    expect(mock.calls[0]?.method).toBe("POST");
    expect(mock.calls[0]?.url).toBe(`${BASE}${path}`);
  });
});
