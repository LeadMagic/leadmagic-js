/**
 * Runs every method against the public Sandbox, which serves the same paths
 * and error shape as the API with synthetic data. Opt-in
 * (`pnpm test:contract`) because it needs the network.
 */
import { describe, expect, it } from "vitest";
import type { BulkRow, BulkStreamMessage } from "../src/index";
import { LeadMagic } from "../src/index";

const lm = new LeadMagic({ sandbox: true, timeoutMs: 20_000, maxRetries: 1 });

const CALLS: [
  string,
  () => Promise<{ error: unknown; meta: { status: number } }>,
][] = [
  ["credits.get", () => lm.credits.get()],
  ["analytics.dashboard", () => lm.analytics.dashboard()],
  ["analytics.usage", () => lm.analytics.usage({ days: 7 })],
  ["analytics.products", () => lm.analytics.products()],
  ["analytics.credits", () => lm.analytics.credits()],
  ["analytics.summary", () => lm.analytics.summary()],
  ["analytics.daily", () => lm.analytics.daily()],
  ["analytics.day", () => lm.analytics.day("2026-11-25")],
  ["email.validate", () => lm.email.validate("ada@stripe.com")],
  [
    "email.find",
    () =>
      lm.email.find({
        firstName: "Ada",
        lastName: "Lovelace",
        domain: "stripe.com",
      }),
  ],
  [
    "email.findPersonal",
    () => lm.email.findPersonal({ profileUrl: "ada-lovelace" }),
  ],
  [
    "email.fromProfile",
    () => lm.email.fromProfile({ profileUrl: "ada-lovelace" }),
  ],
  [
    "people.search",
    () => lm.people.search({ domain: "stripe.com", titles: ["CEO"], limit: 2 }),
  ],
  [
    "people.getProfile",
    () => lm.people.getProfile({ profileUrl: "ada-lovelace" }),
  ],
  [
    "people.fromEmail",
    () => lm.people.fromEmail({ workEmail: "ada@stripe.com" }),
  ],
  [
    "people.findMobile",
    () => lm.people.findMobile({ profileUrl: "ada-lovelace" }),
  ],
  [
    "people.findByRole",
    () => lm.people.findByRole({ jobTitle: "CEO", domain: "stripe.com" }),
  ],
  [
    "people.findEmployees",
    () => lm.people.findEmployees({ domain: "stripe.com", limit: 3 }),
  ],
  [
    "people.detectJobChange",
    () =>
      lm.people.detectJobChange({
        profileUrl: "ada-lovelace",
        domain: "stripe.com",
      }),
  ],
  [
    "companies.search",
    () => lm.companies.search({ query: "payments", limit: 2 }),
  ],
  ["companies.find", () => lm.companies.find({ domain: "stripe.com" })],
  [
    "companies.lookalikes",
    () => lm.companies.lookalikes({ domain: "stripe.com", limit: 2 }),
  ],
  ["companies.funding", () => lm.companies.funding({ domain: "stripe.com" })],
  [
    "companies.competitors",
    () => lm.companies.competitors({ domain: "stripe.com" }),
  ],
  [
    "companies.technographics",
    () => lm.companies.technographics({ domain: "stripe.com" }),
  ],
  [
    "localLeads.search",
    () => lm.localLeads.search({ country: "US", categoryContains: "roof" }),
  ],
  ["localLeads.categories", () => lm.localLeads.categories({ q: "roof" })],
  ["jobs.search", () => lm.jobs.search({ postedWithin: 7, limit: 2 })],
  ["jobs.export", () => lm.jobs.export({ limit: 2 })],
  [
    "jobs.resolveFilters",
    () => lm.jobs.resolveFilters({ titles: ["devops engineer"] } as never),
  ],
  ["jobs.searchStats", () => lm.jobs.searchStats({} as never)],
  ["jobs.stats", () => lm.jobs.stats()],
  ["jobs.lookup.catalogs", () => lm.jobs.lookup.catalogs()],
  ["jobs.lookup.companies", () => lm.jobs.lookup.companies({ q: "stripe" })],
  ["jobs.lookup.titles", () => lm.jobs.lookup.titles({ q: "devops" })],
  ["jobs.lookup.roles", () => lm.jobs.lookup.roles({ q: "engineer" })],
  ["jobs.lookup.tags", () => lm.jobs.lookup.tags({ q: "react" })],
  ["jobs.lookup.locations", () => lm.jobs.lookup.locations({ q: "austin" })],
  ["jobs.lookup.occupations", () => lm.jobs.lookup.occupations({ q: "nurse" })],
  ["jobs.catalog.countries", () => lm.jobs.catalog.countries()],
  ["jobs.catalog.regions", () => lm.jobs.catalog.regions()],
  ["jobs.catalog.jobTypes", () => lm.jobs.catalog.jobTypes()],
  ["jobs.catalog.companyTypes", () => lm.jobs.catalog.companyTypes()],
  ["jobs.catalog.industries", () => lm.jobs.catalog.industries()],
  ["ads.google", () => lm.ads.google({ domain: "stripe.com", limit: 2 })],
  ["ads.meta", () => lm.ads.meta({ domain: "stripe.com", limit: 2 })],
  ["ads.b2b", () => lm.ads.b2b({ domain: "stripe.com", limit: 2 })],
  ["ads.b2bDetails", () => lm.ads.b2bDetails({ adUrl: "123456" })],
  ["bulk.capabilities", () => lm.bulk.capabilities()],
  ["bulk.list", () => lm.bulk.list({ limit: 2 })],
  [
    "bulk.validate",
    () =>
      lm.bulk.validate({
        product: "email_validation",
        rows: [{ email: "ada@stripe.com" }],
      }),
  ],
  [
    "bulk.quoteLocalLeads",
    () =>
      lm.bulk.quoteLocalLeads({ keywords: ["dentist"], cities: ["Austin"] }),
  ],
];

