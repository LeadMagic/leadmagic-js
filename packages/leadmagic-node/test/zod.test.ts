import { describe, expect, it } from "vitest";
import {
  adsSchemas,
  analyticsSchemas,
  batchSchemas,
  budgetsSchemas,
  bulkSchemas,
  companiesSchemas,
  emailSchemas,
  localLeadsSchemas,
  peopleSchemas,
  suppressionListsSchemas,
} from "../src/zod/index";

const messages = (result: {
  success: boolean;
  error?: { issues: { message: string }[] };
}) => result.error?.issues.map((issue) => issue.message) ?? [];

describe("zod schemas", () => {
  it("accept what the client accepts", () => {
    expect(
      emailSchemas.find.parse({ firstName: " Ada ", domain: "stripe.com" })
    ).toEqual({
      firstName: "Ada",
      domain: "stripe.com",
    });
    expect(
      peopleSchemas.findByRole.safeParse({
        jobTitle: "CEO",
        domain: "stripe.com",
      }).success
    ).toBe(true);
    expect(
      companiesSchemas.lookalikes.safeParse({ description: "payments APIs" })
        .success
    ).toBe(true);
    expect(
      adsSchemas.google.safeParse({ domain: "stripe.com", limit: 5 }).success
    ).toBe(true);
    expect(
      localLeadsSchemas.search.safeParse({ country: "US", category: "Roofer" })
        .success
    ).toBe(true);
    expect(analyticsSchemas.day.safeParse("2026-11-25").success).toBe(true);
  });

  it("reject with the client's messages", () => {
    expect(
      messages(emailSchemas.validate.safeParse({ email: "nope" }))
    ).toEqual(["That is not an email address."]);
    expect(messages(emailSchemas.find.safeParse({ firstName: "Ada" }))).toEqual(
      ["Pass a name with a domain or company name, or a profileUrl."]
    );
    expect(
      messages(peopleSchemas.findByRole.safeParse({ jobTitle: "CEO" }))
    ).toEqual([
      "Pass a jobTitle and a domain, companyName or companyProfileUrl.",
    ]);
    expect(messages(peopleSchemas.search.safeParse({ limit: 10 }))).toEqual([
      "Pass at least one filter: a company, titles, roles, a query or filters.",
    ]);
    expect(
      messages(localLeadsSchemas.search.safeParse({ cursor: "x" }))
    ).toEqual(["Pass at least one filter, such as country and category."]);
  });

  it("enforce page sizes", () => {
    expect(
      peopleSchemas.search.safeParse({ query: "cto", limit: 51 }).success
    ).toBe(false);
    expect(
      companiesSchemas.search.safeParse({ query: "fintech", limit: 50 }).success
    ).toBe(true);
    expect(analyticsSchemas.days.safeParse({ days: 91 }).success).toBe(false);
  });

  it("implement Standard Schema", () => {
    const standard = emailSchemas.validate["~standard"];
    expect(standard.vendor).toBe("zod");
    expect(standard.version).toBe(1);
  });
});

describe("bulk schemas", () => {
  it("accept a submission and keep the client's messages", () => {
    expect(
      bulkSchemas.submit.safeParse({
        product: "email_validation",
        rows: [{ email: "ada@stripe.com" }],
        callback: { url: "https://example.com/hook", events: ["completed"] },
      }).success
    ).toBe(true);
    const twoSources = bulkSchemas.submit.safeParse({
      product: "email_validation",
      rows: [{}],
      csv: "email\na@b.com",
    });
    expect(messages(twoSources)).toEqual([
      "Pass exactly one of rows, csv or fileUrl.",
    ]);
    expect(twoSources.error?.issues[0]?.path).toEqual(["rows"]);
    const tooMany = bulkSchemas.localLeads.safeParse({
      keywords: Array.from({ length: 11 }, (_, i) => `k${i}`),
      cities: Array.from({ length: 10 }, (_, i) => `c${i}`),
    });
    expect(messages(tooMany)).toEqual([
      "keywords × cities must be at most 100 searches. Split the job.",
    ]);
    expect(
      messages(bulkSchemas.restart.safeParse({ mode: "from_row" }))
    ).toEqual(["Pass startRowIndex with mode from_row."]);
    expect(bulkSchemas.priority.safeParse(1001).success).toBe(false);
  });
});

describe("batch and cost-control schemas", () => {
  it("accept valid input and keep the client's messages", () => {
    const item = { product: "email_validation", input: { email: "a@b.com" } };
    expect(batchSchemas.submit.safeParse({ items: [item] }).success).toBe(true);
    const noInput = batchSchemas.submit.safeParse({
      items: [{ product: "email_validation", input: {} }, { product: "x" }],
    });
    expect(noInput.success).toBe(false);
    expect(messages(batchSchemas.submit.safeParse({ items: [] }))).toEqual([
      "Pass 1 to 500 items.",
    ]);
    expect(
      budgetsSchemas.create.safeParse({
        scope: "client",
        scopeValue: "cl_1",
        maxCredits: 100,
        period: "monthly",
      }).success
    ).toBe(true);
    expect(messages(budgetsSchemas.update.safeParse({}))).toEqual([
      "Pass maxCredits or period.",
    ]);
    const emails = suppressionListsSchemas.emails.safeParse([
      "a@b.com",
      "nope",
    ]);
    expect(messages(emails)).toEqual(["emails[1] is not an email address."]);
    expect(emails.error?.issues[0]?.path).toEqual([1]);
  });
});
