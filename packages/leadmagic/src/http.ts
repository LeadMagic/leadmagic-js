import type { ResolvedConfig } from "./env";
import type { LeadMagicError } from "./errors";
import { clientError, errorFromResponse } from "./errors";
import { VERSION } from "./version";

export interface RequestOptions {
  /** Same key on retries of one logical call; generated when omitted. */
  idempotencyKey?: string;
  /** Overrides the client's `maxRetries` for this call. */
  maxRetries?: number;
  signal?: AbortSignal;
  /** Overall budget for this call, retries included. */
  timeoutMs?: number;
}

export interface RateLimitInfo {
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
  rateLimit: RateLimitInfo;
  /** Quote this to support. */
  requestId: string | undefined;
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

const RETRY_STATUSES = new Set([429, 502, 503, 504]);
const BASE_BACKOFF_MS = 400;
const MAX_BACKOFF_MS = 4000;

function num(value: string | null): number | undefined {
  if (value === null || value.trim() === "") {
    return;
  }
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function emptyMeta(): ResponseMeta {
  return {
    status: 0,
    requestId: undefined,
    credits: { consumed: undefined, remaining: undefined },
    rateLimit: { limit: undefined, remaining: undefined, reset: undefined },
  };
}

function metaFrom(response: Response, body: unknown): ResponseMeta {
  const h = response.headers;
  const bodyCredits =
    body && typeof body === "object" && "credits_consumed" in body
      ? Number((body as { credits_consumed: unknown }).credits_consumed)
      : undefined;
  return {
    status: response.status,
    requestId: h.get("x-request-id") ?? undefined,
    credits: {
      consumed:
        num(h.get("x-credits-consumed")) ??
        (Number.isFinite(bodyCredits) ? bodyCredits : undefined),
      remaining: num(h.get("x-credits-remaining")),
    },
    rateLimit: {
      limit: num(h.get("x-ratelimit-limit")) ?? num(h.get("ratelimit-limit")),
      remaining:
        num(h.get("x-ratelimit-remaining")) ??
        num(h.get("ratelimit-remaining")),
      reset: num(h.get("x-ratelimit-reset")) ?? num(h.get("ratelimit-reset")),
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

function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal.aborted) {
      resolve();
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        resolve();
      },
      { once: true }
    );
  });
}

function backoff(
  attempt: number,
  retryAfterSeconds: number | undefined
): number {
  if (retryAfterSeconds !== undefined) {
    return retryAfterSeconds * 1000;
  }
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

/** Combines the caller's signal with the overall deadline. */
function deadlineSignal(timeoutMs: number, signal: AbortSignal | undefined) {
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

function buildHeaders(
  config: TransportConfig,
  method: "GET" | "POST",
  body: unknown,
  options: RequestOptions
): Record<string, string> {
  const headers: Record<string, string> = {
    accept: "application/json",
    ...config.headers,
  };
  if (body !== undefined) {
    headers["content-type"] = "application/json";
  }
  headers["x-api-key"] = config.apiKey;
  headers["user-agent"] = `leadmagic-js/${VERSION}`;
  // One key for every attempt, so a retried POST is never billed twice.
  if (method === "POST") {
    headers["x-idempotency-key"] = options.idempotencyKey ?? randomId();
  }
  return headers;
}

/** Removes the key from text that came from outside the SDK, such as a fetch error. */
function redact(value: string, apiKey: string): string {
  return value.split(apiKey).join("[api key]");
}

function fetchError(
  cause: unknown,
  timedOut: boolean,
  cancelled: boolean,
  timeoutMs: number,
  apiKey: string
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

function successResult<T>(
  status: number,
  parsed: unknown,
  meta: ResponseMeta
): Result<T> {
  if (typeof parsed === "object" && parsed !== null) {
    return { data: parsed as T, error: null, meta };
  }
  return {
    data: null,
    error: clientError(
      "unexpected_response",
      "LeadMagic returned a response the SDK could not read.",
      { status, requestId: meta.requestId }
    ),
    meta,
  };
}

/**
 * Sends one logical API call: one idempotency key, retries on 429/502/503/504
 * and network failures within the overall timeout, never throws.
 */
export async function send<T>(
  config: TransportConfig,
  method: "GET" | "POST",
  apiPath: string,
  body: unknown,
  options: RequestOptions = {}
): Promise<Result<T>> {
  const timeoutMs = options.timeoutMs ?? config.timeoutMs;
  const maxRetries = Math.max(0, options.maxRetries ?? config.maxRetries);
  const started = Date.now();
  const deadline = deadlineSignal(timeoutMs, options.signal);

  const headers = buildHeaders(config, method, body, options);
  const url = `${config.baseUrl}${apiPath}`;
  const payload = body === undefined ? undefined : JSON.stringify(body);

  const failed = (
    error: LeadMagicError,
    meta: ResponseMeta = emptyMeta()
  ): Result<T> => ({ data: null, error, meta });
  const canRetry = (attempt: number, wait: number) =>
    attempt < maxRetries && Date.now() - started + wait < timeoutMs;

  try {
    for (let attempt = 0; ; attempt += 1) {
      let response: Response;
      try {
        // biome-ignore lint/performance/noAwaitInLoops: retries must run one after another.
        response = await config.fetch(url, {
          method,
          headers,
          body: payload,
          signal: deadline.signal,
          // The API never redirects. Following one would forward the key to
          // wherever it points, so a redirect comes back as an error instead.
          redirect: "manual",
        });
      } catch (cause) {
        const wait = backoff(attempt, undefined);
        const timedOut = deadline.timedOut();
        const cancelled = options.signal?.aborted === true;
        if (timedOut || cancelled || !canRetry(attempt, wait)) {
          return failed(
            fetchError(cause, timedOut, cancelled, timeoutMs, config.apiKey)
          );
        }
        await sleep(wait, deadline.signal);
        continue;
      }

      const parsed = await readBody(response);
      const meta = metaFrom(response, parsed);
      if (response.ok) {
        return successResult<T>(response.status, parsed, meta);
      }

      const error = errorFromResponse(
        response.status,
        parsed,
        response.headers
      );
      const wait = backoff(attempt, error.retryAfter);
      if (!(RETRY_STATUSES.has(response.status) && canRetry(attempt, wait))) {
        return failed(error, meta);
      }
      await sleep(wait, deadline.signal);
      if (deadline.signal.aborted) {
        return failed(error, meta);
      }
    }
  } finally {
    deadline.done();
  }
}
