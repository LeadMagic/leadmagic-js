/**
 * The SDK's error contract.
 *
 * api.leadmagic.io answers every failure with RFC 9457 Problem Details: a
 * stable `code`, the HTTP `status`, and a `context` object. `LeadMagicError`
 * is a typed view of that body, plus a handful of codes the SDK raises itself
 * before or instead of a response (missing key, timeout, network failure).
 *
 * Branch on `kind` for control flow and on `code` when you need the detail.
 */

/** What kind of failure this is, and therefore what the caller can do about it. */
export type LeadMagicErrorKind =
  /** The SDK is set up wrong: no key, key exposed to the browser. Fix the code or env. */
  | "config"
  /** The key is invalid, revoked, out of scope, or blocked by its IP allowlist. */
  | "auth"
  /** Out of credits, credits frozen, no plan, or a spending limit reached. */
  | "billing"
  /** Too many requests. `retryAfter` says how long to wait. */
  | "rate_limit"
  /** The request itself is wrong: not an email address, missing field, unknown resource. */
  | "invalid_input"
  /** LeadMagic or the network failed. Safe to retry later. */
  | "unavailable";

/** Codes the SDK raises itself. Every other code comes from the API unchanged. */
export type LeadMagicClientErrorCode =
  | "missing_api_key"
  | "public_api_key"
  | "malformed_api_key"
  | "insecure_base_url"
  | "browser_runtime"
  | "invalid_input"
  | "timeout"
  | "network_error"
  | "unexpected_response";

/** Codes the API documents today. Unknown future codes still type-check as `string`. */
export type LeadMagicApiErrorCode =
  | "validation_error"
  | "invalid_json"
  | "invalid_parameter"
  | "missing_required_field"
  | "missing_authentication"
  | "invalid_api_key"
  | "insufficient_credits"
  | "credits_frozen"
  | "subscription_required"
  | "org_closed"
  | "insufficient_permissions"
  | "ip_not_allowed"
  | "resource_not_found"
  | "route_not_found"
  | "payload_too_large"
  | "rate_limit_exceeded"
  | "daily_budget_exceeded"
  | "monthly_budget_exceeded"
  | "external_service_error"
  | "service_unavailable"
  | "internal_error";

export type LeadMagicErrorCode =
  | LeadMagicClientErrorCode
  | LeadMagicApiErrorCode
  | (string & Record<never, never>);

export interface LeadMagicErrorInit {
  action?: string;
  code: LeadMagicErrorCode;
  docsUrl?: string;
  kind: LeadMagicErrorKind;
  message: string;
  param?: string[];
  reason?: string;
  requestId?: string;
  retryAfter?: number;
  status: number;
}

const DOCS_ERRORS = "https://leadmagic.io/docs/sdk/errors";

export class LeadMagicError extends Error {
  override readonly name = "LeadMagicError";
  /** Stable machine code, e.g. `insufficient_credits` or `timeout`. */
  readonly code: LeadMagicErrorCode;
  /** One of six kinds; see {@link LeadMagicErrorKind}. */
  readonly kind: LeadMagicErrorKind;
  /** HTTP status from the API, or 0 when no response was received. */
  readonly status: number;
  /** `context.reason` from the API, e.g. `api_key_scope` or `plan_entitlement`. */
  readonly reason: string | undefined;
  /** Request fields the API rejected. */
  readonly param: string[] | undefined;
  /** Quote this to support. */
  readonly requestId: string | undefined;
  /** Seconds to wait before retrying, from `Retry-After`. */
  readonly retryAfter: number | undefined;
  /** What to do next, as the API phrases it. */
  readonly action: string | undefined;
  readonly docsUrl: string;

  constructor(init: LeadMagicErrorInit) {
    super(init.message);
    this.code = init.code;
    this.kind = init.kind;
    this.status = init.status;
    this.reason = init.reason;
    this.param = init.param;
    this.requestId = init.requestId;
    this.retryAfter = init.retryAfter;
    this.action = init.action;
    this.docsUrl = init.docsUrl ?? `${DOCS_ERRORS}#${init.code}`;
  }

  /** True for failures worth retrying later: rate limits and outages. */
  get retryable(): boolean {
    return this.kind === "rate_limit" || this.kind === "unavailable";
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      kind: this.kind,
      status: this.status,
      message: this.message,
      reason: this.reason,
      param: this.param,
      requestId: this.requestId,
      retryAfter: this.retryAfter,
      action: this.action,
      docsUrl: this.docsUrl,
    };
  }
}

export function isLeadMagicError(value: unknown): value is LeadMagicError {
  return value instanceof LeadMagicError;
}

const BUDGET_CODES = new Set([
  "daily_budget_exceeded",
  "monthly_budget_exceeded",
  "member_budget_exceeded",
  "budget_exceeded",
]);

