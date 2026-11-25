/**
 * Runs the SDK against the public Sandbox, which mirrors the real API's paths
 * and error shape with synthetic data. Opt-in (`pnpm test:contract`) because
 * it needs the network.
 */
import { describe, expect, it } from "vitest";
import { createClient } from "../src/index";

const sandbox = createClient({
  sandbox: true,
  timeoutMs: 20_000,
  maxRetries: 0,
});

describe("Sandbox contract", () => {
  it("validateEmail returns a typed result", async () => {
    const { data, error, meta } = await sandbox.validateEmail("ada@stripe.com");
    expect(error).toBeNull();
    expect(meta.sandbox).toBe(true);
    expect(meta.status).toBe(200);
    expect(data?.email).toBe("ada@stripe.com");
    expect(["valid", "invalid", "unknown"]).toContain(data?.email_status);
    expect(["deliverable", "undeliverable", "unknown"]).toContain(
      data?.verdict
    );
    expect(typeof data?.message).toBe("string");
  });

  it("an empty outcome still maps to a known status", async () => {
    const { data } = await sandbox.validateEmail("ada@stripe.com", {
      sandboxOutcome: "empty",
    });
    expect(data?.email_status).toBe("unknown");
    expect(data?.verdict).toBe("unknown");
  });

  it.each([
    ["400", "invalid_input"],
    ["401", "auth"],
    ["402", "billing"],
    ["429", "rate_limit"],
    ["500", "unavailable"],
  ] as const)("outcome %s becomes kind %s", async (outcome, kind) => {
    const { data, error } = await sandbox.validateEmail("ada@stripe.com", {
      sandboxOutcome: outcome,
    });
    expect(data).toBeNull();
    expect(error?.kind).toBe(kind);
    expect(error?.status).toBe(Number(outcome));
    expect(error?.code).toMatch(/^[a-z_]+$/u);
  });

  it("findCompany reads the company", async () => {
    const { data, error } = await sandbox.findCompany({ domain: "stripe.com" });
    expect(error).toBeNull();
    expect(data?.found).toBe(true);
    expect(data?.company?.company_domain).toBe("stripe.com");
  });

  it("getCredits reads a number", async () => {
    const { data, error } = await sandbox.getCredits();
    expect(error).toBeNull();
    expect(typeof data?.available).toBe("number");
  });
});
