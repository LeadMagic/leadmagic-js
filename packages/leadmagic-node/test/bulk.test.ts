import { describe, expect, it } from "vitest";
import type { BulkStreamMessage } from "../src/index";
import { LeadMagic } from "../src/index";
import { mockFetch, problem } from "./helpers";

const apiKey = "lm_live_test_key_123";
const lm = (fetch: typeof globalThis.fetch) =>
  new LeadMagic({ apiKey, fetch, maxRetries: 0 });
const BASE = "https://api.leadmagic.io";
const JOB = "6b09a269-0002-4000-8d74-de3a0fe9da1d";

const job = (status: string, processed = 0) => ({
  job_id: JOB,
  status,
  total_rows: 2,
  processed_items: processed,
  succeeded_items: processed,
  failed_items: 0,
  skipped_items: 0,
  created_at: "2026-11-27T15:31:53.000Z",
});

describe("bulk requests", () => {
  it.each([
    [
      "submit",
      (c: LeadMagic) =>
        c.bulk.submit(
          {
            product: "email_validation",
            rows: [{ email: "ada@stripe.com" }],
            callback: { url: "https://example.com/hook", secret: "s3cret" },
          },
          { idempotencyKey: "import-2026-11-27" }
        ),
      "POST",
      "/bulk/submit",
      {
        product: "email_validation",
        rows: [{ email: "ada@stripe.com" }],
        callback: {
          url: "https://example.com/hook",
          secret: "s3cret",
          events: ["completed"],
        },
      },
    ],
    [
      "validate",
      (c: LeadMagic) =>
        c.bulk.validate({ product: "email_finder", csv: "email\na@b.com" }),
      "POST",
      "/bulk/validate",
      { product: "email_finder", csv: "email\na@b.com" },
    ],
    [
      "quoteLocalLeads",
      (c: LeadMagic) =>
        c.bulk.quoteLocalLeads({
          keywords: ["dentist"],
          cities: ["Austin, TX"],
        }),
      "POST",
      "/bulk/local-leads",
      { keywords: ["dentist"], cities: ["Austin, TX"], dryRun: true },
    ],
    [
      "get",
      (c: LeadMagic) => c.bulk.get(JOB),
      "GET",
      `/bulk/jobs/${JOB}`,
      undefined,
    ],
    [
      "list",
      (c: LeadMagic) => c.bulk.list({ status: "completed", limit: 5 }),
      "GET",
      "/bulk/jobs?limit=5&offset=0&status=completed",
      undefined,
    ],
    [
      "events",
      (c: LeadMagic) => c.bulk.events(JOB, { limit: 10 }),
      "GET",
      `/bulk/jobs/${JOB}/events?limit=10`,
      undefined,
    ],
    [
      "pause",
      (c: LeadMagic) => c.bulk.pause(JOB),
      "POST",
      `/bulk/jobs/${JOB}/pause`,
      undefined,
    ],
    [
      "resume",
      (c: LeadMagic) => c.bulk.resume(JOB),
      "POST",
      `/bulk/jobs/${JOB}/resume`,
      undefined,
    ],
    [
      "restart",
      (c: LeadMagic) => c.bulk.restart(JOB, { mode: "failed_only" }),
      "POST",
      `/bulk/jobs/${JOB}/restart`,
      { mode: "failed_only" },
    ],
    [
      "setPriority",
      (c: LeadMagic) => c.bulk.setPriority(JOB, 10),
      "PATCH",
      `/bulk/jobs/${JOB}/priority`,
      { priority: 10 },
    ],
    [
      "capabilities",
      (c: LeadMagic) => c.bulk.capabilities(),
      "GET",
      "/bulk/capabilities",
      undefined,
    ],
  ] as const)("%s sends %s %s", async (_name, call, method, path, body) => {
    const mock = mockFetch({
      body: { jobId: JOB, paused: true, resumed: true, rows: [], jobs: [] },
    });
    const { error } = await call(lm(mock.fetch));
    expect(error).toBeNull();
    expect(mock.calls[0]?.method).toBe(method);
    expect(mock.calls[0]?.url).toBe(`${BASE}${path}`);
    expect(mock.calls[0]?.body).toEqual(body);
  });

  it("does not retry a submit, which the API does not de-duplicate", async () => {
    const mock = mockFetch({
      status: 502,
      body: problem(502, "external_service_error"),
      headers: { "retry-after": "0" },
    });
    const client = new LeadMagic({ apiKey, fetch: mock.fetch, maxRetries: 2 });
    const { error } = await client.bulk.submit({
      product: "email_validation",
      rows: [{ email: "a@b.com" }],
    });
    expect(error?.code).toBe("external_service_error");
    expect(mock.calls).toHaveLength(1);
  });

  it("sends local leads with the same idempotency key in the header and the body", async () => {
    const mock = mockFetch(
      {
        status: 503,
        body: problem(503, "service_unavailable"),
        headers: { "retry-after": "0" },
      },
      { status: 202, body: { jobId: JOB, status: "queued" } }
    );
    const client = new LeadMagic({ apiKey, fetch: mock.fetch, maxRetries: 1 });
    const { error } = await client.bulk.localLeads({
      keywords: ["dentist"],
      cities: ["78704"],
    });
    expect(error).toBeNull();
    const [first, second] = mock.calls as [
      (typeof mock.calls)[0],
      (typeof mock.calls)[0],
    ];
    const key = first.headers["x-idempotency-key"];
    expect(key).toBeTruthy();
    expect(first.body).toMatchObject({ idempotencyKey: key });
    expect(second.headers["x-idempotency-key"]).toBe(key);
    expect(second.body).toMatchObject({ idempotencyKey: key });
  });

  it("reports a pause or resume the API declined as a conflict", async () => {
    const mock = mockFetch(
      { body: { jobId: JOB, paused: false, status: "paused" } },
      { body: { jobId: JOB, resumed: false, status: "running" } }
    );
    const client = lm(mock.fetch);
    const paused = await client.bulk.pause(JOB);
    expect(paused.error).toMatchObject({
      code: "job_not_pausable",
      kind: "conflict",
    });
    const resumed = await client.bulk.resume(JOB);
    expect(resumed.error?.code).toBe("job_not_resumable");
  });

  it("names a refused restart", async () => {
    const mock = mockFetch({
      status: 409,
      body: {
        jobId: JOB,
        restarted: false,
        reason: "Cannot restart an active job.",
      },
    });
    const { error } = await lm(mock.fetch).bulk.restart(JOB);
    expect(error).toMatchObject({
      code: "job_not_restartable",
      kind: "conflict",
      message: "Cannot restart an active job.",
    });
  });

  it("cancels by pausing, then rejecting", async () => {
    const mock = mockFetch(
      { body: { jobId: JOB, paused: false, status: "paused" } },
      { body: { jobId: JOB, status: "canceled" } }
    );
    const { data, error } = await lm(mock.fetch).bulk.cancel(JOB);
    expect(error).toBeNull();
    expect(data?.status).toBe("canceled");
    expect(mock.calls.map((c) => [c.url, c.body])).toEqual([
      [`${BASE}/bulk/jobs/${JOB}/pause`, undefined],
      [`${BASE}/bulk/jobs/${JOB}/review`, { action: "reject" }],
    ]);
  });
});