const CLIENT_KINDS: Record<LeadMagicClientErrorCode, LeadMagicErrorKind> = {
  missing_api_key: "config",
  public_api_key: "config",
  malformed_api_key: "config",
  insecure_base_url: "config",
  browser_runtime: "config",
  invalid_input: "invalid_input",
  timeout: "unavailable",
  network_error: "unavailable",
  unexpected_response: "unavailable",
};

/** Maps an API status and code onto a {@link LeadMagicErrorKind}. */
export function kindFor(
  status: number,
  code: string | undefined
): LeadMagicErrorKind {
  if (code && code in CLIENT_KINDS) {
    return CLIENT_KINDS[code as LeadMagicClientErrorCode];
  }
  if (code && BUDGET_CODES.has(code)) {
    return "billing";
  }
  if (status === 401 || status === 403) {
    return "auth";
  }
  if (status === 402) {
    return "billing";
  }
  if (status === 429) {
    return "rate_limit";
  }
  if (status >= 400 && status < 500) {
    return "invalid_input";
  }
  return "unavailable";
}

export function clientError(
  code: LeadMagicClientErrorCode,
  message: string,
  extra: Partial<LeadMagicErrorInit> = {}
): LeadMagicError {
  return new LeadMagicError({
    code,
    kind: CLIENT_KINDS[code],
    status: 0,
    message,
    ...extra,
  });
}

/* -------------------------------------------------------------------------- */
/* Problem Details parsing                                                    */
/* -------------------------------------------------------------------------- */

const SAFE_TOKEN = /^[a-z][a-z0-9_.-]{0,79}$/iu;
const REQUEST_ID = /^[A-Za-z0-9_-]{6,128}$/u;
const RETRY_AFTER_SECONDS = /^\d{1,8}$/u;
const TEXT_MAX = 500;

type Obj = Record<string, unknown>;

function obj(value: unknown): Obj | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Obj)
    : undefined;
}

/** Codes and reasons are lower snake case; anything else is dropped. */
function token(value: unknown): string | undefined {
  return typeof value === "string" && SAFE_TOKEN.test(value)
    ? value.toLowerCase()
    : undefined;
}

function text(value: unknown): string | undefined {
  return typeof value === "string" && value.trim()
    ? value.trim().slice(0, TEXT_MAX)
    : undefined;
}

/**
 * The Problem Details object in an error body. The API puts it at the top
 * level with `errors[]` beside it. A body that only has `errors[0]`, or that
 * nests the object under `error`, is read the same way.
 */
function problemObject(body: Obj | undefined): Obj | undefined {
  if (!body) {
    return;
  }
  const nested = obj(body.error);
  if (nested && (nested.code !== undefined || nested.status !== undefined)) {
    return nested;
  }
  if (
    body.code !== undefined ||
    body.detail !== undefined ||
    body.title !== undefined
  ) {
    return body;
  }
  return Array.isArray(body.errors) ? obj(body.errors[0]) : undefined;
}

/** Retry-After as whole seconds; accepts delta-seconds or an HTTP date. */
export function parseRetryAfter(
  value: string | null | undefined
): number | undefined {
  if (!value) {
    return;
  }
  const trimmed = value.trim();
  if (RETRY_AFTER_SECONDS.test(trimmed)) {
    return Number(trimmed);
  }
  const date = Date.parse(trimmed);
  if (Number.isNaN(date)) {
    return;
  }
  return Math.max(0, Math.ceil((date - Date.now()) / 1000));
}

function defaultMessage(status: number): string {
  if (status === 401) {
    return "The API key was rejected.";
  }
  if (status === 402) {
    return "This request needs more credits than the account has.";
  }
  if (status === 429) {
    return "Too many requests. Slow down and retry after the Retry-After delay.";
  }
  if (status >= 500) {
    return "LeadMagic could not complete the request. Try again shortly.";
  }
  return `The request failed with status ${status}.`;
}

/** Reads an API error response into a {@link LeadMagicError}. Never throws. */
export function errorFromResponse(
  status: number,
  body: unknown,
  headers: Pick<Headers, "get">
): LeadMagicError {
  const top = obj(body);
  const problem = problemObject(top);
  const context = obj(problem?.context);
  const trace = obj(problem?.trace) ?? obj(top?.meta);

  const code = token(problem?.code) ?? `http_${status}`;
  const requestId = headers.get("x-request-id") ?? trace?.request_id;
  const param = Array.isArray(problem?.param)
    ? problem.param.filter((p): p is string => typeof p === "string")
    : undefined;

  return new LeadMagicError({
    code,
    kind: kindFor(status, code),
    status,
    message:
      text(problem?.detail) ??
      text(problem?.title) ??
      text(problem?.message) ??
      defaultMessage(status),
    reason: token(context?.reason),
    param: param?.length ? param : undefined,
    requestId:
      typeof requestId === "string" && REQUEST_ID.test(requestId)
        ? requestId
        : undefined,
    retryAfter: parseRetryAfter(headers.get("retry-after")),
    action: text(problem?.action),
    docsUrl:
      typeof problem?.docs === "string" && problem.docs.startsWith("https://")
        ? problem.docs
        : undefined,
  });
}
