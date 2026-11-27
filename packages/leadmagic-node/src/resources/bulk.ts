import { clientError, LeadMagicError } from "../core/errors";
import type { RequestOptions, Result, TransportConfig } from "../core/http";
import { invalidInput, open, send } from "../core/http";
import {
  compact,
  invalidPage,
  isObj,
  iterateOffset,
  nonEmpty,
  paged,
  segment,
} from "../core/shape";
import { readEvents } from "../core/sse";
import type { ApiResponse, PageResult } from "../core/types";

/* -------------------------------------------------------------------------- */
/* Jobs                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Where a job is. `completed`, `failed` and `canceled` are final; the others
 * are steps on the way.
 */
export type BulkJobStatus =
  | "uploading"
  | "uploaded"
  | "ingesting"
  | "ingested"
  | "pending"
  | "running"
  | "processing"
  | "pausing"
  | "paused"
  | "finalizing"
  | "completed"
  | "failed"
  | "canceled"
  | (string & Record<never, never>);

/** Statuses a job does not leave unless it is restarted. */
export const BULK_FINAL_STATUSES: readonly string[] = [
  "completed",
  "failed",
  "canceled",
];

/** True when `status` is `completed`, `failed` or `canceled`. */
export function isFinalStatus(status: unknown): boolean {
  return typeof status === "string" && BULK_FINAL_STATUSES.includes(status);
}

export type BulkSubmission = ApiResponse<"bulk-submit">;
export type BulkJobList = ApiResponse<"bulk-job-list">;
export type BulkJobSummary = BulkJobList["jobs"][number];
/** One job. Timestamps are Postgres text, e.g. `2026-11-27 10:00:00.12+00`. */
export type BulkJob = ApiResponse<"bulk-job-status">;

/** A row's status: `pending`, `success`, `failed` or `skipped`. */
export type BulkRowStatus =
  | "pending"
  | "success"
  | "failed"
  | "skipped"
  | (string & Record<never, never>);

type WireRow = ApiResponse<"bulk-job-results">["rows"][number];

export interface BulkRow extends Omit<WireRow, "status"> {
  /** The product that produced this row. */
  product?: string | null;
  status: BulkRowStatus;
}

export interface BulkRows {
  limit: number;
  offset: number;
  rows: BulkRow[];
}

/** A failed row: the input and why it failed. */
export interface BulkFailedRow {
  completed_at: string | null;
  error_message: string | null;
  http_status_code: number | null;
  id: string;
  lm_input: Record<string, unknown> | null;
  row_index: number;
}

export interface BulkErrors {
  limit: number;
  offset: number;
  rows: BulkFailedRow[];
}

export interface BulkEvent {
  created_at: string;
  event_type: string;
  id: string;
  level: string | null;
  message: string | null;
  payload: Record<string, unknown>;
  source: string | null;
  stage: string | null;
  status: string | null;
}

export interface BulkEvents {
  events: BulkEvent[];
  limit: number;
}

export interface BulkPaused {
  jobId: string;
  paused: true;
  status: "paused";
}

export interface BulkResumed {
  jobId: string;
  resumed: true;
  status: "running";
}

export interface BulkRestarted {
  jobId: string;
  mode: BulkRestartMode;
  position: number;
  product: string;
  /** Rows reset to run again. */
  resetRowCount: number;
  restarted: true;
  restartFromRowIndex: number | null;
  started: boolean;
}

export interface BulkPriority {
  jobId: string;
  priority: number;
}

export interface BulkCanceled {
  jobId: string;
  status: "canceled";
}

/** Limits, routes and features of the bulk API. */
export interface BulkCapabilities {
  features: Record<string, boolean>;
  limits: {
    defaultShardSize: number;
    maxInlineRows: number;
    maxShardSize: number;
    maxSourceBytes: number;
  };
  submission: {
    callbackEvents: string[];
    executionModes: string[];
    routes: Record<string, string>;
  };
  version: string;
  [key: string]: unknown;
}

/* -------------------------------------------------------------------------- */
/* Inputs                                                                     */
/* -------------------------------------------------------------------------- */