describe("bulk input checks", () => {
  it.each([
    ["no source", { product: "email_validation" }, ["rows", "csv", "fileUrl"]],
    [
      "two sources",
      { product: "email_validation", rows: [{ email: "a@b.com" }], csv: "x" },
      ["rows", "csv", "fileUrl"],
    ],
    ["no product", { product: " ", rows: [{}] }, ["product"]],
    [
      "http callback",
      {
        product: "email_validation",
        rows: [{}],
        callback: { url: "http://example.com" },
      },
      ["callback.url"],
    ],
    [
      "an http fileUrl",
      { product: "email_validation", fileUrl: "http://example.com/a.csv" },
      ["fileUrl"],
    ],
    [
      "local_leads_finder",
      { product: "local_leads_finder", rows: [{}] },
      ["product"],
    ],
    [
      "priority out of range",
      { product: "email_validation", rows: [{}], priority: 5000 },
      ["priority"],
    ],
  ])("refuses %s without a request", async (_name, input, param) => {
    const mock = mockFetch({ body: {} });
    const { error, meta } = await lm(mock.fetch).bulk.submit(
      input as Parameters<LeadMagic["bulk"]["submit"]>[0]
    );
    expect(error?.kind).toBe("invalid_input");
    expect(error?.param).toEqual(param);
    expect(meta.credits.consumed).toBe(0);
    expect(mock.calls).toHaveLength(0);
  });

  it("refuses a missing job id, a bad priority and an incomplete restart", async () => {
    const mock = mockFetch({ body: {} });
    const client = lm(mock.fetch);
    expect((await client.bulk.get("")).error?.param).toEqual(["jobId"]);
    expect((await client.bulk.setPriority(JOB, 1.5)).error?.param).toEqual([
      "priority",
    ]);
    expect(
      (await client.bulk.restart(JOB, { mode: "from_row" })).error?.param
    ).toEqual(["startRowIndex"]);
    expect(
      (
        await client.bulk.localLeads({
          keywords: Array.from({ length: 11 }, (_, i) => `k${i}`),
          cities: Array.from({ length: 10 }, (_, i) => `c${i}`),
        })
      ).error?.param
    ).toEqual(["keywords", "cities"]);
    expect(mock.calls).toHaveLength(0);
  });
});

