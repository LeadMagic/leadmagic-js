import { useCallback, useEffect, useRef, useState } from "react";
import type { EmailVerdict } from "../resources/email";

export type EmailFieldStatus = "idle" | "checking" | EmailVerdict;

export interface UseEmailValidationOptions {
  /** Wait after the last keystroke when `validateOn` is `change`. Default 600 ms. */
  debounceMs?: number;
  /** Your route from `createValidateEmailHandler`. Default `/api/leadmagic/validate-email`. */
  endpoint?: string;
  /** Custom fetch, e.g. to add headers. */
  fetch?: typeof fetch;
  /** Check when the field loses focus (default) or while typing, debounced. */
  validateOn?: "blur" | "change";
}

export interface EmailInputProps {
  "aria-busy": boolean;
  "aria-invalid": boolean | undefined;
  onBlur: (event: { currentTarget: { value: string } }) => void;
  onChange: (event: { currentTarget: { value: string } }) => void;
}

export interface UseEmailValidation {
  /** Spread onto an `<input type="email">`, alongside your own `value`/`name`. */
  inputProps: EmailInputProps;
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

const DEFAULT_ENDPOINT = "/api/leadmagic/validate-email";
const LOOKS_LIKE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

interface Answer {
  roleBased: boolean;
  verdict: EmailVerdict;
}

function isVerdict(value: unknown): value is EmailVerdict {
  return (
    value === "deliverable" || value === "undeliverable" || value === "unknown"
  );
}

/**
 * Headless email validation for forms. Talks to your own route, never to
 * LeadMagic directly, so no key reaches the browser.
 *
 * ```tsx
 * const email = useEmailValidation();
 * <input type="email" name="email" {...email.inputProps} />
 * {email.status === "undeliverable" && <p>This address can't receive email.</p>}
 * ```
 */
export function useEmailValidation(
  options: UseEmailValidationOptions = {}
): UseEmailValidation {
  const {
    endpoint = DEFAULT_ENDPOINT,
    validateOn = "blur",
    debounceMs = 600,
  } = options;
  const fetchImpl = options.fetch;

  const [status, setStatus] = useState<EmailFieldStatus>("idle");
  const [roleBased, setRoleBased] = useState(false);

  const cache = useRef(new Map<string, Answer>());
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

  const apply = useCallback((answer: Answer) => {
    setStatus(answer.verdict);
    setRoleBased(answer.roleBased);
  }, []);

  const validate = useCallback(
    async (input: string): Promise<EmailVerdict> => {
      clearTimer();
      const value = input.trim();
      lastValue.current = value;
      inflight.current?.abort();

      if (!value) {
        setStatus("idle");
        setRoleBased(false);
        return "unknown";
      }
      if (!LOOKS_LIKE_EMAIL.test(value)) {
        apply({ verdict: "undeliverable", roleBased: false });
        return "undeliverable";
      }

      const key = value.toLowerCase();
      const hit = cache.current.get(key);
      if (hit) {
        apply(hit);
        return hit.verdict;
      }

      const controller = new AbortController();
      inflight.current = controller;
      setStatus("checking");

      let answer: Answer = { verdict: "unknown", roleBased: false };
      try {
        const response = await (fetchImpl ?? fetch)(endpoint, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email: value }),
          signal: controller.signal,
        });
        if (response.ok) {
          const body = (await response.json()) as Partial<Answer>;
          if (isVerdict(body.verdict)) {
            answer = {
              verdict: body.verdict,
              roleBased: body.roleBased === true,
            };
            cache.current.set(key, answer);
          }
        }
      } catch {
        if (controller.signal.aborted) {
          return "unknown";
        }
      }

      // A newer call owns the state now.
      if (inflight.current !== controller) {
        return answer.verdict;
      }
      inflight.current = null;
      apply(answer);
      return answer.verdict;
    },
    [apply, clearTimer, endpoint, fetchImpl]
  );

  const reset = useCallback(() => {
    clearTimer();
    inflight.current?.abort();
    inflight.current = null;
    lastValue.current = "";
    setStatus("idle");
    setRoleBased(false);
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
      setStatus("idle");
      setRoleBased(false);
      if (validateOn === "change") {
        clearTimer();
        timer.current = setTimeout(() => {
          validate(value);
        }, debounceMs);
      }
    },
    [clearTimer, debounceMs, validate, validateOn]
  );

  const onBlur = useCallback(
    (event: { currentTarget: { value: string } }) => {
      const value = event.currentTarget.value.trim();
      if (value && value !== lastValue.current) {
        validate(value);
      }
    },
    [validate]
  );

  return {
    status,
    roleBased,
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