/** Products a bulk job can run. Any other string is sent as is. */
export type BulkProduct =
  | "email_validation"
  | "email_finder"
  | "personal_email_finder"
  | "profile_search"
  | "mobile_finder"
  | "role_finder"
  | "employee_finder"
  | "people_search"
  | "company_search"
  | "company_finder"
  | "company_funding"
  | "competitors_search"
  | "technographics"
  | "b2b_profile_to_email"
  | "email_to_b2b_profile"
  | "job_change_detector"
  | "jobs_finder"
  | "mobile_validation"
  | "google_ads_search"
  | "meta_ads_search"
  | "b2b_ads_search"
  | "b2b_ads_details"
  | (string & Record<never, never>);

export type BulkCallbackEvent =
  | "completed"
  | "failed"
  | "canceled"
  | "progress"
  | "any";

export interface BulkCallback {
  /** Which outcomes to send. Default `["completed"]`. `progress` sends 25, 50 and 75%. */
  events?: BulkCallbackEvent[];
  /** Include up to 250 result rows in the webhook body. */
  inlineResults?: boolean;
  /** Echoed back in the webhook body. */
  metadata?: Record<string, unknown>;
  /**
   * Signs each webhook so you can check it with `verifyWebhook`. Without
   * one the signature cannot be checked.
   */
  secret?: string;
  /** Public HTTPS URL that receives a POST. */
  url: string;
}

interface BulkSubmitBase {
  /** Runs the same rows again within 24 hours of an earlier job. */
  allowDuplicate?: boolean;
  /** Notified when the job ends. */
  callback?: BulkCallback;
  /** Shown in the dashboard. */
  fileName?: string;
  /** Maps your columns to the product's input fields. */
  inputMapping?: Record<
    string,
    { column?: string; source?: string; value?: unknown }
  >;
  /** Kept on the job and echoed in webhooks. */
  metadata?: Record<string, unknown>;
  /** Saved column mapping to apply, e.g. `work_email_finder`. */
  presetId?: string;
  /** -1000 to 1000; higher runs sooner. Default 0. */
  priority?: number;
  /** What to run on each row. */
  product: BulkProduct;
}

/** Exactly one source: `rows`, `csv` or `fileUrl`. */
export type BulkSubmitInput = BulkSubmitBase &
  (
    | {
        csv?: never;
        fileUrl?: never;
        format?: never;
        /** One object per row, keyed by the product's input fields. Up to 250,000. */
        rows: Record<string, unknown>[];
      }
    | {
        /** Inline CSV with a header row. */
        csv: string;
        fileUrl?: never;
        format?: never;
        rows?: never;
      }
    | {
        csv?: never;
        /** Public HTTPS URL of a CSV, JSON or JSONL file, up to 50 MB. */
        fileUrl: string;
        /** Defaults to the file extension. */
        format?: "csv" | "json" | "jsonl";
        rows?: never;
      }
  );

export interface BulkValidationWarning {
  affectedRows: number;
  code:
    | "missing_required_input"
    | "fully_unsatisfiable"
    | "sales_navigator_url"
    | (string & Record<never, never>);
  message: string;
  product: string;
  totalRows: number;
}

/** How the API read a submission, before anything runs. */
export interface BulkValidation {
  endpoint: string | null;
  format: string | null;
  /** Column names found. */
  headers: string[];
  inputMapping: Record<
    string,
    { column?: string; source: string; value?: unknown }
  >;
  presetId: string | null;
  /** The first 5 rows, after mapping. */
  previewRows: Record<string, unknown>[];
  product: string;
  totalRows: number;
  /** Rows that will fail or be skipped, and why. */
  warnings: BulkValidationWarning[];
}

export interface BulkLocalLeadsInput {
  /** City names (`Austin, TX`, `Toronto`) or US ZIP codes. Up to 100. */
  cities: string[];
  /** Two-letter codes, one per city or one for all. Default `US`. */
  countryCodes?: string[];
  /** Shown in the dashboard. */
  fileName?: string;
  /** Business types. Up to 25, and up to 100 keyword × city searches. */
  keywords: string[];
}

export interface BulkLocation {
  country?: string;
  input: string;
  resolved: string;
}

