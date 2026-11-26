import type { LeadMagicClient, LeadMagicOptions } from "../client";
import { createClient } from "../client";
import { readEnv } from "../env";
import { isLeadMagicError, LeadMagicError } from "../errors";
import type { EmailVerdict } from "../resources/email";
import { clientIp, WindowCounter } from "./rate-limit";

/** What the browser receives. Nothing else from the API leaves your server. */
export interface ValidateEmailResponse {
  /** The local part is a role or shared mailbox such as `info@`. */
  roleBased: boolean;
  verdict: EmailVerdict;
}

export interface ValidateEmailEvent {
  cached: boolean;
  email: string;
  /** Set when LeadMagic could not answer and the handler failed open. */
  error: LeadMagicError | null;
  verdict: EmailVerdict;
}

export type ProtectResult = boolean | Response;

export interface ValidateEmailHandlerOptions {
  /**
   * Origins allowed besides the route's own, e.g. `https://www.example.com`
   * when the form lives on another subdomain.
   */
  allowedOrigins?: string[];
  /** Results per email are kept in memory to avoid paying twice. `false` turns this off. */
  cache?: false | { max?: number; ttlMs?: number };
  /** A client or client options. Defaults to `LEADMAGIC_API_KEY` from the environment. */
  client?: LeadMagicClient | LeadMagicOptions;
  /** Called after every answer, for logging or analytics. Never awaited. */
  onResult?: (event: ValidateEmailEvent) => void;
  /**
   * Your abuse check: bot detection, Turnstile, a rate limiter. Return `false`
   * to refuse with 403, or a Response to send it as-is.
   */
  protect?: (
    request: Request,
    input: { email: string }
  ) => ProtectResult | Promise<ProtectResult>;
  /**
   * Caps on the checks that reach LeadMagic, counted in memory on each server
   * instance: `perIp` per visitor (default 10) and `total` for everyone
   * (default 120) in each `windowMs` (default one minute). Over a cap the
   * route answers `unknown` and spends nothing. Instances do not share
   * counts, so add `protect` for a hard limit. `false` turns the caps off.
   */
  rateLimit?: false | { perIp?: number; total?: number; windowMs?: number };
  /** Longest the form waits for LeadMagic before answering `unknown`. Default 8000 ms. */
  timeoutMs?: number;
}

const MAX_BODY_BYTES = 2048;
const DEFAULT_TIMEOUT_MS = 8000;
const DEFAULT_CACHE_TTL_MS = 10 * 60 * 1000;
const DEFAULT_CACHE_MAX = 1000;
const DEFAULT_PER_IP = 10;
const DEFAULT_TOTAL = 120;
const DEFAULT_WINDOW_MS = 60 * 1000;

const BASE_HEADERS = {
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
};
const TRAILING_SLASHES = /\/+$/u;

function json(
  body: unknown,
  status: number,
  extra: Record<string, string> = {}
): Response {
  return Response.json(body, {
    status,
    headers: { ...BASE_HEADERS, ...extra },
  });
}

function isDev(): boolean {
  return readEnv("NODE_ENV") !== "production";
}

function hostOf(value: string): string | undefined {
  try {
    return new URL(value).host;
  } catch {
    // Not a URL: no host to compare.
  }
}

/** Same-origin requests, plus any origin listed in `allowedOrigins`. */
export function isAllowedOrigin(
  request: Request,
  allowedOrigins: readonly string[] = []
): boolean {
  if (request.headers.get("sec-fetch-site") === "same-origin") {
    return true;
  }
  const origin = request.headers.get("origin");
  if (!origin) {
    return false;
  }
  const requestHost =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ??
    request.headers.get("host") ??
    hostOf(request.url);
  if (requestHost && hostOf(origin) === requestHost) {
    return true;
  }
  return allowedOrigins.some(
    (allowed) => allowed.replace(TRAILING_SLASHES, "") === origin
  );
}

