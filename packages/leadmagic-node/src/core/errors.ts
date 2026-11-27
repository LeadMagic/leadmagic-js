/**
 * The error contract.
 *
 * api.leadmagic.io answers every failure with RFC 9457 Problem Details: a
 * stable `code`, the HTTP `status`, a `context` object and, for invalid input,
 * one entry per problem in `errors[]`. `LeadMagicError` is a typed view of that
 * body, plus a handful of codes the SDK raises itself before or instead of a
 * response (missing key, timeout, network failure).
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
  /** The request itself is wrong: missing field, bad value, payload too large. */
  | "invalid_input"
  /** The route, job, list or budget does not exist, or a search cursor expired. */
  | "not_found"
  /** The resource is in a state that does not allow this, or the same idempotency key is still running. */
  | "conflict"
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

/**
 * Codes the API returns today, from the gateway and the bulk worker. Provider
 * outages add more 502 codes over time; unknown codes still type-check as
 * `string`.
 */
export type LeadMagicApiErrorCode =
  // 400
  | "validation_error"
  | "missing_required_field"
  | "invalid_json"
  | "invalid_parameter"
  | "injection_detected"
  | "invalid_action"
  | "file_too_large"
  | "unsupported_format"
  | "remote_file_unavailable"
  // 401, 403
  | "missing_authentication"
  | "invalid_api_key"
  | "insufficient_permissions"
  | "ip_not_allowed"
  | "local_leads_search_not_included"
  | "forbidden"
  // 402
  | "insufficient_credits"
  | "credits_frozen"
  | "budget_exceeded"
  | "subscription_required"
  | "org_closed"
  // 404, 405, 410
  | "route_not_found"
  | "resource_not_found"
  | "profile_not_found"
  | "job_not_found"
  | "method_not_allowed"
  | "restart_required"
  | "snapshot_limit_reached"
  // 409
  | "conflict"
  | "idempotency_in_progress"
  | "idempotency_paid_result_unavailable"
  | "credit_settlement_rejected"
  | "job_not_pausable"
  | "job_not_resumable"
  | "job_not_cancellable"
  | "job_not_restartable"
  | "duplicate_job"
  | "duplicate_idempotency_key"
  | "billing_authorization_rejected"
  | "local_leads_submission_in_progress"
  // 413
  | "payload_too_large"
  // 422
  | "cross_batch_duplicate"
  // 429
  | "rate_limit_exceeded"
  | "daily_budget_exceeded"
  | "monthly_budget_exceeded"
  | "cold_build_admission_denied"
  // 5xx
  | "external_service_error"
  | "service_unavailable"
  | "internal_error"
  | "request_timeout"
  | "credit_settlement_backlog"
  | "credit_settlement_unconfirmed"
  | "jobs_search_timeout"
  | "technographics_unavailable"
  | "ads_unavailable"
  | "ads_search_timeout"
  | "query_budget_exceeded"
  | "deadline_insufficient"
  | "stats_unavailable"
  | "stream_unavailable"
  | "upload_failed"
  | "local_leads_capacity"
  | "local_leads_unavailable"
  | "credit_charge_failed";

export type LeadMagicErrorCode =
  | LeadMagicClientErrorCode
  | LeadMagicApiErrorCode
  | (string & Record<never, never>);

/** `context.reason` on 403 `insufficient_permissions`. */
export type LeadMagicErrorReason =
  | "api_key_scope"
  | "plan_entitlement"
  | "evaluation_expired"
  | "temporary_access_paused"
  | (string & Record<never, never>);

/**
 * The `context` object, with the fields worth acting on named. Anything else
 * the API sends is kept under its own key.
 */
export interface LeadMagicErrorContext {
  /** 402: where to buy credits. */
  billing_url?: string;
  /** 402: credits the account has now. */
  credits_available?: number;
  /** 402: credits this request needs. */
  credits_required?: number;
  /** 429: `per_second`, `per_minute`, `per_day`, `concurrency`, … */
  limit_scope?: string;
  /** 403: the product the key or plan does not cover. */
  product?: string;
  /** 403: why access was refused. */
  reason?: LeadMagicErrorReason;
  /** 429: when the window resets (ISO 8601 or epoch seconds, as sent). */
  reset_at?: string | number;
  /** 404: the path to call instead. */
  suggested_endpoint?: string;
  [key: string]: unknown;
}

/** One problem in a request. Validation failures carry one per invalid field. */
export interface LeadMagicErrorIssue {
  code: string;
  /** The request field, when the API names one. */
  field: string | undefined;
  message: string;
}

