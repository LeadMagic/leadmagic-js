import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { signWebhook, verifyWebhook } from "../src/index";

const secret = "whsec_test_123";
const body = JSON.stringify({
  jobId: "6b09a269-0002-4000-8d74-de3a0fe9da1d",
  event: "job.completed",
  timestamp: "2026-11-27T15:32:02.200Z",
  summary: { status: "completed", totalRows: 2 },
});
// What the worker does: hex HMAC-SHA256 of the raw body, keyed with the trimmed secret.
const signature = createHmac("sha256", secret).update(body).digest("hex");

describe("webhooks", () => {
  it("signs the way the worker does", async () => {
    expect(await signWebhook(body, ` ${secret} `)).toBe(signature);
  });

  it("returns the body for a valid signature, from Headers or Node headers", async () => {
    const fromHeaders = await verifyWebhook({
      body,
      secret,
      headers: new Headers({ "X-LeadMagic-Signature": signature }),
    });
    expect(fromHeaders).toMatchObject({ event: "job.completed" });
    const fromNode = await verifyWebhook({
      body: new TextEncoder().encode(body),
      secret,
      headers: { "x-leadmagic-signature": [signature] },
    });
    expect(fromNode).toMatchObject({
      jobId: "6b09a269-0002-4000-8d74-de3a0fe9da1d",
    });
  });

  it("reads a batch client webhook, signed with a sha256= prefix", async () => {
    const batchBody = JSON.stringify({ batchId: "b_1", status: "succeeded" });
    const sig = createHmac("sha256", secret).update(batchBody).digest("hex");
    const event = await verifyWebhook({
      body: batchBody,
      secret,
      headers: { "x-leadmagic-signature": `sha256=${sig}` },
    });
    expect(event).toMatchObject({ batchId: "b_1", status: "succeeded" });
  });

  it.each([
    ["a changed body", { body: body.replace("completed", "failed") }],
    ["the wrong secret", { secret: "other" }],
    ["no signature", { headers: {} }],
    ["a malformed signature", { headers: { "x-leadmagic-signature": "abc" } }],
    ["an empty secret", { secret: " " }],
  ])("rejects %s", async (_name, change) => {
    const result = await verifyWebhook({
      body,
      secret,
      headers: { "x-leadmagic-signature": signature },
      ...change,
    });
    expect(result).toBeNull();
  });
});
