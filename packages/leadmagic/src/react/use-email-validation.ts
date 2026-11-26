import { useCallback, useEffect, useRef, useState } from "react";
import type { EmailVerdict } from "../resources/email";
import type { EmailValidationResult, RequestHeaders } from "./check-email";
import {
  checkEmail,
  DEFAULT_STALE_TIME_MS,
  EmailCheckError,
  isVerdict,
  LOOKS_LIKE_EMAIL,
} from "./check-email";
import type { CachedAnswer, CheckStore, PendingCheck } from "./provider";
import { createCheckStore, useLeadMagicContext } from "./provider";

export type EmailFieldStatus = "idle" | "checking" | EmailVerdict;

export interface UseEmailValidationOptions {
  /** Wait after the last keystroke when `validateOn` is `change`. Default 600 ms. */
  debounceMs?: number;
  /**
   * `false` stops the field from checking by itself. `validate()` still
   * works, so you can check on submit only. Default `true`.
   */
  enabled?: boolean;
  /** Your route from `createValidateEmailHandler`. Default `/api/leadmagic/validate-email`. */
  endpoint?: string;
  /** Custom fetch for the built-in request. */
  fetch?: typeof fetch;
  /** Sent with the built-in request, e.g. a bot-check token for your route's `protect`. */
  headers?: RequestHeaders;
  /** Called when a check fails and the field falls back to `unknown`. */
  onError?: (error: Error, email: string) => void;
  /** Called after every check, whether it succeeded or failed. */
  onSettled?: (
    result: EmailValidationResult | undefined,
    error: Error | null,
    email: string
  ) => void;
  /** Called with each answer that came from your route or `queryFn`. */
  onSuccess?: (result: EmailValidationResult) => void;
  /**
   * Replaces the built-in request, e.g. to call a server action or your own
   * API instead of a route. Return the verdict; throw to report a failure.
   */
  queryFn?: (
    email: string,
    context: { signal: AbortSignal }
  ) => Promise<{ roleBased?: boolean; verdict: EmailVerdict }>;
  /** Extra attempts after a failed check. Default `0`. */
  retry?: number | false;
  /** Wait before each retry, in ms. Default doubles from 1000 up to 8000. */
  retryDelay?: number | ((attempt: number) => number);
  /** Return `false` to skip the check for an address; it reads as `unknown`. */
  shouldValidate?: (email: string) => boolean;
  /** How long an answer is reused for the same address. Default 10 minutes. */
  staleTime?: number;
  /** Give up on the built-in request after this long. No limit by default. */
  timeoutMs?: number;
  /**
   * When the field checks by itself: when it loses focus (default), while
   * typing (debounced), or never (`manual`: call `validate()` yourself).
   */
  validateOn?: "blur" | "change" | "manual";
}

export interface EmailInputProps {
  "aria-busy": boolean;
  "aria-invalid": boolean | undefined;
  onBlur: (event: { currentTarget: { value: string } }) => void;
  onChange: (event: { currentTarget: { value: string } }) => void;
}

export interface UseEmailValidation {
  /** The last answer, or `undefined` before the first one and after an edit. */
  data: EmailValidationResult | undefined;
  /** Why the last check failed. `null` when it succeeded. */
  error: Error | null;
  /** Spread onto an `<input type="email">`, alongside your own `value`/`name`. */
  inputProps: EmailInputProps;
  isChecking: boolean;
  isDeliverable: boolean;
  isUndeliverable: boolean;
  isUnknown: boolean;
  /** Back to `idle`, e.g. after the form resets. */
  reset: () => void;
  /** The address is a role or shared mailbox such as `info@`. */
  roleBased: boolean;
  status: EmailFieldStatus;
  /**
   * Check an address now and get its verdict, e.g. in a submit handler.
   * Never rejects: anything that goes wrong resolves to `unknown`.
   */
  validate: (value: string) => Promise<EmailVerdict>;
}

interface FieldState {
  data: EmailValidationResult | undefined;
  error: Error | null;
  status: EmailFieldStatus;
}

const IDLE: FieldState = { status: "idle", data: undefined, error: null };
const MAX_CACHED = 100;
const MAX_RETRY_DELAY_MS = 8000;