describe("Sandbox contract", () => {
  it.each(CALLS)("%s answers 2xx", async (_name, call) => {
    const { error, meta } = await call();
    expect(error).toBeNull();
    expect(meta.status).toBeGreaterThanOrEqual(200);
    expect(meta.status).toBeLessThan(300);
  });

  it("lookups report found on a found outcome", async () => {
    const { found } = await lm.email.find(
      { firstName: "Ada", lastName: "Lovelace", domain: "stripe.com" },
      { sandboxOutcome: "found" }
    );
    expect(found).toBe(true);
  });

  it("pages read rows", async () => {
    const { page } = await lm.people.search({ domain: "stripe.com", limit: 2 });
    expect(Array.isArray(page?.items)).toBe(true);
  });

  it("runs a bulk job end to end", async () => {
    const submitted = await lm.bulk.submit({
      product: "email_validation",
      rows: [{ email: "ada@stripe.com" }, { email: "grace@stripe.com" }],
    });
    expect(submitted.error).toBeNull();
    const jobId = submitted.data?.jobId as string;

    const done = await lm.bulk.wait(jobId, {
      pollIntervalMs: 500,
      timeoutMs: 30_000,
    });
    expect(done.error).toBeNull();
    expect(done.data?.status).toBe("completed");

    const { page } = await lm.bulk.results(jobId);
    expect(page?.items.length).toBe(2);
    const all: BulkRow[] = [];
    for await (const row of lm.bulk.resultsAll(jobId, {}, { pageSize: 1 })) {
      all.push(row);
    }
    expect(all.length).toBe(2);

    const csv = await lm.bulk.download(jobId);
    expect(csv.data).toMatch(/^row_index,status/u);

    for (const call of [
      () => lm.bulk.errors(jobId),
      () => lm.bulk.events(jobId, { limit: 5 }),
      () => lm.bulk.setPriority(jobId, 10),
      () => lm.bulk.pause(jobId),
      () => lm.bulk.resume(jobId),
      () => lm.bulk.restart(jobId, { mode: "failed_only" }),
      () => lm.bulk.cancel(jobId),
    ]) {
      // biome-ignore lint/performance/noAwaitInLoops: lifecycle calls run in order.
      const { error } = await call();
      expect(error).toBeNull();
    }
  }, 60_000);

  it("streams a bulk job until it ends", async () => {
    const submitted = await lm.bulk.submit({
      product: "email_validation",
      rows: [{ email: "ada@stripe.com" }],
    });
    const jobId = submitted.data?.jobId as string;
    const seen: BulkStreamMessage[] = [];
    for await (const message of lm.bulk.stream(jobId, {
      signal: AbortSignal.timeout(30_000),
    })) {
      seen.push(message);
    }
    expect(seen.some((m) => m.type === "progress")).toBe(true);
    const last = seen.at(-1);
    expect(
      last?.type === "closed" || (last?.type === "progress" && last.isTerminal)
    ).toBe(true);
  }, 40_000);

  it.each([
    ["400", "invalid_input"],
    ["401", "auth"],
    ["402", "billing"],
    ["404", "not_found"],
    ["429", "rate_limit"],
    ["500", "unavailable"],
  ] as const)("outcome %s becomes kind %s", async (outcome, kind) => {
    const { error } = await lm.credits.get({
      sandboxOutcome: outcome,
      maxRetries: 0,
    });
    expect(error).toMatchObject({ kind, status: Number(outcome) });
  });
});
