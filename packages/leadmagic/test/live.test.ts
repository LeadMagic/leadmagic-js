/**
 * Runs against the real API with LEADMAGIC_API_KEY (`pnpm test:live`). Catches
 * API changes that the Sandbox does not show. Costs at most 0.25 credits a run.
 */
import { describe, expect, it } from "vitest";
import { createClient } from "../src/index";

const live = createClient({ timeoutMs: 30_000 });

describe("Live API", () => {
  it("getCredits reads the balance", async () => {
    const { data, error, meta } = await live.getCredits();
    expect(error).toBeNull();
    expect(meta.status).toBe(200);
    expect(meta.sandbox).toBe(false);
    expect(typeof data?.available).toBe("number");
  });

  it("validateEmail returns a known status and request id", async () => {
    const { data, error, meta } =
      await live.validateEmail("nobody@example.com");
    expect(error).toBeNull();
    expect(["valid", "invalid", "unknown"]).toContain(data?.email_status);
    expect(["deliverable", "undeliverable", "unknown"]).toContain(
      data?.verdict
    );
    expect(typeof data?.is_role_based).toBe("boolean");
    expect(meta.requestId).toBeTruthy();
  });

  it("a revoked key becomes an auth error", async () => {
    const bad = createClient({
      apiKey: "lm_live_smoke_invalid_key",
      maxRetries: 0,
    });
    const { data, error } = await bad.getCredits();
    expect(data).toBeNull();
    expect(error?.kind).toBe("auth");
    expect(error?.status).toBe(401);
    expect(error?.message).not.toContain("lm_live_smoke_invalid_key");
  });
});
