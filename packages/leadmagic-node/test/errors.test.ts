import { describe, expect, it } from "vitest";
import { errorFromResponse, kindFor } from "../src/core/errors";
import { isLeadMagicError } from "../src/index";
import { problem } from "./helpers";

const noHeaders = new Headers();

describe("kinds", () => {
  it.each([
    [400, "validation_error", "invalid_input"],
    [401, "invalid_api_key", "auth"],
    [402, "insufficient_credits", "billing"],
    [403, "insufficient_permissions", "auth"],
    [404, "route_not_found", "not_found"],
    [409, "job_not_pausable", "conflict"],
    [410, "snapshot_limit_reached", "not_found"],
    [413, "payload_too_large", "invalid_input"],
    [429, "rate_limit_exceeded", "rate_limit"],
    [429, "monthly_budget_exceeded", "billing"],
    [502, "email_finder_timeout", "unavailable"],
    [504, "request_timeout", "unavailable"],
  ] as const)("%i %s is %s", (status, code, kind) => {
    expect(kindFor(status, code)).toBe(kind);
  });
});

describe("errorFromResponse", () => {
  it("reads every validation issue, not only the first", () => {
    const body = {
      ...problem(400, "validation_error"),
      errors: [
        {
          ...problem(400, "invalid_parameter"),
          detail: "limit must be at most 50.",
          context: { field: "limit", received: 500 },
        },
        {
          ...problem(400, "missing_required_field"),
          detail: "job_title is required.",
          param: ["job_title"],
        },
      ],
    };
    const error = errorFromResponse(400, body, noHeaders);
    expect(error.issues).toEqual([
      {
        code: "invalid_parameter",
        field: "limit",
        message: "limit must be at most 50.",
      },
      {
        code: "missing_required_field",
        field: "job_title",
        message: "job_title is required.",
      },
    ]);
  });

  it("exposes context and reason", () => {
    const error = errorFromResponse(
      403,
      problem(403, "insufficient_permissions", {
        context: { reason: "api_key_scope", product: "mobile_finder" },
      }),
      noHeaders
    );
    expect(error.reason).toBe("api_key_scope");
    expect(error.context.product).toBe("mobile_finder");
  });

  it("keeps billing context for a 402", () => {
    const error = errorFromResponse(
      402,
      problem(402, "insufficient_credits", {
        context: {
          credits_required: 5,
          credits_available: 1,
          billing_url: "https://app.leadmagic.io/billing",
        },
      }),
      noHeaders
    );
    expect(error.kind).toBe("billing");
    expect(error.context).toMatchObject({
      credits_required: 5,
      credits_available: 1,
    });
  });

  it("reads the bare { error, message } shape a few routes use", () => {
    const error = errorFromResponse(
      500,
      {
        error: "idempotent_replay_too_large",
        message: "The original response is too large to replay.",
      },
      noHeaders
    );
    expect(error.code).toBe("idempotent_replay_too_large");
    expect(error.message).toBe("The original response is too large to replay.");
  });

  it("falls back to http_<status> and a plain message", () => {
    const error = errorFromResponse(502, "<html>bad gateway</html>", noHeaders);
    expect(error.code).toBe("http_502");
    expect(error.kind).toBe("unavailable");
    expect(error.message).toMatch(/Try again shortly/u);
  });

  it("reads Retry-After and the request id", () => {
    const error = errorFromResponse(
      429,
      problem(429, "rate_limit_exceeded"),
      new Headers({ "retry-after": "7", "x-request-id": "req_header_1234" })
    );
    expect(error.retryAfter).toBe(7);
    expect(error.requestId).toBe("req_header_1234");
    expect(error.retryable).toBe(true);
  });

  it("drops a code that is not a plain token", () => {
    const error = errorFromResponse(400, problem(400, "<script>"), noHeaders);
    expect(error.code).toBe("http_400");
  });

  it("serialises without losing fields", () => {
    const error = errorFromResponse(
      409,
      problem(409, "job_not_resumable"),
      noHeaders
    );
    expect(isLeadMagicError(error)).toBe(true);
    expect(JSON.parse(JSON.stringify(error))).toMatchObject({
      name: "LeadMagicError",
      code: "job_not_resumable",
      kind: "conflict",
      status: 409,
      docsUrl: "https://leadmagic.io/docs/sdk/errors#job_not_resumable",
    });
  });
});
