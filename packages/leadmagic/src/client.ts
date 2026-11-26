import { resolveConfig } from "./env";
import type { RequestOptions, TransportConfig } from "./http";
import type { FindCompanyInput, FindCompanyResult } from "./resources/company";
import { findCompanyWith } from "./resources/company";
import type { GetCreditsResult } from "./resources/credits";
import { getCreditsWith } from "./resources/credits";
import type {
  ValidateEmailOptions,
  ValidateEmailResult,
} from "./resources/email";
import { validateEmailWith } from "./resources/email";

export interface LeadMagicOptions {
  /** Defaults to `process.env.LEADMAGIC_API_KEY`. Never pass a key to browser code. */
  apiKey?: string;
  /** Defaults to `https://api.leadmagic.io`, or the Sandbox when `sandbox` is on. */
  baseUrl?: string;
  /** Custom fetch, e.g. for tests or proxies. Defaults to the global `fetch`. */
  fetch?: typeof fetch;
  /** Extra headers sent with every request. */
  headers?: Record<string, string>;
  /** Retries for 429, 502, 503, 504 and network errors. Default 2. */
  maxRetries?: number;
  /**
   * Use the public Sandbox: synthetic data, no key, no credits. Defaults to
   * `LEADMAGIC_SANDBOX=1`.
   */
  sandbox?: boolean;
  /** Overall budget per call, retries included. Default 10000 ms. */
  timeoutMs?: number;
}

export interface LeadMagicClient {
  /** Look up one company by domain, name or LinkedIn URL. 1 credit when found. */
  findCompany: (
    input: FindCompanyInput,
    options?: RequestOptions
  ) => Promise<FindCompanyResult>;
  /** Credit balance. Free. */
  getCredits: (options?: RequestOptions) => Promise<GetCreditsResult>;
  /** True when this client talks to the Sandbox. */
  readonly sandbox: boolean;
  /** Validate one email address. 0.25 credits for `valid` or `invalid`; `unknown` is free. */
  validateEmail: (
    email: string,
    options?: ValidateEmailOptions
  ) => Promise<ValidateEmailResult>;
}

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_MAX_RETRIES = 2;

function transport(options: LeadMagicOptions): TransportConfig {
  const resolved = resolveConfig(options);
  const fetchImpl = options.fetch ?? globalThis.fetch;
  if (typeof fetchImpl !== "function") {
    throw new TypeError(
      "No fetch implementation found. Use Node 20+ or pass { fetch }."
    );
  }
  return {
    ...resolved,
    fetch: fetchImpl.bind(globalThis),
    headers: options.headers ?? {},
    maxRetries: options.maxRetries ?? DEFAULT_MAX_RETRIES,
    timeoutMs: options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  };
}

/**
 * Creates a client. Throws a `config` {@link LeadMagicError} straight away if
 * the key is missing or would be exposed to the browser; every API failure
 * after that comes back as `{ error }` instead of throwing.
 */
export function createClient(options: LeadMagicOptions = {}): LeadMagicClient {
  const config = transport(options);
  return {
    sandbox: config.sandbox,
    validateEmail: (email, opts) => validateEmailWith(config, email, opts),
    findCompany: (input, opts) => findCompanyWith(config, input, opts),
    getCredits: (opts) => getCreditsWith(config, opts),
  };
}

/** Validate one email address with the key from `LEADMAGIC_API_KEY`. */
export function validateEmail(
  email: string,
  options?: ValidateEmailOptions
): Promise<ValidateEmailResult> {
  return validateEmailWith(transport({}), email, options);
}

/** Look up one company with the key from `LEADMAGIC_API_KEY`. */
export function findCompany(
  input: FindCompanyInput,
  options?: RequestOptions
): Promise<FindCompanyResult> {
  return findCompanyWith(transport({}), input, options);
}

/** Credit balance for the key in `LEADMAGIC_API_KEY`. */
export function getCredits(
  options?: RequestOptions
): Promise<GetCreditsResult> {
  return getCreditsWith(transport({}), options);
}