export interface BulkLocalLeadsQuote {
  /** Searches the account can still run today, when limited. */
  capacityAvailable: number | null;
  creditsPerSearch: number;
  creditsRequired: number;
  dryRun: true;
  fitsCapacity: boolean | null;
  locations: BulkLocation[];
  product: string;
  searches: { city: string; country?: string; keyword: string }[];
  totalSearches: number;
}

export interface BulkLocalLeadsSubmission {
  billing?: "waived" | "per_search_with_leads";
  /** Credits charged up front. */
  creditsCharged: number;
  /** Most the job can charge. */
  creditsMax?: number;
  jobId: string;
  locations: BulkLocation[];
  /** Queue position when `status` is `queued`. */
  position: number | null;
  product: string;
  /** True when this answers a retry of a search already submitted. */
  replayed?: boolean;
  status: "processing" | "queued";
  /** Unique keyword × city searches. */
  totalSearches: number;
}

export interface BulkListInput {
  /** Up to 200. Default 50. */
  limit?: number;
  /** Up to 10,000. */
  offset?: number;
  /** Jobs that ran this product. */
  product?: string;
  status?: BulkJobStatus;
}

export interface BulkRowsInput {
  /** Up to 1000. Default 200. */
  limit?: number;
  offset?: number;
  /** Only rows with this status. */
  status?: BulkRowStatus;
}

export type BulkRestartMode =
  | "full"
  | "failed_only"
  | "unstick"
  | "from_row"
  | "from_shard";

export interface BulkRestartInput {
  /**
   * Which rows to run again. Default `full`. `failed_only` retries failures,
   * `unstick` restarts rows stuck in flight.
   */
  mode?: BulkRestartMode;
  /** Re-check rows whose emails came back unverified. */
  recheckUnverified?: boolean;
  /** Required with `from_row`. Zero-based. */
  startRowIndex?: number;
  /** Required with `from_shard`. Zero-based. */
  startShardIndex?: number;
}

export interface BulkWaitOptions {
  /** Called with each status read. */
  onProgress?: (job: BulkJob) => void;
  /** Time between status reads. Default 2000 ms, at least 500. */
  pollIntervalMs?: number;
  signal?: AbortSignal;
  /** Gives up after this long. Default 30 minutes. */
  timeoutMs?: number;
}

/* -------------------------------------------------------------------------- */
/* Stream                                                                     */
/* -------------------------------------------------------------------------- */

export interface BulkProgressMessage {
  completedBatches?: number;
  failedItems: number;
  /** True once the job is `completed`, `failed` or `canceled`. */
  isTerminal: boolean;
  jobId: string;
  processedItems: number;
  /** 0 to 99 while running, 100 when done. */
  progressPercent: number;
  /** Rows finished since the last message, when the job sends them. */
  results?: {
    data: unknown;
    error: string | null;
    product?: string;
    rowId: string;
    status: string;
  }[];
  stats?: {
    creditsConsumed: number;
    failedItems: number;
    processedItems: number;
    skipped: number;
    succeededItems: number;
    totalItems: number;
    totalRows: number;
  };
  status: BulkJobStatus;
  succeededItems: number;
  totalBatches?: number;
  totalItems: number;
  totalRows?: number;
  type: "progress";
}

export type BulkStreamMessage =
  | { jobId: string; type: "ready" }
  | BulkProgressMessage
  | { code?: string; jobId: string; message: string; type: "error" }
  /** The server stopped the stream; do not reopen it. */
  | {
      jobId: string;
      reason:
        | "budget_exceeded"
        | "lifetime_exceeded"
        | "backpressure"
        | "enqueue_failures"
        | "upstream_error"
        | "client_cancelled"
        /** The connection ended without a reason. */
        | "ended"
        | (string & Record<never, never>);
      type: "closed";
    };

const num = (value: unknown): number =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;

