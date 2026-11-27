import { describe, expect, it } from "vitest";
import { LeadMagic } from "../src/index";
import { mockFetch, problem } from "./helpers";

const apiKey = "lm_live_test_key_123";
const lm = (fetch: typeof globalThis.fetch) =>
  new LeadMagic({ apiKey, fetch, maxRetries: 0 });
const BASE = "https://api.leadmagic.io";
const BATCH = "b6f1c1e2-0001-4000-8000-000000000001";
const item = {
  product: "email_validation",
  input: { email: "ada@stripe.com" },
};

describe("batch requests", () => {
  it.each([
    [
      "batch.submit",
      (c: LeadMagic) =>
        c.batch.submit({
          items: [{ ...item, clientName: "Acme" }],
          clientId: "cl_1",
          webhookUrl: "https://example.com/hook",
          priority: "low",
        }),
      "POST",
      "/v1/batch",
      {
        items: [{ ...item, client_name: "Acme" }],
        client_id: "cl_1",
        webhook_url: "https://example.com/hook",
        priority: "low",
      },
    ],
    [
      "batch.previewCost",
      (c: LeadMagic) => c.batch.previewCost({ items: [item] }),
      "POST",
      "/v1/batch/preview-cost",
      { items: [item] },
    ],
    [
      "batch.list",
      (c: LeadMagic) => c.batch.list({ status: "running", clientId: "cl_1" }),
      "GET",
      "/v1/batch?limit=50&offset=0&status=running&client_id=cl_1",
      undefined,
    ],
    [
      "batch.get",
      (c: LeadMagic) => c.batch.get(BATCH),
      "GET",
      `/v1/batch/${BATCH}`,
      undefined,
    ],
    [
      "batch.results",
      (c: LeadMagic) => c.batch.results(BATCH, { status: "failed", limit: 10 }),
      "GET",
      `/v1/batch/${BATCH}/results?limit=10&offset=0&status=failed`,
      undefined,
    ],
    [
      "batch.update",
      (c: LeadMagic) =>
        c.batch.update(BATCH, {
          metadata: { campaign: "q4" },
          clientId: "cl_2",
        }),
      "PATCH",
      `/v1/mixed/batch/${BATCH}`,
      { metadata: { campaign: "q4" }, client_id: "cl_2" },
    ],
    [
      "batch.campaignMetrics",
      (c: LeadMagic) => c.batch.campaignMetrics("q4"),
      "GET",
      "/v1/batch/campaign/q4/metrics",
      undefined,
    ],
    [
      "batch.clients.create",
      (c: LeadMagic) =>
        c.batch.clients.create({ name: "Acme", contactEmail: "ops@acme.com" }),
      "POST",
      "/v1/batch/clients",
      { name: "Acme", contact_email: "ops@acme.com" },
    ],
    [
      "batch.clients.list",
      (c: LeadMagic) => c.batch.clients.list({ limit: 10 }),
      "GET",
      "/v1/batch/clients?limit=10&offset=0",
      undefined,
    ],
    [
      "batch.clients.metrics",
      (c: LeadMagic) => c.batch.clients.metrics("cl_1"),
      "GET",
      "/v1/batch/clients/cl_1/metrics",
      undefined,
    ],
    [
      "batch.clients.webhooks",
      (c: LeadMagic) => c.batch.clients.webhooks("cl_1"),
      "GET",
      "/v1/batch/clients/cl_1/webhooks",
      undefined,
    ],
    [
      "batch.providers.list",
      (c: LeadMagic) => c.batch.providers.list(),
      "GET",
      "/v1/batch/providers",
      undefined,
    ],
    [
      "batch.providers.create",
      (c: LeadMagic) =>
        c.batch.providers.create({
          name: "My API",
          baseUrl: "https://api.example.com",
          authType: "bearer",
          authCredentialName: "Authorization",
          authCredentialValue: "token",
        }),
      "POST",
      "/v1/batch/providers",
      {
        name: "My API",
        baseUrl: "https://api.example.com",
        authType: "bearer",
        authCredentialName: "Authorization",
        authCredentialValue: "token",
      },
    ],
    [
      "budgets.create",
      (c: LeadMagic) =>
        c.budgets.create({
          scope: "client",
          scopeValue: "cl_1",
          maxCredits: 5000,
          period: "monthly",
        }),
      "POST",
      "/v1/batch/budgets",
      {
        scope: "client",
        scope_value: "cl_1",
        max_credits: 5000,
        period: "monthly",
      },
    ],
    [
      "budgets.list",
      (c: LeadMagic) => c.budgets.list(),
      "GET",
      "/v1/batch/budgets",
      undefined,
    ],
    [
      "budgets.status",
      (c: LeadMagic) => c.budgets.status(),
      "GET",
      "/v1/batch/budgets/status",
      undefined,
    ],
    [
      "budgets.update",
      (c: LeadMagic) => c.budgets.update("bud_1", { maxCredits: 9000 }),
      "PATCH",
      "/v1/batch/budgets/bud_1",
      { max_credits: 9000 },
    ],
    [
      "budgets.delete",
      (c: LeadMagic) => c.budgets.delete("bud_1"),
      "DELETE",
      "/v1/batch/budgets/bud_1",
      undefined,
    ],
    [
      "suppressionLists.create",
      (c: LeadMagic) =>
        c.suppressionLists.create("do-not-contact", [" ada@stripe.com "]),
      "POST",
      "/v1/batch/suppression-lists",
      { list_id: "do-not-contact", emails: ["ada@stripe.com"] },
    ],
    [
      "suppressionLists.list",
      (c: LeadMagic) => c.suppressionLists.list(),
      "GET",
      "/v1/batch/suppression-lists",
      undefined,
    ],
    [
      "suppressionLists.get",
      (c: LeadMagic) => c.suppressionLists.get("do-not-contact", { limit: 2 }),
      "GET",
      "/v1/batch/suppression-lists/do-not-contact?limit=2&offset=0",
      undefined,
    ],
    [
      "suppressionLists.delete",
      (c: LeadMagic) => c.suppressionLists.delete("do-not-contact"),
      "DELETE",
      "/v1/batch/suppression-lists/do-not-contact",
      undefined,
    ],
    [
      "suppressionLists.addEmails",
      (c: LeadMagic) =>
        c.suppressionLists.addEmails("do-not-contact", ["grace@stripe.com"]),
      "POST",
      "/v1/batch/suppression-lists/do-not-contact/emails",
      { emails: ["grace@stripe.com"] },
    ],
    [
      "suppressionLists.removeEmails",
      (c: LeadMagic) =>
        c.suppressionLists.removeEmails("do-not-contact", ["grace@stripe.com"]),
      "DELETE",
      "/v1/batch/suppression-lists/do-not-contact/emails",
      { emails: ["grace@stripe.com"] },
    ],
  ] as const)("%s sends %s %s", async (_name, call, method, path, body) => {
    const mock = mockFetch({
      body: { batchId: BATCH, emails: [], total: 0, batches: [], items: [] },
    });
    const { error } = await call(lm(mock.fetch));
    expect(error).toBeNull();
    expect(mock.calls[0]?.method).toBe(method);
    expect(mock.calls[0]?.url).toBe(`${BASE}${path}`);
    expect(mock.calls[0]?.body).toEqual(body);
  });

  it("retries a submit with the same idempotency key", async () => {
    const mock = mockFetch(
      { status: 503, body: {}, headers: { "retry-after": "0" } },
      { status: 202, body: { batchId: BATCH } }
    );
    const client = new LeadMagic({ apiKey, fetch: mock.fetch, maxRetries: 1 });
    const { error } = await client.batch.submit({ items: [item] });
    expect(error).toBeNull();
    const [first, second] = mock.calls;
    expect(first?.headers["x-idempotency-key"]).toBeTruthy();
    expect(second?.headers["x-idempotency-key"]).toBe(
      first?.headers["x-idempotency-key"]
    );
  });

  it("reads budget_exceeded as billing", async () => {
    const mock = mockFetch({
      status: 402,
      body: problem(402, "budget_exceeded"),
    });
    const { error } = await lm(mock.fetch).batch.submit({ items: [item] });
    expect(error).toMatchObject({ code: "budget_exceeded", kind: "billing" });
  });
});

