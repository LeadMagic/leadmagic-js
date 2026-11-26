import type { ResolvedConfig } from "./env";
import { isBrowser } from "./env";
import type { LeadMagicError } from "./errors";
import { clientError, errorFromResponse } from "./errors";
import { VERSION } from "./version";

/** Sandbox outcomes; see https://leadmagic.io/playground. */
export type SandboxOutcome =
  | "found"
  | "empty"
  | "400"
  | "401"
  | "402"
  | "404"
  | "429"
  | "500";

export interface RequestOptions {
  /** Extra headers for this call. */
  headers?: Record<string, string>;
  /** Same key on retries of one logical call; generated for every POST when omitted. */
  idempotencyKey?: string;
  /** Overrides the client's `maxRetries` for this call. */
  maxRetries?: number;
  /** Sandbox only: force an outcome to test your error handling. */
  sandboxOutcome?: SandboxOutcome;
  /** Cancels the call, retries included. */
  signal?: AbortSignal;
  /** Overrides the client's per-attempt timeout for this call. */
  timeoutMs?: number;
}

export interface RateLimitInfo {
  /** The rate-limit lane this call counted against, e.g. `search`. */
  lane: string | undefined;
  /** Requests allowed in the current window. */
  limit: number | undefined;
  remaining: number | undefined;
  /** Epoch seconds. */
  reset: number | undefined;
}

export interface ResponseMeta {
  credits: {
    /** Credits this call used. */
    consumed: number | undefined;
    /** Balance after this call, when the API reports it. */
    remaining: number | undefined;
  };
  /** Set when the endpoint is deprecated: the notice the API sent. */
  deprecation: string | undefined;
  rateLimit: RateLimitInfo;
  /** Quote this to support. */
  requestId: string | undefined;
  /** True when the answer came from the Sandbox (synthetic data). */
  sandbox: boolean;
  /** HTTP status, or 0 when no response was received. */
  status: number;
}

export type Result<T> =
  | { data: T; error: null; meta: ResponseMeta }
  | { data: null; error: LeadMagicError; meta: ResponseMeta };

export interface TransportConfig extends ResolvedConfig {
  fetch: typeof fetch;
  headers: Record<string, string>;
  maxRetries: number;
  timeoutMs: number;
}

export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";
export type QueryValue = string | number | boolean | string[] | undefined;

export interface Call {
  body?: unknown;
  method: HttpMethod;
  /** Path with any path parameters already encoded. */
  path: string;
  query?: Record<string, QueryValue>;
}

const RETRY_STATUSES = new Set([429, 502, 503, 504]);
const BASE_BACKOFF_MS = 500;
const MAX_BACKOFF_MS = 8000;
/** Longer waits (ads outages send Retry-After: 300) come back as an error instead. */
const MAX_RETRY_AFTER_MS = 60_000;