/** A refusal from the route (other than "slow down") will not change on retry. */
function isRetryable(error: unknown): boolean {
  if (!(error instanceof EmailCheckError)) {
    return true;
  }
  return error.status === 0 || error.status === 429 || error.status >= 500;
}

function retryDelayFor(
  option: UseEmailValidationOptions["retryDelay"],
  attempt: number
): number {
  if (typeof option === "function") {
    return option(attempt);
  }
  return option ?? Math.min(1000 * 2 ** attempt, MAX_RETRY_DELAY_MS);
}

function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
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

async function attemptCheck(
  email: string,
  options: UseEmailValidationOptions,
  signal: AbortSignal
): Promise<EmailValidationResult> {
  if (!options.queryFn) {
    return checkEmail(email, {
      endpoint: options.endpoint,
      fetch: options.fetch,
      headers: options.headers,
      timeoutMs: options.timeoutMs,
      signal,
    });
  }
  const answer = await options.queryFn(email, { signal });
  if (!isVerdict(answer?.verdict)) {
    throw new EmailCheckError("queryFn resolved without a verdict.", {
      status: 0,
    });
  }
  return {
    email,
    verdict: answer.verdict,
    roleBased: answer.roleBased === true,
  };
}

/** One check with its retries. Rejects with the last error. */
async function runCheck(
  email: string,
  options: UseEmailValidationOptions,
  signal: AbortSignal
): Promise<EmailValidationResult> {
  const retries = options.retry === false ? 0 : (options.retry ?? 0);
  for (let attempt = 0; ; attempt += 1) {
    try {
      // biome-ignore lint/performance/noAwaitInLoops: retries run one after another.
      return await attemptCheck(email, options, signal);
    } catch (error) {
      if (signal.aborted || attempt >= retries || !isRetryable(error)) {
        throw error;
      }
      await wait(retryDelayFor(options.retryDelay, attempt), signal);
      if (signal.aborted) {
        throw error;
      }
    }
  }
}

/** Answers from different routes are kept apart. */
function storeKey(options: UseEmailValidationOptions, email: string): string {
  const source = options.queryFn ? "queryFn" : (options.endpoint ?? "");
  return `${source}\n${email.toLowerCase()}`;
}

/**
 * Joins the request already in flight for this address, or starts one. The
 * request is only cancelled once every hook waiting on it has moved on.
 */
function joinCheck(
  store: CheckStore,
  key: string,
  email: string,
  options: UseEmailValidationOptions,
  signal: AbortSignal
): Promise<EmailValidationResult> {
  let entry = store.pending.get(key);
  if (!entry) {
    const controller = new AbortController();
    const created: PendingCheck = {
      controller,
      waiters: 0,
      promise: runCheck(email, options, controller.signal).finally(() => {
        if (store.pending.get(key) === created) {
          store.pending.delete(key);
        }
      }),
    };
    store.pending.set(key, created);
    entry = created;
  }
  const joined = entry;
  joined.waiters += 1;
  signal.addEventListener(
    "abort",
    () => {
      joined.waiters -= 1;
      if (joined.waiters <= 0) {
        joined.controller.abort();
      }
    },
    { once: true }
  );
  return joined.promise;
}

function remember(
  cache: Map<string, CachedAnswer>,
  key: string,
  result: EmailValidationResult
): void {
  cache.delete(key);
  cache.set(key, { result, at: Date.now() });
  if (cache.size > MAX_CACHED) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) {
      cache.delete(oldest);
    }
  }
}

/**
 * Headless email validation for forms. Talks to your own route, never to
 * LeadMagic directly, so no key reaches the browser.
 *
 * ```tsx
 * const email = useEmailValidation();
 * <input type="email" name="email" {...email.inputProps} />
 * {email.isUndeliverable && <p>This address can't receive email.</p>}
 * ```
 *
 * Options given here override the ones from `LeadMagicProvider`.
 */