describe("bulk results", () => {
  it("pages results by offset", async () => {
    const rows = (n: number, from: number) =>
      Array.from({ length: n }, (_, i) => ({
        id: `r${from + i}`,
        row_index: from + i,
        status: "completed",
      }));
    const mock = mockFetch(
      { body: { rows: rows(2, 0), limit: 2, offset: 0 } },
      { body: { rows: rows(1, 2), limit: 2, offset: 2 } }
    );
    const seen: number[] = [];
    for await (const row of lm(mock.fetch).bulk.resultsAll(
      JOB,
      {},
      { pageSize: 2 }
    )) {
      seen.push(row.row_index);
    }
    expect(seen).toEqual([0, 1, 2]);
    expect(mock.calls.map((c) => c.url)).toEqual([
      `${BASE}/bulk/jobs/${JOB}/results?limit=2&offset=0`,
      `${BASE}/bulk/jobs/${JOB}/results?limit=2&offset=2`,
    ]);
  });

  it("pages failed rows", async () => {
    const mock = mockFetch({
      body: {
        rows: [{ id: "r1", row_index: 4, error_message: "Invalid email" }],
        limit: 1,
        offset: 0,
      },
    });
    const { page } = await lm(mock.fetch).bulk.errors(JOB, { limit: 1 });
    expect(page?.items[0]?.error_message).toBe("Invalid email");
    expect(page?.nextOffset).toBe(1);
  });

  it("returns the CSV download as text", async () => {
    const csv = "row_index,status,email\n0,completed,ada@stripe.com\n";
    const mock = mockFetch(
      () =>
        new Response(csv, {
          status: 200,
          headers: { "content-type": "text/csv" },
        })
    );
    const { data, error } = await lm(mock.fetch).bulk.download(JOB);
    expect(error).toBeNull();
    expect(data).toBe(csv);
    expect(mock.calls[0]?.headers.accept).toMatch(/text\/csv/u);
  });

  it("reads a failed download as an error", async () => {
    const mock = mockFetch({
      status: 404,
      body: problem(404, "job_not_found"),
    });
    const { error } = await lm(mock.fetch).bulk.download(JOB);
    expect(error?.code).toBe("job_not_found");
    expect(error?.kind).toBe("not_found");
  });
});

describe("bulk.wait", () => {
  it("polls until the job is final", async () => {
    const mock = mockFetch(
      { body: job("queued") },
      { body: job("processing", 1) },
      { body: job("completed", 2) }
    );
    const seen: string[] = [];
    const { data, error } = await lm(mock.fetch).bulk.wait(JOB, {
      pollIntervalMs: 1,
      onProgress: (j) => seen.push(j.status),
    });
    expect(error).toBeNull();
    expect(data?.status).toBe("completed");
    expect(seen).toEqual(["queued", "processing", "completed"]);
  });

  it("returns a timeout error while the job is still running", async () => {
    const mock = mockFetch({ body: job("processing") });
    const { error } = await lm(mock.fetch).bulk.wait(JOB, {
      pollIntervalMs: 500,
      timeoutMs: 1,
    });
    expect(error?.code).toBe("timeout");
    expect(error?.context).toMatchObject({ job_id: JOB, status: "processing" });
  });

  it("returns the API error", async () => {
    const mock = mockFetch({
      status: 404,
      body: problem(404, "job_not_found"),
    });
    const { error } = await lm(mock.fetch).bulk.wait(JOB);
    expect(error?.code).toBe("job_not_found");
  });
});