describe("batch input checks", () => {
  it.each([
    ["no items", { items: [] }, ["items"]],
    [
      "501 items",
      { items: Array.from({ length: 501 }, () => item) },
      ["items"],
    ],
    [
      "an item without input",
      { items: [{ product: "email_finder" }] },
      ["items.0"],
    ],
    ["an item without product", { items: [{ input: {} }] }, ["items.0"]],
    [
      "an http webhook",
      { items: [item], webhookUrl: "http://x.com" },
      ["webhookUrl"],
    ],
    [
      "a body over 1 MB",
      {
        items: Array.from({ length: 300 }, () => ({
          product: "email_validation",
          input: { email: "a@b.com", note: "x".repeat(4000) },
        })),
      },
      ["items"],
    ],
  ])("refuses %s without a request", async (_name, input, param) => {
    const mock = mockFetch({ body: {} });
    const { error } = await lm(mock.fetch).batch.submit(
      input as unknown as Parameters<LeadMagic["batch"]["submit"]>[0]
    );
    expect(error?.kind).toBe("invalid_input");
    expect(error?.param).toEqual(param);
    expect(mock.calls).toHaveLength(0);
  });

  it("refuses bad budgets, emails and empty updates", async () => {
    const mock = mockFetch({ body: {} });
    const c = lm(mock.fetch);
    expect(
      (
        await c.budgets.create({
          scope: "client",
          scopeValue: "cl_1",
          maxCredits: 0,
        })
      ).error?.param
    ).toEqual(["maxCredits"]);
    expect(
      (
        await c.budgets.create({
          scope: "team" as "client",
          scopeValue: "x",
          maxCredits: 1,
        })
      ).error?.param
    ).toEqual(["scope"]);
    expect((await c.budgets.update("bud_1", {})).error?.param).toEqual([
      "maxCredits",
      "period",
    ]);
    expect(
      (await c.suppressionLists.addEmails("l", ["not-an-email"])).error?.param
    ).toEqual(["emails.0"]);
    expect(
      (await c.suppressionLists.create(" ", ["a@b.com"])).error?.param
    ).toEqual(["listId"]);
    expect((await c.batch.update(BATCH, {})).error?.param).toEqual([
      "metadata",
      "clientId",
    ]);
    expect(mock.calls).toHaveLength(0);
  });
});