class TtlCache {
  readonly #entries = new Map<
    string,
    { expires: number; value: ValidateEmailResponse }
  >();
  readonly #max: number;
  readonly #ttl: number;

  constructor(max: number, ttl: number) {
    this.#max = max;
    this.#ttl = ttl;
  }

  get(key: string): ValidateEmailResponse | undefined {
    const hit = this.#entries.get(key);
    if (!hit) {
      return;
    }
    this.#entries.delete(key);
    if (hit.expires < Date.now()) {
      return;
    }
    this.#entries.set(key, hit);
    return hit.value;
  }

  set(key: string, value: ValidateEmailResponse): void {
    this.#entries.delete(key);
    this.#entries.set(key, { value, expires: Date.now() + this.#ttl });
    if (this.#entries.size > this.#max) {
      const oldest = this.#entries.keys().next().value;
      if (oldest !== undefined) {
        this.#entries.delete(oldest);
      }
    }
  }
}

/** Reads the body as text, or nothing once it passes the size cap. */
async function readCapped(request: Request): Promise<string | undefined> {
  if (!request.body) {
    return "";
  }
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let text = "";
  let chunk = await reader.read();
  while (!chunk.done && size + chunk.value.byteLength <= MAX_BODY_BYTES) {
    size += chunk.value.byteLength;
    text += decoder.decode(chunk.value, { stream: true });
    // biome-ignore lint/performance/noAwaitInLoops: a stream is read in order.
    chunk = await reader.read();
  }
  if (!chunk.done) {
    // Stop reading: a body with no Content-Length could be any size.
    await reader.cancel();
    return;
  }
  return text + decoder.decode();
}

async function readEmail(request: Request): Promise<string | Response> {
  // Browsers only send JSON across sites after a preflight, which this route
  // never approves, so this also stops form posts from other sites.
  const type = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!type.startsWith("application/json")) {
    return json({ error: 'Send JSON: { "email": "…" }.' }, 415);
  }
  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > MAX_BODY_BYTES) {
    return json({ error: "Request body too large." }, 413);
  }
  const raw = await readCapped(request);
  if (raw === undefined) {
    return json({ error: "Request body too large." }, 413);
  }
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: 'Send JSON: { "email": "…" }.' }, 400);
  }
  const email = (body as { email?: unknown } | null)?.email;
  if (typeof email !== "string") {
    return json({ error: 'Send JSON: { "email": "…" }.' }, 400);
  }
  return email.trim();
}

function notify(
  options: ValidateEmailHandlerOptions,
  event: ValidateEmailEvent
): void {
  try {
    options.onResult?.(event);
  } catch {
    // A logging hook must never break the form.
  }
}

/**
 * A Route Handler that validates one email for a form.
 *
 * ```ts
 * // app/api/leadmagic/validate-email/route.ts
 * import { createValidateEmailHandler } from "leadmagic/next";
 * export const POST = createValidateEmailHandler();
 * ```
 *
 * The route is reachable by anyone who loads your page, so it only answers
 * same-origin requests, returns `{ verdict, roleBased }` and nothing else,
 * caches per email, caps how many checks it makes, and fails open: when
 * LeadMagic is slow, rate limited or out of credits, it answers `unknown`
 * and your signup goes through.
 */