function num(value: string | null): number | undefined {
  if (value === null || value.trim() === "") {
    return;
  }
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export function emptyMeta(sandbox: boolean): ResponseMeta {
  return {
    status: 0,
    requestId: undefined,
    sandbox,
    deprecation: undefined,
    credits: { consumed: undefined, remaining: undefined },
    rateLimit: {
      limit: undefined,
      remaining: undefined,
      reset: undefined,
      lane: undefined,
    },
  };
}

function bodyCredits(body: unknown): number | undefined {
  if (body && typeof body === "object" && "credits_consumed" in body) {
    const n = Number((body as { credits_consumed: unknown }).credits_consumed);
    return Number.isFinite(n) ? n : undefined;
  }
}

function metaFrom(
  response: Response,
  sandbox: boolean,
  body: unknown
): ResponseMeta {
  const h = response.headers;
  const deprecated = h.get("deprecation");
  return {
    status: response.status,
    requestId: h.get("x-request-id") ?? undefined,
    sandbox: sandbox || h.get("x-sandbox") === "true",
    deprecation: deprecated
      ? (h.get("x-deprecation-notice") ?? "This endpoint is deprecated.")
      : undefined,
    credits: {
      consumed: num(h.get("x-credits-consumed")) ?? bodyCredits(body),
      remaining: num(h.get("x-credits-remaining")),
    },
    rateLimit: {
      limit: num(h.get("ratelimit-limit")) ?? num(h.get("x-ratelimit-limit")),
      remaining:
        num(h.get("ratelimit-remaining")) ??
        num(h.get("x-ratelimit-remaining")),
      reset: num(h.get("ratelimit-reset")) ?? num(h.get("x-ratelimit-reset")),
      lane: h.get("x-leadmagic-rate-lane") ?? undefined,
    },
  };
}

function randomId(): string {
  const c = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  if (c?.randomUUID) {
    return c.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function sleep(ms: number, signal: AbortSignal | undefined): Promise<void> {
  return new Promise((resolve) => {
    if (signal?.aborted) {
      resolve();
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        resolve();
      },
      { once: true }
    );
  });
}

function backoff(attempt: number): number {
  const exp = Math.min(MAX_BACKOFF_MS, BASE_BACKOFF_MS * 2 ** attempt);
  return exp / 2 + Math.random() * (exp / 2);
}

async function readBody(response: Response): Promise<unknown> {
  const raw = await response.text();
  if (!raw) {
    return;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

/** One attempt's signal: the caller's signal plus this attempt's timeout. */
function attemptSignal(timeoutMs: number, signal: AbortSignal | undefined) {
  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(new DOMException("timeout", "TimeoutError")),
    timeoutMs
  );
  const onAbort = () => controller.abort(signal?.reason);
  if (signal?.aborted) {
    controller.abort(signal.reason);
  } else {
    signal?.addEventListener("abort", onAbort, { once: true });
  }
  return {
    signal: controller.signal,
    timedOut: () =>
      controller.signal.reason instanceof DOMException &&
      controller.signal.reason.name === "TimeoutError",
    done: () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
    },
  };
}

export function buildUrl(
  baseUrl: string,
  path: string,
  query: Record<string, QueryValue> | undefined
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined || value === "") {
      continue;
    }
    params.set(key, Array.isArray(value) ? value.join(",") : String(value));
  }
  const search = params.toString();
  return `${baseUrl}${path}${search ? `?${search}` : ""}`;
}

function buildHeaders(
  config: TransportConfig,
  call: Call,
  options: RequestOptions
): Record<string, string> {
  const headers: Record<string, string> = {
    accept: "application/json",
    ...config.headers,
    ...options.headers,
  };
  if (call.body !== undefined) {
    headers["content-type"] = "application/json";
  }
  if (config.apiKey) {
    headers["x-api-key"] = config.apiKey;
  }
  if (!isBrowser()) {
    headers["user-agent"] = `leadmagic-node/${VERSION}`;
  }
  // One key for every attempt, so a retried POST is never billed twice.
  if (call.method === "POST" && !config.sandbox) {
    headers["x-idempotency-key"] = options.idempotencyKey ?? randomId();
  }
  if (config.sandbox && options.sandboxOutcome) {
    headers["x-sandbox-outcome"] = options.sandboxOutcome;
  }
  return headers;
}

/** Removes the key from text that came from outside the SDK, such as a fetch error. */
function redact(value: string, apiKey: string | undefined): string {
  return apiKey ? value.split(apiKey).join("[api key]") : value;
}

function fetchError(
  cause: unknown,
  timedOut: boolean,
  cancelled: boolean,
  timeoutMs: number,
  apiKey: string | undefined
): LeadMagicError {
  if (timedOut) {
    return clientError(
      "timeout",
      `LeadMagic did not answer within ${timeoutMs} ms.`
    );
  }
  if (cancelled) {
    return clientError("network_error", "The request was cancelled.");
  }
  const reason = cause instanceof Error ? cause.message : String(cause);
  return clientError(
    "network_error",
    `Could not reach LeadMagic: ${redact(reason, apiKey)}`
  );
}

function shouldRetry(response: Response, error: LeadMagicError): boolean {
  if (error.kind === "billing") {
    // Daily and monthly budgets answer 429 but do not clear in seconds.
    return false;
  }
  return (
    RETRY_STATUSES.has(response.status) ||
    error.code === "idempotency_in_progress"
  );
}

