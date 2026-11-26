import type { EmailVerdict } from "../resources/email";

export const DEFAULT_ENDPOINT = "/api/leadmagic/validate-email";
export const DEFAULT_STALE_TIME_MS: number = 10 * 60 * 1000;
const MAX_EMAIL_LENGTH = 320;
const WHITESPACE = /\s/u;

/**
 * A quick shape check before asking the route: one `@`, no spaces, and a dot
 * inside the domain. Plain string steps, so long input cannot slow it down.
 */
export function looksLikeEmail(value: string): boolean {
  if (value.length > MAX_EMAIL_LENGTH || WHITESPACE.test(value)) {
    return false;
  }
  const at = value.indexOf("@");
  if (at < 1 || at !== value.lastIndexOf("@")) {
    return false;
  }
  return value.slice(at + 2, -1).includes(".");
}

/** One answer from your validation route. */
export interface EmailValidationResult {
  /** The address that was checked, trimmed. */
  email: string;
  /** The address is a role or shared mailbox such as `info@`. */
  roleBased: boolean;
  verdict: EmailVerdict;
}

/** Extra request headers, or a function that returns them for each request. */
export type RequestHeaders =
  | Record<string, string>
  | (() => Record<string, string> | Promise<Record<string, string>>);

export interface CheckEmailOptions {
  /** Your route from `createValidateEmailHandler`. Default `/api/leadmagic/validate-email`. */
  endpoint?: string;
  /** Custom fetch. Defaults to the global `fetch`. */
  fetch?: typeof fetch;
  /** Sent with the request, e.g. a bot-check token for your route's `protect`. */
  headers?: RequestHeaders;
  signal?: AbortSignal;
  /** Give up after this long. No limit by default; the route has its own. */
  timeoutMs?: number;
}

/** Your route could not be reached, or did not answer with a verdict. */
export class EmailCheckError extends Error {
  override readonly name = "EmailCheckError";
  /** HTTP status from your route, or 0 when no response arrived. */
  readonly status: number;

  constructor(message: string, options: { cause?: unknown; status: number }) {
    super(message, { cause: options.cause });
    this.status = options.status;
  }
}

export function isVerdict(value: unknown): value is EmailVerdict {
  return (
    value === "deliverable" || value === "undeliverable" || value === "unknown"
  );
}

async function resolveHeaders(
  headers: RequestHeaders | undefined
): Promise<Record<string, string>> {
  return typeof headers === "function" ? await headers() : (headers ?? {});
}

/**
 * Asks your validation route about one address. This is what
 * `useEmailValidation` calls; use it directly from any framework or data
 * library. Rejects with {@link EmailCheckError} when the route gives no
 * verdict, and with the abort reason when `signal` is aborted.
 */
export async function checkEmail(
  email: string,
  options: CheckEmailOptions = {}
): Promise<EmailValidationResult> {
  const value = email.trim();
  const { endpoint = DEFAULT_ENDPOINT, signal, timeoutMs } = options;
  const headers = await resolveHeaders(options.headers);

  const controller = new AbortController();
  const onAbort = () => controller.abort(signal?.reason);
  if (signal?.aborted) {
    controller.abort(signal.reason);
  } else {
    signal?.addEventListener("abort", onAbort, { once: true });
  }
  let timedOut = false;
  const timer = timeoutMs
    ? setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, timeoutMs)
    : undefined;

  try {
    let response: Response;
    try {
      response = await (options.fetch ?? fetch)(endpoint, {
        method: "POST",
        headers: { ...headers, "content-type": "application/json" },
        body: JSON.stringify({ email: value }),
        signal: controller.signal,
      });
    } catch (cause) {
      if (signal?.aborted) {
        throw cause;
      }
      throw new EmailCheckError(
        timedOut
          ? `The validation route did not answer within ${timeoutMs} ms.`
          : "Could not reach the validation route.",
        { status: 0, cause }
      );
    }
    if (!response.ok) {
      throw new EmailCheckError(
        `The validation route answered ${response.status}.`,
        { status: response.status }
      );
    }
    const body = (await response.json().catch(() => null)) as {
      roleBased?: unknown;
      verdict?: unknown;
    } | null;
    if (!isVerdict(body?.verdict)) {
      throw new EmailCheckError(
        "The validation route sent an answer without a verdict.",
        { status: response.status }
      );
    }
    return {
      email: value,
      verdict: body.verdict,
      roleBased: body.roleBased === true,
    };
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}

export interface EmailValidationQueryOptions {
  /** False until the text looks like an email address. */
  enabled: boolean;
  queryFn: (context: {
    signal?: AbortSignal;
  }) => Promise<EmailValidationResult>;
  queryKey: readonly ["leadmagic", "email-validation", string, string];
  staleTime: number;
}

/**
 * Options for TanStack Query, so the check uses your query cache, retries
 * and devtools:
 *
 * ```ts
 * const query = useQuery(emailValidationQueryOptions(email));
 * ```
 */
export function emailValidationQueryOptions(
  email: string,
  options: Omit<CheckEmailOptions, "signal"> & { staleTime?: number } = {}
): EmailValidationQueryOptions {
  const value = email.trim();
  const { staleTime = DEFAULT_STALE_TIME_MS, ...request } = options;
  return {
    queryKey: [
      "leadmagic",
      "email-validation",
      request.endpoint ?? DEFAULT_ENDPOINT,
      value.toLowerCase(),
    ],
    queryFn: ({ signal }) => checkEmail(value, { ...request, signal }),
    enabled: looksLikeEmail(value),
    staleTime,
  };
}