describe("batch results and wait", () => {
  it("pages results by offset", async () => {
    const rows = (n: number, from: number) =>
      Array.from({ length: n }, (_, i) => ({
        id: `i${from + i}`,
        itemIndex: from + i,
        status: "succeeded",
      }));
    const mock = mockFetch(
      { body: { items: rows(2, 0), limit: 2, offset: 0 } },
      { body: { items: rows(1, 2), limit: 2, offset: 2 } }
    );
    const seen: number[] = [];
    for await (const row of lm(mock.fetch).batch.resultsAll(
      BATCH,
      {},
      { pageSize: 2 }
    )) {
      seen.push(row.itemIndex);
    }
    expect(seen).toEqual([0, 1, 2]);
  });

  it("pages a suppression list by its total", async () => {
    const mock = mockFetch({
      body: {
        listId: "l",
        emails: ["h1", "h2"],
        limit: 2,
        offset: 0,
        total: 3,
      },
    });
    const { page } = await lm(mock.fetch).suppressionLists.get("l", {
      limit: 2,
    });
    expect(page).toMatchObject({
      items: ["h1", "h2"],
      nextOffset: 2,
      hasMore: true,
    });
  });

  it("waits until the batch is final", async () => {
    const batch = (status: string) => ({
      batchId: BATCH,
      status,
      totalItems: 1,
      succeededItems: status === "running" ? 0 : 1,
      failedItems: 0,
    });
    const mock = mockFetch(
      { body: batch("running") },
      { body: batch("partial") }
    );
    const { data, error } = await lm(mock.fetch).batch.wait(BATCH, {
      pollIntervalMs: 1,
    });
    expect(error).toBeNull();
    expect(data?.status).toBe("partial");
    expect(mock.calls).toHaveLength(2);
  });
});