describe("bulk.stream", () => {
  const sse = (chunks: string[]) =>
    new Response(
      new ReadableStream({
        start(controller) {
          for (const chunk of chunks) {
            controller.enqueue(new TextEncoder().encode(chunk));
          }
          controller.close();
        },
      }),
      { status: 200, headers: { "content-type": "text/event-stream" } }
    );

  it("yields progress, split across chunks, and stops at the terminal message", async () => {
    const progress = (status: string, processed: number, isTerminal: boolean) =>
      JSON.stringify({
        type: "progress",
        jobId: JOB,
        status,
        isTerminal,
        processedItems: processed,
        totalItems: 2,
        succeededItems: processed,
        failedItems: 0,
        progressPercent: isTerminal ? 100 : 50,
      });
    const running = progress("processing", 1, false);
    const mock = mockFetch(() =>
      sse([
        `event: ready\ndata: {"jobId":"${JOB}"}\n\n`,
        ": keepalive\n\n",
        `data: ${running.slice(0, 20)}`,
        `${running.slice(20)}\n\n`,
        `data: ${progress("completed", 2, true)}\n\n`,
        `data: ${progress("completed", 2, true)}\n\n`,
      ])
    );
    const seen: unknown[] = [];
    for await (const message of lm(mock.fetch).bulk.stream(JOB)) {
      seen.push(
        message.type === "progress"
          ? [message.type, message.status, message.progressPercent]
          : [message.type]
      );
    }
    expect(seen).toEqual([
      ["ready"],
      ["progress", "processing", 50],
      ["progress", "completed", 100],
    ]);
    expect(mock.calls[0]?.headers.accept).toBe("text/event-stream");
    expect(mock.calls[0]?.headers["x-api-key"]).toBe(apiKey);
  });

  it("stops when the server closes the stream", async () => {
    const mock = mockFetch(() =>
      sse([
        `event: kill\ndata: {"jobId":"${JOB}","reason":"lifetime_exceeded"}\n\n`,
      ])
    );
    const seen: BulkStreamMessage[] = [];
    for await (const message of lm(mock.fetch).bulk.stream(JOB)) {
      seen.push(message);
    }
    expect(seen).toEqual([
      { type: "closed", jobId: JOB, reason: "lifetime_exceeded" },
    ]);
  });

  it("reads a job snapshot frame as progress", async () => {
    const mock = mockFetch(() =>
      sse([`event: progress\ndata: ${JSON.stringify(job("completed", 2))}\n\n`])
    );
    const seen: BulkStreamMessage[] = [];
    for await (const message of lm(mock.fetch).bulk.stream(JOB)) {
      seen.push(message);
    }
    expect(seen).toMatchObject([
      {
        type: "progress",
        status: "completed",
        isTerminal: true,
        progressPercent: 100,
      },
    ]);
  });

  it("ends with closed when the server hangs up before the job ends", async () => {
    const mock = mockFetch(() =>
      sse([
        `event: progress\ndata: ${JSON.stringify(job("processing", 1))}\n\n`,
      ])
    );
    const seen: string[] = [];
    for await (const message of lm(mock.fetch).bulk.stream(JOB)) {
      seen.push(message.type);
    }
    expect(seen).toEqual(["progress", "closed"]);
  });

  it("throws the API error when the stream cannot open", async () => {
    const mock = mockFetch({
      status: 401,
      body: problem(401, "invalid_api_key"),
    });
    await expect(async () => {
      for await (const _ of lm(mock.fetch).bulk.stream(JOB)) {
        // no events
      }
    }).rejects.toMatchObject({ code: "invalid_api_key", kind: "auth" });
  });
});