/** One stream frame as a message, or null for frames to skip. */
export function toStreamMessage(
  event: string,
  data: unknown,
  jobId: string
): BulkStreamMessage | null {
  const d = isObj(data) ? data : {};
  if (event === "ready") {
    return { type: "ready", jobId };
  }
  if (event === "kill" || event === "end") {
    return {
      type: "closed",
      jobId,
      reason: typeof d.reason === "string" ? d.reason : "upstream_error",
    };
  }
  if (d.type === "progress" || d.type === "error") {
    return d as unknown as BulkStreamMessage;
  }
  // A job snapshot, as the Sandbox sends: read it as progress.
  if (typeof d.status === "string" && "total_rows" in d) {
    const done = isFinalStatus(d.status);
    const total = num(d.total_rows);
    const processed = num(d.processed_items);
    return {
      type: "progress",
      jobId: typeof d.job_id === "string" ? d.job_id : jobId,
      status: d.status,
      isTerminal: done,
      processedItems: processed,
      totalItems: total,
      succeededItems: num(d.succeeded_items),
      failedItems: num(d.failed_items),
      progressPercent: done
        ? 100
        : Math.min(99, total ? Math.floor((processed / total) * 100) : 0),
    };
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/* Resource                                                                   */
/* -------------------------------------------------------------------------- */

interface Paging {
  maxItems?: number;
  pageSize?: number;
  signal?: AbortSignal;
}

/**
 * Bulk jobs: run one product over thousands of rows, then follow the job and
 * read its results. Credits are charged per row as it runs.
 */
export interface BulkResource {
  /**
   * Stops a job: pauses it, then marks it canceled. Rows already run stay
   * billed and readable.
   */
  cancel: (
    jobId: string,
    options?: RequestOptions
  ) => Promise<Result<BulkCanceled>>;
  /** Limits, routes and features of the bulk API. Free. */
  capabilities: (options?: RequestOptions) => Promise<Result<BulkCapabilities>>;
  /** Results as CSV: `row_index`, `status`, `input.*`, `output.*`, `error_message`, `credits_consumed`. */
  download: (
    jobId: string,
    options?: RequestOptions
  ) => Promise<Result<string>>;
  /** One page of failed rows, with the reason. */
  errors: (
    jobId: string,
    input?: Omit<BulkRowsInput, "status">,
    options?: RequestOptions
  ) => Promise<PageResult<BulkErrors, BulkFailedRow>>;
  /** The job's event log, newest first. Up to 2000. */
  events: (
    jobId: string,
    input?: { limit?: number },
    options?: RequestOptions
  ) => Promise<Result<BulkEvents>>;
  /** One job: status, counts, credits and links. */
  get: (jobId: string, options?: RequestOptions) => Promise<Result<BulkJob>>;
  /** Your jobs, newest first. */
  list: (
    input?: BulkListInput,
    options?: RequestOptions
  ) => Promise<PageResult<BulkJobList, BulkJobSummary>>;
  /**
   * Queues local business searches (keywords × cities) and charges for them
   * up front. Safe to retry: the same idempotency key returns the first job.
   */
  localLeads: (
    input: BulkLocalLeadsInput,
    options?: RequestOptions
  ) => Promise<Result<BulkLocalLeadsSubmission>>;
  /** Stops a running job after the rows in flight. Resume it later. */
  pause: (
    jobId: string,
    options?: RequestOptions
  ) => Promise<Result<BulkPaused>>;
  /** What `localLeads` would search and charge, without charging. */
  quoteLocalLeads: (
    input: BulkLocalLeadsInput,
    options?: RequestOptions
  ) => Promise<Result<BulkLocalLeadsQuote>>;
  /** Runs the job again: every row, failed rows only, or from a row or shard. */
  restart: (
    jobId: string,
    input?: BulkRestartInput,
    options?: RequestOptions
  ) => Promise<Result<BulkRestarted>>;
  /** One page of result rows. */
  results: (
    jobId: string,
    input?: BulkRowsInput,
    options?: RequestOptions
  ) => Promise<PageResult<BulkRows, BulkRow>>;
  /** Every result row, page by page. Reading results is free. */
  resultsAll: (
    jobId: string,
    input?: Pick<BulkRowsInput, "status">,
    options?: Paging
  ) => AsyncGenerator<BulkRow, void, undefined>;
  /** Continues a paused job. */
  resume: (
    jobId: string,
    options?: RequestOptions
  ) => Promise<Result<BulkResumed>>;
  /** Moves the job up or down the queue: -1000 to 1000. */
  setPriority: (
    jobId: string,
    priority: number,
    options?: RequestOptions
  ) => Promise<Result<BulkPriority>>;
  /**
   * Live progress until the job ends, the server closes the stream, or
   * `signal` aborts. A `closed` message means the stream stopped before the
   * job did: use `wait` to follow it from there. Throws the `LeadMagicError`
   * if the stream cannot open.
   */
  stream: (
    jobId: string,
    options?: { signal?: AbortSignal }
  ) => AsyncGenerator<BulkStreamMessage, void, undefined>;
  /**
   * Starts a job. Not retried by default: the API does not de-duplicate
   * submissions, so a retry after a lost response could run (and bill) the
   * rows twice. After a `network_error` or `timeout`, check `list()` before
   * submitting again.
   */
  submit: (
    input: BulkSubmitInput,
    options?: RequestOptions
  ) => Promise<Result<BulkSubmission>>;
  /** How the API reads a submission: columns, mapping, preview and warnings. Free. */
  validate: (
    input: BulkSubmitInput,
    options?: RequestOptions
  ) => Promise<Result<BulkValidation>>;
  /**
   * Polls until the job is `completed`, `failed` or `canceled`, and returns
   * it. A `timeout` error means the job is still running, not that it failed.
   */
  wait: (jobId: string, options?: BulkWaitOptions) => Promise<Result<BulkJob>>;
}

const MAX_SUBMIT_ROWS = 250_000;
const MAX_ROWS_PAGE = 1000;
const DEFAULT_ROWS_PAGE = 200;
const MAX_JOBS_PAGE = 200;
const DEFAULT_JOBS_PAGE = 50;
const MAX_EVENTS = 2000;
const PRIORITY_LIMIT = 1000;
const MAX_KEYWORDS = 25;
const MAX_CITIES = 100;
const MAX_SEARCHES = 100;
const DEFAULT_POLL_MS = 2000;
const MIN_POLL_MS = 500;
const DEFAULT_WAIT_MS = 30 * 60 * 1000;
const RESTART_MODES = new Set<string>([
  "full",
  "failed_only",
  "unstick",
  "from_row",
  "from_shard",
]);

type Problem = { message: string; param: string[] } | null;

const HTTPS = /^https:\/\//u;

/** The non-blank entries of a list, whatever the caller passed. */
const filled = (value: unknown): unknown[] =>
  Array.isArray(value) ? value.filter(nonEmpty) : [];

function hasSource(value: unknown): boolean {
  return Array.isArray(value)
    ? value.length > 0
    : typeof value === "string" && value.trim() !== "";
}

function isPriority(value: unknown): boolean {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    Math.abs(value) <= PRIORITY_LIMIT
  );
}

/** Why a submission cannot be sent, or null. Shared with the Zod schemas. */
export function checkSubmission(input: BulkSubmitInput): Problem {
  const loose = input as { csv?: unknown; fileUrl?: unknown; rows?: unknown };
  if (!nonEmpty(input.product)) {
    return { message: "Pass the product to run.", param: ["product"] };
  }
  if (input.product.trim() === "local_leads_finder") {
    return {
      message: "Use bulk.localLeads for local business searches.",
      param: ["product"],
    };
  }
  const given = [loose.rows, loose.csv, loose.fileUrl].filter(hasSource);
  if (given.length !== 1) {
    return {
      message: "Pass exactly one of rows, csv or fileUrl.",
      param: ["rows", "csv", "fileUrl"],
    };
  }
  if (Array.isArray(loose.rows) && loose.rows.length > MAX_SUBMIT_ROWS) {
    return {
      message: "Submit at most 250,000 rows per job.",
      param: ["rows"],
    };
  }
  if (typeof loose.fileUrl === "string" && !HTTPS.test(loose.fileUrl)) {
    return { message: "fileUrl must be an https:// URL.", param: ["fileUrl"] };
  }
  if (input.priority !== undefined && !isPriority(input.priority)) {
    return {
      message: "priority must be a whole number from -1000 to 1000.",
      param: ["priority"],
    };
  }
  if (input.callback && !HTTPS.test(String(input.callback.url))) {
    return {
      message: "callback.url must be an https:// URL.",
      param: ["callback.url"],
    };
  }
  return null;
}

/** Why a local leads search cannot be sent, or null. Shared with the Zod schemas. */
export function checkLocalLeads(input: BulkLocalLeadsInput): Problem {
  const keywords = filled(input.keywords);
  const cities = filled(input.cities);
  if (keywords.length === 0 || keywords.length > MAX_KEYWORDS) {
    return { message: "Pass 1 to 25 keywords.", param: ["keywords"] };
  }
  if (cities.length === 0 || cities.length > MAX_CITIES) {
    return { message: "Pass 1 to 100 cities or ZIP codes.", param: ["cities"] };
  }
  if (keywords.length * cities.length > MAX_SEARCHES) {
    return {
      message: "keywords × cities must be at most 100 searches. Split the job.",
      param: ["keywords", "cities"],
    };
  }
  return null;
}

function submitBody(input: BulkSubmitInput) {
  const callback = input.callback
    ? compact({
        ...input.callback,
        events: input.callback.events ?? ["completed"],
      })
    : undefined;
  return compact({ ...input, callback });
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

/** The next offset when the page came back full, else null. */
const nextOffset = (rows: unknown, limit: number, offset: number) =>
  Array.isArray(rows) && rows.length >= limit ? offset + rows.length : null;

const clamp = (value: number | undefined, fallback: number, max: number) =>
  Math.min(max, Math.max(1, Math.floor(value ?? fallback)));

function randomKey(): string {
  const c = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  return (
    c?.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
  );
}

/** A 200 that says the action did not happen, as an error. */
function refused<T>(
  result: Result<T>,
  flag: string,
  code: string,
  message: string
): Result<T> {
  if (
    result.error ||
    (result.data as Record<string, unknown>)[flag] !== false
  ) {
    return result;
  }
  return {
    data: null,
    error: new LeadMagicError({
      code,
      kind: "conflict",
      status: result.meta.status,
      message,
      requestId: result.meta.requestId,
    }),
    meta: result.meta,
  };
}

export function createBulk(config: TransportConfig): BulkResource {
  const job = (jobId: string) => `/bulk/jobs/${segment(jobId.trim())}`;
  const missingId = <T>(jobId: string): Result<T> | null =>
    typeof jobId === "string" && jobId.trim()
      ? null
      : invalidInput<T>(config, "Pass the job id.", ["jobId"]);
  const refuse = <T>(problem: NonNullable<Problem>) =>
    Promise.resolve(invalidInput<T>(config, problem.message, problem.param));

  /** A call on one job, refused locally when the id is blank. */
  const onJob = <T>(
    jobId: string,
    call: () => Promise<Result<T>>
  ): Promise<Result<T>> => {
    const missing = missingId<T>(jobId);
    return missing ? Promise.resolve(missing) : call();
  };

  const get: BulkResource["get"] = (jobId, options) =>
    onJob(jobId, () =>
      send<BulkJob>(config, { method: "GET", path: job(jobId) }, options)
    );

  const pause: BulkResource["pause"] = (jobId, options) =>
    onJob(jobId, async () =>
      refused(
        await send<BulkPaused>(
          config,
          { method: "POST", path: `${job(jobId)}/pause` },
          options
        ),
        "paused",
        "job_not_pausable",
        "The job is not running, so it was not paused."
      )
    );

  const results: BulkResource["results"] = async (jobId, given, options) => {
    const input = given ?? {};
    if (missingId(jobId)) {
      return invalidPage(config, "Pass the job id.", ["jobId"]);
    }
    const limit = clamp(input.limit, DEFAULT_ROWS_PAGE, MAX_ROWS_PAGE);
    const offset = Math.max(0, input.offset ?? 0);
    const result = await send<BulkRows>(
      config,
      {
        method: "GET",
        path: `${job(jobId)}/results`,
        query: { limit, offset, status: input.status },
      },
      options
    );
    return paged(result, {
      items: (data) => data.rows,
      nextOffset: (data) => nextOffset(data.rows, limit, offset),
    });
  };

  const wait: BulkResource["wait"] = async (jobId, options = {}) => {
    const interval = Math.max(
      MIN_POLL_MS,
      options.pollIntervalMs ?? DEFAULT_POLL_MS
    );
    const deadline = Date.now() + (options.timeoutMs ?? DEFAULT_WAIT_MS);
    for (let polls = 1; ; polls += 1) {
      // biome-ignore lint/performance/noAwaitInLoops: polling reads one status at a time.
      const result = await get(jobId, { signal: options.signal });
      if (result.error) {
        return result;
      }
      options.onProgress?.(result.data);
      if (isFinalStatus(result.data.status)) {
        return result;
      }
      let stop: LeadMagicError | null = null;
      if (options.signal?.aborted) {
        stop = clientError("network_error", "The request was cancelled.");
      } else if (Date.now() + interval > deadline) {
        stop = clientError(
          "timeout",
          `Job ${jobId} is still ${result.data.status} after ${polls} checks. Call wait again or check it later.`,
          { context: { job_id: jobId, status: result.data.status } }
        );
      }
      if (stop) {
        return { data: null, error: stop, meta: result.meta };
      }
      await sleep(interval, options.signal);
    }
  };

  const localLeads =
    (dryRun: boolean) =>
    (input: BulkLocalLeadsInput, options: RequestOptions = {}) => {
      const problem = checkLocalLeads(input);
      if (problem) {
        return refuse<never>(problem);
      }
      // The API de-duplicates by the key in the body; send the same one as the header.
      const idempotencyKey = dryRun
        ? undefined
        : (options.idempotencyKey ?? randomKey());
      return send(
        config,
        {
          method: "POST",
          path: "/bulk/local-leads",
          body: compact({
            ...input,
            dryRun: dryRun || undefined,
            idempotencyKey,
          }),
        },
        { ...options, idempotencyKey }
      );
    };

  return {
    submit: (input, options = {}) => {
      const problem = checkSubmission(input);
      return problem
        ? refuse(problem)
        : send(
            config,
            { method: "POST", path: "/bulk/submit", body: submitBody(input) },
            { maxRetries: 0, ...options }
          );
    },
    validate: (input, options) => {
      const problem = checkSubmission(input);
      return problem
        ? refuse(problem)
        : send(
            config,
            { method: "POST", path: "/bulk/validate", body: submitBody(input) },
            options
          );
    },
    localLeads: localLeads(false) as BulkResource["localLeads"],
    quoteLocalLeads: localLeads(true) as BulkResource["quoteLocalLeads"],
    list: async (given, options) => {
      const input = given ?? {};
      const limit = clamp(input.limit, DEFAULT_JOBS_PAGE, MAX_JOBS_PAGE);
      const offset = Math.max(0, input.offset ?? 0);
      const result = await send<BulkJobList>(
        config,
        {
          method: "GET",
          path: "/bulk/jobs",
          query: {
            limit,
            offset,
            status: input.status,
            product: input.product,
          },
        },
        options
      );
      return paged(result, {
        items: (data) => data.jobs,
        nextOffset: (data) => nextOffset(data.jobs, limit, offset),
      });
    },
    get,
    results,
    resultsAll(jobId, input = {}, options = {}) {
      return iterateOffset<BulkRow>(
        (offset, limit, signal) =>
          results(jobId, { ...input, offset, limit }, { signal }),
        options,
        MAX_ROWS_PAGE
      );
    },
    errors: async (jobId, given, options) => {
      const input = given ?? {};
      if (missingId(jobId)) {
        return invalidPage(config, "Pass the job id.", ["jobId"]);
      }
      const limit = clamp(input.limit, DEFAULT_ROWS_PAGE, MAX_ROWS_PAGE);
      const offset = Math.max(0, input.offset ?? 0);
      const result = await send<BulkErrors>(
        config,
        {
          method: "GET",
          path: `${job(jobId)}/errors`,
          query: { limit, offset },
        },
        options
      );
      return paged(result, {
        items: (data) => data.rows,
        nextOffset: (data) => nextOffset(data.rows, limit, offset),
      });
    },
    events: (jobId, input, options) =>
      onJob(jobId, () =>
        send<BulkEvents>(
          config,
          {
            method: "GET",
            path: `${job(jobId)}/events`,
            query: {
              limit:
                input?.limit === undefined
                  ? undefined
                  : clamp(input.limit, input.limit, MAX_EVENTS),
            },
          },
          options
        )
      ),
    download: (jobId, options) =>
      onJob(jobId, () =>
        send<string>(
          config,
          {
            method: "GET",
            path: `${job(jobId)}/download`,
            responseType: "text",
          },
          options
        )
      ),
    pause,
    resume: (jobId, options) =>
      onJob(jobId, async () =>
        refused(
          await send<BulkResumed>(
            config,
            { method: "POST", path: `${job(jobId)}/resume` },
            options
          ),
          "resumed",
          "job_not_resumable",
          "The job is not paused, so it was not resumed."
        )
      ),
    cancel: (jobId, options) =>
      onJob(jobId, async () => {
        // Rejecting alone only relabels the job; pausing first stops the rows.
        const paused = await pause(jobId, options);
        if (paused.error && paused.error.code !== "job_not_pausable") {
          return paused as Result<never>;
        }
        return send<BulkCanceled>(
          config,
          {
            method: "POST",
            path: `${job(jobId)}/review`,
            body: { action: "reject" },
          },
          { ...options, idempotencyKey: undefined }
        );
      }),
    restart: (jobId, given, options) => {
      const input = given ?? {};
      if (input.mode && !RESTART_MODES.has(input.mode)) {
        return refuse({
          message:
            "mode must be full, failed_only, unstick, from_row or from_shard.",
          param: ["mode"],
        });
      }
      if (input.mode === "from_row" && input.startRowIndex === undefined) {
        return refuse({
          message: "Pass startRowIndex with mode from_row.",
          param: ["startRowIndex"],
        });
      }
      if (input.mode === "from_shard" && input.startShardIndex === undefined) {
        return refuse({
          message: "Pass startShardIndex with mode from_shard.",
          param: ["startShardIndex"],
        });
      }
      return onJob(jobId, async () => {
        const result = await send<BulkRestarted>(
          config,
          {
            method: "POST",
            path: `${job(jobId)}/restart`,
            body: compact({ ...input }),
          },
          options
        );
        // A refused restart is a 409 with the reason and no error code.
        if (result.error?.status === 409 && result.error.code === "http_409") {
          return {
            data: null,
            meta: result.meta,
            error: new LeadMagicError({
              code: "job_not_restartable",
              kind: "conflict",
              status: 409,
              message: result.error.message,
              requestId: result.error.requestId,
            }),
          };
        }
        return result;
      });
    },
    setPriority: (jobId, priority, options) =>
      isPriority(priority)
        ? onJob(jobId, () =>
            send<BulkPriority>(
              config,
              {
                method: "PATCH",
                path: `${job(jobId)}/priority`,
                body: { priority },
              },
              options
            )
          )
        : refuse({
            message: "priority must be a whole number from -1000 to 1000.",
            param: ["priority"],
          }),
    capabilities: (options) =>
      send(config, { method: "GET", path: "/bulk/capabilities" }, options),
    wait,
    async *stream(jobId, options = {}) {
      const missing = missingId(jobId);
      if (missing?.error) {
        throw missing.error;
      }
      const opened = await open(
        config,
        { method: "GET", path: `${job(jobId)}/stream` },
        { signal: options.signal }
      );
      if (opened.error) {
        throw opened.error;
      }
      const body = opened.response.body as ReadableStream<Uint8Array>;
      try {
        for await (const frame of readEvents(body)) {
          const message = toStreamMessage(frame.event, frame.data, jobId);
          if (!message) {
            continue;
          }
          yield message;
          // The server keeps the stream open after the job ends.
          if (
            message.type === "closed" ||
            (message.type === "progress" && message.isTerminal)
          ) {
            return;
          }
        }
        // The server hung up without saying why: tell the caller to fall back to wait().
        yield { type: "closed", jobId, reason: "ended" };
      } catch {
        if (options.signal?.aborted) {
          return;
        }
        // biome-ignore lint/style/useErrorCause: the fetch error can quote the URL and headers; the message says what to do.
        throw clientError(
          "network_error",
          "The progress stream was interrupted. Call stream again or use wait."
        );
      }
    },
  };
}