export function createValidateEmailHandler(
  options: ValidateEmailHandlerOptions = {}
): (request: Request) => Promise<Response> {
  const cache =
    options.cache === false
      ? undefined
      : new TtlCache(
          options.cache?.max ?? DEFAULT_CACHE_MAX,
          options.cache?.ttlMs ?? DEFAULT_CACHE_TTL_MS
        );
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const limits =
    options.rateLimit === false
      ? undefined
      : {
          perIp: options.rateLimit?.perIp ?? DEFAULT_PER_IP,
          total: options.rateLimit?.total ?? DEFAULT_TOTAL,
          counter: new WindowCounter(
            options.rateLimit?.windowMs ?? DEFAULT_WINDOW_MS
          ),
        };
  let client: LeadMagicClient | undefined;
  let loggedConfigError = false;

  // Created on first request, so a missing key never breaks `next build`.
  function getClient(): LeadMagicClient {
    if (!client) {
      const given = options.client;
      client =
        given && "validateEmail" in given
          ? given
          : createClient({ maxRetries: 1, ...given });
    }
    return client;
  }

  const UNKNOWN: ValidateEmailResponse = {
    verdict: "unknown",
    roleBased: false,
  };

  // Origin, body and the caller's `protect` hook. A Response means refuse.
  async function admit(request: Request): Promise<string | Response> {
    if (!isAllowedOrigin(request, options.allowedOrigins)) {
      return json({ error: "Cross-origin requests are not allowed." }, 403);
    }
    const email = await readEmail(request);
    if (email instanceof Response || !options.protect) {
      return email;
    }
    const allowed = await options.protect(request, { email });
    if (allowed instanceof Response) {
      return allowed;
    }
    return allowed ? email : json({ error: "Request refused." }, 403);
  }

  // A missing or exposed key: explain it in development, fail open in production.
  function configFailure(email: string, error: LeadMagicError): Response {
    if (isDev()) {
      return json({ error: { code: error.code, message: error.message } }, 500);
    }
    if (!loggedConfigError) {
      loggedConfigError = true;
      console.error(`[leadmagic] ${error.message}`);
    }
    notify(options, { email, verdict: "unknown", error, cached: false });
    return json(UNKNOWN, 200);
  }

  // Which cap a request is over, if any. The visitor's own cap is checked
  // first so one noisy visitor cannot use up everyone's share.
  function overLimit(request: Request): string | undefined {
    if (!limits) {
      return;
    }
    const ip = clientIp(request);
    if (ip && !limits.counter.take(`ip:${ip}`, limits.perIp)) {
      return "route_limit_per_ip";
    }
    return limits.counter.take("total", limits.total)
      ? undefined
      : "route_limit_total";
  }

  // Anything on our side: never block a signup.
  function failOpen(email: string, error: LeadMagicError): Response {
    notify(options, { email, verdict: "unknown", error, cached: false });
    return json(
      UNKNOWN,
      200,
      isDev() ? { "x-leadmagic-error": error.code } : {}
    );
  }

  function answer(
    email: string,
    key: string,
    value: ValidateEmailResponse
  ): Response {
    cache?.set(key, value);
    notify(options, {
      email,
      verdict: value.verdict,
      error: null,
      cached: false,
    });
    return json(value, 200);
  }

  return async function handle(request: Request): Promise<Response> {
    const email = await admit(request);
    if (email instanceof Response) {
      return email;
    }

    const key = email.toLowerCase();
    const cached = cache?.get(key);
    if (cached) {
      notify(options, {
        email,
        verdict: cached.verdict,
        error: null,
        cached: true,
      });
      return json(cached, 200);
    }

    const reason = overLimit(request);
    if (reason) {
      return failOpen(
        email,
        new LeadMagicError({
          code: "rate_limit_exceeded",
          kind: "rate_limit",
          status: 0,
          reason,
          message:
            "This route's rateLimit was reached, so it answered unknown without calling LeadMagic.",
        })
      );
    }

    let lm: LeadMagicClient;
    try {
      lm = getClient();
    } catch (error) {
      if (!isLeadMagicError(error)) {
        throw error;
      }
      return configFailure(email, error);
    }

    const result = await lm.validateEmail(email, { timeoutMs });
    if (!result.error) {
      return answer(email, key, {
        verdict: result.data.verdict,
        roleBased: result.data.is_role_based,
      });
    }
    // Not an email address: the visitor can fix it, so say so.
    if (result.error.kind === "invalid_input") {
      return answer(email, key, { verdict: "undeliverable", roleBased: false });
    }
    return failOpen(email, result.error);
  };
}