type Attempt =
  | { ok: true; parsed: unknown; response: Response }
  | { cancelled: boolean; error: LeadMagicError; ok: false };

/** One fetch with its own timeout. Never throws. */
async function attemptOnce(
  config: TransportConfig,
  url: string,
  init: RequestInit,
  timeoutMs: number,
  signal: AbortSignal | undefined
): Promise<Attempt> {
  const deadline = attemptSignal(timeoutMs, signal);
  try {
    const response = await config.fetch(url, {
      ...init,
      signal: deadline.signal,
    });
    return { ok: true, response, parsed: await readBody(response) };
  } catch (cause) {
    const cancelled = signal?.aborted === true;
    return {
      ok: false,
      cancelled,
      error: fetchError(
        cause,
        deadline.timedOut(),
        cancelled,
        timeoutMs,
        config.apiKey
      ),
    };
  } finally {
    deadline.done();
  }
}

/** The result of one response, and how long to wait before retrying it (null: do not retry). */
function settle<T>(
  response: Response,
  parsed: unknown,
  sandbox: boolean,
  attempt: number
): { result: Result<T>; retryIn: number | null } {
  const meta = metaFrom(response, sandbox, parsed);
  if (response.ok) {
    if (typeof parsed === "object" && parsed !== null) {
      return {
        result: { data: parsed as T, error: null, meta },
        retryIn: null,
      };
    }
    const error = clientError(
      "unexpected_response",
      "LeadMagic returned a response the SDK could not read.",
      { status: response.status, requestId: meta.requestId }
    );
    return { result: { data: null, error, meta }, retryIn: null };
  }
  const error = errorFromResponse(response.status, parsed, response.headers);
  const wait =
    error.retryAfter === undefined ? backoff(attempt) : error.retryAfter * 1000;
  const retry = wait <= MAX_RETRY_AFTER_MS && shouldRetry(response, error);
  return { result: { data: null, error, meta }, retryIn: retry ? wait : null };
}

/**
 * Sends one logical API call: one idempotency key, retries on 429, 502, 503,
 * 504, a duplicate still in progress, and network failures. Never throws.
 */
export async function send<T>(
  config: TransportConfig,
  call: Call,
  options: RequestOptions = {}
): Promise<Result<T>> {
  const timeoutMs = options.timeoutMs ?? config.timeoutMs;
  const maxRetries = Math.max(0, options.maxRetries ?? config.maxRetries);
  const url = buildUrl(config.baseUrl, call.path, call.query);
  const init: RequestInit = {
    method: call.method,
    headers: buildHeaders(config, call, options),
    body: call.body === undefined ? undefined : JSON.stringify(call.body),
    // The API never redirects. Following one would forward the key to
    // wherever it points, so a redirect comes back as an error instead.
    redirect: config.apiKey ? "manual" : "follow",
  };

  for (let attempt = 0; ; attempt += 1) {
    // biome-ignore lint/performance/noAwaitInLoops: retries must run one after another.
    const outcome = await attemptOnce(
      config,
      url,
      init,
      timeoutMs,
      options.signal
    );
    if (!outcome.ok) {
      if (outcome.cancelled || attempt >= maxRetries) {
        return {
          data: null,
          error: outcome.error,
          meta: emptyMeta(config.sandbox),
        };
      }
      await sleep(backoff(attempt), options.signal);
      continue;
    }
    const { result, retryIn } = settle<T>(
      outcome.response,
      outcome.parsed,
      config.sandbox,
      attempt
    );
    if (retryIn === null || attempt >= maxRetries) {
      return result;
    }
    await sleep(retryIn, options.signal);
    if (options.signal?.aborted) {
      return result;
    }
  }
}

/** A failed result for input the SDK rejects before sending anything. */
export function invalidInput<T>(
  config: Pick<TransportConfig, "sandbox">,
  message: string,
  param: string[]
): Result<T> {
  const meta = emptyMeta(config.sandbox);
  meta.credits.consumed = 0;
  return {
    data: null,
    error: clientError("invalid_input", message, {
      param,
      issues: param.map((field) => ({
        code: "invalid_input",
        field,
        message,
      })),
    }),
    meta,
  };
}
