import { describe, expect, it } from "vitest";
import {
  adsSchemas,
  analyticsSchemas,
  companiesSchemas,
  emailSchemas,
  localLeadsSchemas,
  peopleSchemas,
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
