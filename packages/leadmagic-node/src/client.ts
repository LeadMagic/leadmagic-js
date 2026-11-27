import { resolveConfig } from "./core/env";
import type {
  Call,
  RequestOptions,
  Result,
  TransportConfig,
} from "./core/http";
import { send } from "./core/http";
import type { AnalyticsResource, CreditsResource } from "./resources/account";
import { createAnalytics, createCredits } from "./resources/account";
import type { AdsResource } from "./resources/ads";
import { createAds } from "./resources/ads";
import type { BulkResource } from "./resources/bulk";
import { createBulk } from "./resources/bulk";
import type { CompaniesResource } from "./resources/companies";
import { createCompanies } from "./resources/companies";
import type { EmailResource } from "./resources/email";
import { createEmail } from "./resources/email";
import type { JobsResource } from "./resources/jobs";
import { createJobs } from "./resources/jobs";
import type { LocalLeadsResource } from "./resources/local-leads";
import { createLocalLeads } from "./resources/local-leads";
import type { PeopleResource } from "./resources/people";
import { createPeople } from "./resources/people";

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
  /**
   * Time allowed for each attempt. Default 35000 ms, a little longer than the
   * API's own 29 s limit, so a slow call returns the API's answer instead of a
   * client timeout.
   */
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 35_000;
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
 * The LeadMagic API client.
 *
 * Throws a `config` {@link LeadMagicError} straight away if the key is missing
 * or would be exposed to the browser. Every call after that resolves to
 * `{ data, error, meta }` and never throws.
 */
export class LeadMagic {
  readonly ads: AdsResource;
  readonly analytics: AnalyticsResource;
  readonly bulk: BulkResource;
  readonly companies: CompaniesResource;
  readonly credits: CreditsResource;
  readonly email: EmailResource;
  readonly jobs: JobsResource;
  readonly localLeads: LocalLeadsResource;
  readonly people: PeopleResource;
  /** True when this client talks to the Sandbox. */
  readonly sandbox: boolean;
  readonly #config: TransportConfig;

  constructor(options: LeadMagicOptions = {}) {
    const config = transport(options);
    this.#config = config;
    this.sandbox = config.sandbox;
    this.ads = createAds(config);
    this.analytics = createAnalytics(config);
    this.bulk = createBulk(config);
    this.companies = createCompanies(config);
    this.credits = createCredits(config);
    this.email = createEmail(config);
    this.jobs = createJobs(config);
    this.localLeads = createLocalLeads(config);
    this.people = createPeople(config);
  }

  /**
   * Calls any endpoint with the client's key, retries and error handling,
   * including ones this version has no method for. Field names go to the API
   * unchanged.
   */
  request<T = Record<string, unknown>>(
    call: Call,
    options?: RequestOptions
  ): Promise<Result<T>> {
    return send<T>(this.#config, call, options);
  }
}
