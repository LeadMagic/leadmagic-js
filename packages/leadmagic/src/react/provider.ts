import type { ReactElement, ReactNode } from "react";
import { createContext, createElement, useContext, useRef } from "react";
import type { EmailValidationResult } from "./check-email";
import type { UseEmailValidationOptions } from "./use-email-validation";

/** Options every `useEmailValidation` under the provider starts from. */
export type EmailValidationDefaults = Pick<
  UseEmailValidationOptions,
  | "debounceMs"
  | "endpoint"
  | "fetch"
  | "headers"
  | "queryFn"
  | "retry"
  | "retryDelay"
  | "staleTime"
  | "timeoutMs"
  | "validateOn"
>;

export interface LeadMagicProviderProps extends EmailValidationDefaults {
  children?: ReactNode;
}

export interface CachedAnswer {
  at: number;
  result: EmailValidationResult;
}

/** One request in flight, shared by every hook asking about the same address. */
export interface PendingCheck {
  controller: AbortController;
  promise: Promise<EmailValidationResult>;
  waiters: number;
}

/** Answers and requests in flight, shared by the hooks that use one store. */
export interface CheckStore {
  cache: Map<string, CachedAnswer>;
  pending: Map<string, PendingCheck>;
}

export function createCheckStore(): CheckStore {
  return { cache: new Map(), pending: new Map() };
}

interface ProviderValue {
  defaults: EmailValidationDefaults;
  store: CheckStore;
}

const LeadMagicContext = createContext<ProviderValue | null>(null);

/**
 * Sets defaults for every `useEmailValidation` below it, such as a custom
 * `endpoint`, and lets those hooks share answers: an address is asked about
 * once, even when several fields check it at the same moment. Optional:
 * without it each hook uses the built-in defaults and its own cache.
 *
 * ```tsx
 * <LeadMagicProvider endpoint="/api/forms/check-email">{children}</LeadMagicProvider>
 * ```
 */
export function LeadMagicProvider({
  children,
  ...defaults
}: LeadMagicProviderProps): ReactElement {
  const store = useRef<CheckStore | null>(null);
  store.current ??= createCheckStore();
  return createElement(
    LeadMagicContext.Provider,
    { value: { store: store.current, defaults } },
    children
  );
}

export function useLeadMagicContext(): ProviderValue | null {
  return useContext(LeadMagicContext);
}