export interface LeadMagicErrorInit {
  action?: string;
  code: LeadMagicErrorCode;
  context?: LeadMagicErrorContext;
  docsUrl?: string;
  issues?: LeadMagicErrorIssue[];
  kind: LeadMagicErrorKind;
  message: string;
  param?: string[];
  requestId?: string;
  retryAfter?: number;
  status: number;
}

const DOCS_ERRORS = "https://leadmagic.io/docs/sdk/errors";

export class LeadMagicError extends Error {
  override readonly name = "LeadMagicError";
  /** Stable machine code, e.g. `insufficient_credits` or `timeout`. */
  readonly code: LeadMagicErrorCode;
  /** One of eight kinds; see {@link LeadMagicErrorKind}. */
  readonly kind: LeadMagicErrorKind;
  /** HTTP status from the API, or 0 when no response was received. */
  readonly status: number;
  /** `context.reason` from the API, e.g. `api_key_scope` or `plan_entitlement`. */
  readonly reason: LeadMagicErrorReason | undefined;
  /** Request fields the API rejected. */
  readonly param: string[] | undefined;
  /** Every problem the API reported, one per invalid field. */
  readonly issues: LeadMagicErrorIssue[];
  /** The API's `context` object (never sent for 5xx). */
  readonly context: LeadMagicErrorContext;
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
    this.context = init.context ?? {};
    this.reason =
      typeof this.context.reason === "string" ? this.context.reason : undefined;
    this.param = init.param;
    this.issues = init.issues ?? [];
    this.requestId = init.requestId;
    this.retryAfter = init.retryAfter;
    this.action = init.action;
    this.docsUrl = init.docsUrl ?? `${DOCS_ERRORS}#${init.code}`;
  }

  /** True for failures worth retrying later: rate limits, outages, and a duplicate still running. */
  get retryable(): boolean {
    return (
      this.kind === "rate_limit" ||
      this.kind === "unavailable" ||
      this.code === "idempotency_in_progress"
    );
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
      issues: this.issues,
      context: this.context,
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
  if (status === 404 || status === 410) {
    return "not_found";
  }
  if (status === 409) {
    return "conflict";
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
const MAX_ISSUES = 50;
const MAX_CONTEXT_KEYS = 40;

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
  if (Array.isArray(body.errors)) {
    return obj(body.errors[0]);
  }
  // A few routes answer `{ error: "some_code", message }`.
  if (typeof body.error === "string") {
    return { code: body.error, detail: body.message };
  }
  // A refused bulk restart answers 409 with `{ restarted: false, reason }`.
  if (typeof body.reason === "string") {
    return { detail: body.reason };
  }
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

/** Copies plain JSON values from `context`, bounded so a huge body stays cheap. */
function readContext(value: unknown): LeadMagicErrorContext {
  const source = obj(value);
  const out: LeadMagicErrorContext = {};
  if (!source) {
    return out;
  }
  for (const key of Object.keys(source).slice(0, MAX_CONTEXT_KEYS)) {
    const v = source[key];
    if (
      typeof v === "string" ||
      typeof v === "number" ||
      typeof v === "boolean" ||
      v === null
    ) {
      out[key] = typeof v === "string" ? v.slice(0, TEXT_MAX) : v;
    } else if (Array.isArray(v) || obj(v)) {
      out[key] = v;
    }
  }
  return out;
}

function readIssues(body: Obj | undefined, problem: Obj | undefined) {
  const list = Array.isArray(body?.errors) ? body.errors : [problem];
  const issues: LeadMagicErrorIssue[] = [];
  for (const entry of list.slice(0, MAX_ISSUES)) {
    const p = obj(entry);
    if (!p) {
      continue;
    }
    const context = obj(p.context);
    const param = Array.isArray(p.param) ? p.param : [];
    const named = typeof context?.field === "string" ? context.field : param[0];
    const field = typeof named === "string" ? named : undefined;
    issues.push({
      code: token(p.code) ?? "invalid_parameter",
      field,
      message:
        text(p.detail) ?? text(p.title) ?? text(p.message) ?? "Invalid value.",
    });
  }
  return issues;
}

function defaultMessage(status: number): string {
  if (status === 401) {
    return "The API key was rejected.";
  }
  if (status === 402) {
    return "This request needs more credits than the account has.";
  }
  if (status === 404) {
    return "Not found.";
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
    context: readContext(problem?.context),
    issues: readIssues(top, problem),
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