export function useEmailValidation(
  options: UseEmailValidationOptions = {}
): UseEmailValidation {
  const context = useLeadMagicContext();
  const config: UseEmailValidationOptions = {
    ...context?.defaults,
    ...options,
  };
  const { validateOn = "blur", debounceMs = 600, enabled = true } = config;

  const [state, setState] = useState<FieldState>(IDLE);

  // Events read the newest options without re-creating the handlers.
  const latest = useRef(config);
  useEffect(() => {
    latest.current = config;
  });

  const ownStore = useRef<CheckStore | null>(null);
  ownStore.current ??= createCheckStore();
  const store = context?.store ?? ownStore.current;
  const inflight = useRef<AbortController | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastValue = useRef("");

  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  useEffect(
    () => () => {
      clearTimer();
      inflight.current?.abort();
    },
    [clearTimer]
  );

  const show = useCallback((result: EmailValidationResult) => {
    setState({ status: result.verdict, data: result, error: null });
  }, []);

  const request = useCallback(
    async (value: string): Promise<EmailVerdict> => {
      const { current } = latest;
      const controller = new AbortController();
      inflight.current = controller;
      setState({ status: "checking", data: undefined, error: null });

      const key = storeKey(current, value);
      try {
        const result = await joinCheck(
          store,
          key,
          value,
          current,
          controller.signal
        );
        if (controller.signal.aborted) {
          return "unknown";
        }
        remember(store.cache, key, result);
        // A newer call may own the state by now.
        if (inflight.current === controller) {
          inflight.current = null;
          show(result);
        }
        current.onSuccess?.(result);
        current.onSettled?.(result, null, value);
        return result.verdict;
      } catch (cause) {
        if (controller.signal.aborted) {
          return "unknown";
        }
        const error = cause instanceof Error ? cause : new Error(String(cause));
        if (inflight.current === controller) {
          inflight.current = null;
          setState({ status: "unknown", data: undefined, error });
        }
        current.onError?.(error, value);
        current.onSettled?.(undefined, error, value);
        return "unknown";
      }
    },
    [show, store]
  );

  const validate = useCallback(
    (input: string): Promise<EmailVerdict> => {
      const { current } = latest;
      clearTimer();
      const value = input.trim();
      lastValue.current = value;
      inflight.current?.abort();
      inflight.current = null;

      if (!value) {
        setState(IDLE);
        return Promise.resolve("unknown");
      }
      if (!LOOKS_LIKE_EMAIL.test(value)) {
        show({ email: value, verdict: "undeliverable", roleBased: false });
        return Promise.resolve("undeliverable");
      }
      if (current.shouldValidate && !current.shouldValidate(value)) {
        show({ email: value, verdict: "unknown", roleBased: false });
        return Promise.resolve("unknown");
      }

      const hit = store.cache.get(storeKey(current, value));
      const staleTime = current.staleTime ?? DEFAULT_STALE_TIME_MS;
      if (hit && Date.now() - hit.at < staleTime) {
        show(hit.result);
        return Promise.resolve(hit.result.verdict);
      }
      return request(value);
    },
    [clearTimer, request, show, store]
  );

  const reset = useCallback(() => {
    clearTimer();
    inflight.current?.abort();
    inflight.current = null;
    lastValue.current = "";
    setState(IDLE);
  }, [clearTimer]);

  const onChange = useCallback(
    (event: { currentTarget: { value: string } }) => {
      const value = event.currentTarget.value.trim();
      if (value === lastValue.current) {
        return;
      }
      // The visitor is fixing the address: drop the old verdict.
      inflight.current?.abort();
      inflight.current = null;
      lastValue.current = "";
      setState(IDLE);
      if (enabled && validateOn === "change") {
        clearTimer();
        timer.current = setTimeout(() => {
          validate(value);
        }, debounceMs);
      }
    },
    [clearTimer, debounceMs, enabled, validate, validateOn]
  );

  const onBlur = useCallback(
    (event: { currentTarget: { value: string } }) => {
      const value = event.currentTarget.value.trim();
      if (
        enabled &&
        validateOn !== "manual" &&
        value &&
        value !== lastValue.current
      ) {
        validate(value);
      }
    },
    [enabled, validate, validateOn]
  );

  const { status } = state;
  return {
    status,
    data: state.data,
    error: state.error,
    roleBased: state.data?.roleBased ?? false,
    isChecking: status === "checking",
    isDeliverable: status === "deliverable",
    isUndeliverable: status === "undeliverable",
    isUnknown: status === "unknown",
    validate,
    reset,
    inputProps: {
      onChange,
      onBlur,
      "aria-invalid": status === "undeliverable" ? true : undefined,
      "aria-busy": status === "checking",
    },
  };
}
