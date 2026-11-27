import { clientError } from "../core/errors";
import type { RequestOptions, Result, TransportConfig } from "../core/http";
import { invalidInput, send } from "../core/http";
import {
  compact,
  invalidPage,
  isObj,
  iterateOffset,
  nonEmpty,
  paged,
  segment,
} from "../core/shape";
import type { PageResult } from "../core/types";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

/** `running` until every item is done; then `succeeded`, `failed` or `partial`. */
export type BatchStatus =
  | "pending"
  | "running"
  | "succeeded"
  | "failed"
  | "partial"
  | (string & Record<never, never>);

/** Statuses a batch does not leave. */
export const BATCH_FINAL_STATUSES: readonly string[] = [
  "succeeded",
  "failed",
  "partial",
];

export interface BatchItemInput {
  /** Attributes this item to one of your clients. */
  clientId?: string;
  /** Attributes this item to a client by name, creating it if needed. */
  clientName?: string;
  /** The product's request body, field names as in the API reference. */
  input: Record<string, unknown>;
  /** Returned with the item's result. */
  metadata?: Record<string, unknown>;
  /** A product such as `email_finder` or `email-validation`. */
  product?: string;
  /** An external provider you registered: `ext:<providerId>`. Free. */
  provider?: `ext:${string}`;
}

export interface BatchSubmitInput {
  /** Attributes the batch to one of your clients. */
  clientId?: string;
  /** Attributes the batch to a client by name, creating it if needed. */
  clientName?: string;
  /** 1 to 500 items, each naming its product. Identical items are run once. */
  items: BatchItemInput[];
  /** Kept on the batch. `metadata.campaign` groups batches for `campaignMetrics`. */
  metadata?: Record<string, unknown>;
  /** `low` runs behind other work. Default `normal`. */
  priority?: "normal" | "low";
  /** Public HTTPS URL notified as items and the batch finish. */
  webhookUrl?: string;
}

export interface BatchSubmission {
  batchId: string;
  /** Always 0: items are charged one by one as they succeed. */
  creditsReserved: number;
  /** Identical items removed before running. */
  duplicatesRemoved: number;
  /** The most the batch can charge if every item succeeds. */
  estimatedMaxCredits: number;
  fundingMode: string;
  fundingNotice: string;
  /** Items that will run. */
  itemCount: number;
  originalItemCount: number;
  resultsUrl: string;
  statusUrl: string;
}

export interface Batch {
  batchId: string;
  clientId: string | null;
  completedAt: string | null;
  createdAt: string;
  creditsConsumed: number;
  error?: string | null;
  failedItems: number;
  metadata: Record<string, unknown> | null;
  priority: string | null;
  status: BatchStatus;
  succeededItems: number;
  totalItems: number;
  webhookStatus?: string | null;
  webhookUrl?: string | null;
}

export interface BatchList {
  batches: Batch[];
  limit: number;
  offset: number;
}

/** An item's status. `suppressed` items matched a suppression list and cost nothing. */
export type BatchItemStatus =
  | "pending"
  | "succeeded"
  | "failed"
  | "skipped"
  | "cached"
  | "suppressed"
  | "throttled"
  | (string & Record<never, never>);

export interface BatchItem {
  batchId: string;
  completedAt: string | null;
  createdAt: string;
  creditsConsumed: number | string | null;
  error: unknown;
  id: string;
  /** Position in the submitted `items`. */
  itemIndex: number;
  product: string | null;
  /** The product's response body. */
  result: Record<string, unknown> | null;
  status: BatchItemStatus;
}

export interface BatchItems {
  items: BatchItem[];
  limit: number;
  offset: number;
}

export interface BatchUpdate {
  batchId: string;
  clientId: string | null;
  metadata: Record<string, unknown> | null;
  status: BatchStatus;
  updatedAt: string;
}

export interface CampaignMetrics {
  breakdownByClient: Record<string, unknown>[];
  breakdownByProduct: Record<string, unknown>[];
  campaignId: string;
  costPerBatch: number;
  creditsPerSuccess: number;
  dateRange: { earliest: string | null; latest: string | null };
  failedItems: number;
  succeededItems: number;
  /** Percent, 0 to 100. */
  successRate: number;
  totalBatches: number;
  totalCreditsConsumed: number;
  totalItems: number;
}

export interface CostPreview {
  clientCreditRemaining: string | null;
  creditsPerItem: number | null;
  estimatedCostUsd: number;
  perProduct: {
    credits: number;
    creditsPerItem: number;
    items: number;
    product: string;
  }[];
  totalCredits: number;
  totalItems: number;
  /** True when a budget would stop this batch at submit. */
  willExceedBudget: boolean;
}

export interface BatchClient {
  address: Record<string, unknown> | null;
  /** True when created from `clientName` on a submission. */
  autoGenerated: boolean;
  billingRate: string | null;
  clientId: string;
  contactEmail: string | null;
  createdAt: string;
  customFields: Record<string, unknown> | null;
  displayName: string | null;
  industry: string | null;
  name: string;
  notes: string | null;
  phone: string | null;
  updatedAt: string;
  website: string | null;
}

export interface BatchClientInput {
  address?: Record<string, unknown>;
  /** Your rate for this client, for reporting. */
  billingRate?: number;
  contactEmail?: string;
  customFields?: Record<string, unknown>;
  displayName?: string;
  industry?: string;
  name: string;
  notes?: string;
  phone?: string;
  website?: string;
}

export interface BatchClientList {
  clients: BatchClient[];
  limit: number;
  offset: number;
}

export interface BatchClientMetrics {
  clientId: string;
  failedItems: number;
  succeededItems: number;
  successRate: number;
  totalBatches: number;
  totalCreditsConsumed: number;
  totalItems: number;
}

export interface BatchClientWebhook {
  client_id: string;
  created_at: string;
  event_types: string[] | null;
  id: string;
  is_active: boolean;
  /** Signs deliveries to this webhook. Keep it secret. */
  secret: string;
  updated_at: string;
  url: string;
}

export interface BatchProviderInput {
  /** Header or parameter name for the credential, e.g. `Authorization`. */
  authCredentialName: string;
  authCredentialValue: string;
  authType: "api_key" | "bearer" | "header";
  /** Public HTTPS base URL. */
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  defaultMethod?: "GET" | "POST";
  healthCheckExpectedStatus?: number;
  healthCheckUrl?: string;
  name: string;
  rateLimitRpm?: number;
  responseMapping?: Record<string, unknown>;
}

export interface BatchProvider
  extends Omit<BatchProviderInput, "authCredentialValue"> {
  /** Always `[REDACTED]`. */
  authCredentialValue: string;
  createdAt: string;
  providerId: string;
  updatedAt: string;
}

export interface ListInput {
  /** Up to 200. Default 50. */
  limit?: number;
  offset?: number;
}

export interface BatchListInput extends ListInput {
  clientId?: string;
  status?: BatchStatus;
}

export interface BatchItemsInput {
  /** Up to 200. Default 50. */
  limit?: number;
  offset?: number;
  status?: BatchItemStatus;
}

export interface BatchWaitOptions {
  onProgress?: (batch: Batch) => void;
  /** Time between status reads. Default 2000 ms, at least 500. */
  pollIntervalMs?: number;
  signal?: AbortSignal;
  /** Gives up after this long. Default 30 minutes. */
  timeoutMs?: number;
}

interface Paging {
  maxItems?: number;
  pageSize?: number;
  signal?: AbortSignal;
}

/**
 * Batches: up to 500 calls to any mix of products in one request, run in the
 * background. Each item is charged as it succeeds.
 */
export interface BatchResource {
  /** Totals for batches whose `metadata.campaign` is this id. */
  campaignMetrics: (
    campaignId: string,
    options?: RequestOptions
  ) => Promise<Result<CampaignMetrics>>;
  /** Your end clients, for attribution, budgets and reporting. */
  clients: {
    create: (
      input: BatchClientInput,
      options?: RequestOptions
    ) => Promise<Result<BatchClient>>;
    list: (
      input?: ListInput,
      options?: RequestOptions
    ) => Promise<PageResult<BatchClientList, BatchClient>>;
    metrics: (
      clientId: string,
      options?: RequestOptions
    ) => Promise<Result<BatchClientMetrics>>;
    webhooks: (
      clientId: string,
      options?: RequestOptions
    ) => Promise<Result<BatchClientWebhook[]>>;
  };
  /** One batch: status and counts. */
  get: (batchId: string, options?: RequestOptions) => Promise<Result<Batch>>;
  /** Your batches, newest first. */
  list: (
    input?: BatchListInput,
    options?: RequestOptions
  ) => Promise<PageResult<BatchList, Batch>>;
  /** What a batch would cost, and whether a budget would stop it. Free. */
  previewCost: (
    input: Pick<BatchSubmitInput, "items" | "clientId" | "clientName">,
    options?: RequestOptions
  ) => Promise<Result<CostPreview>>;
  /** External APIs you can call as batch items with `provider: "ext:<id>"`. */
  providers: {
    create: (
      input: BatchProviderInput,
      options?: RequestOptions
    ) => Promise<Result<BatchProvider>>;
    list: (options?: RequestOptions) => Promise<Result<BatchProvider[]>>;
  };
  /** One page of item results. */
  results: (
    batchId: string,
    input?: BatchItemsInput,
    options?: RequestOptions
  ) => Promise<PageResult<BatchItems, BatchItem>>;
  /** Every item result, page by page. Free. */
  resultsAll: (
    batchId: string,
    input?: Pick<BatchItemsInput, "status">,
    options?: Paging
  ) => AsyncGenerator<BatchItem, void, undefined>;
  /**
   * Queues the items and returns at once. Safe to retry: the client sends one
   * idempotency key for every attempt.
   */
  submit: (
    input: BatchSubmitInput,
    options?: RequestOptions
  ) => Promise<Result<BatchSubmission>>;
  /** Replaces the batch's metadata or moves it to another client. */
  update: (
    batchId: string,
    input: { clientId?: string; metadata?: Record<string, unknown> },
    options?: RequestOptions
  ) => Promise<Result<BatchUpdate>>;
  /**
   * Polls until the batch is `succeeded`, `failed` or `partial`. A `timeout`
   * error means it is still running.
   */
  wait: (batchId: string, options?: BatchWaitOptions) => Promise<Result<Batch>>;
}

const MAX_ITEMS = 500;
const MAX_PREVIEW_ITEMS = 10_000;
/** The gateway rejects bodies over 1 MiB. */
const MAX_BODY_BYTES = 1024 * 1024;
const MAX_PAGE = 200;
const DEFAULT_PAGE = 50;
const DEFAULT_POLL_MS = 2000;
const MIN_POLL_MS = 500;
const DEFAULT_WAIT_MS = 30 * 60 * 1000;
const HTTPS = /^https:\/\//u;

type Problem = { message: string; param: string[] } | null;

/** An object with an input object and a product or provider, whatever the caller passed. */
function isItem(value: unknown): boolean {
  if (!isObj(value)) {
    return false;
  }
  return (
    isObj(value.input) && (nonEmpty(value.product) || nonEmpty(value.provider))
  );
}

function itemProblem(items: unknown, max: number): Problem {
  if (!Array.isArray(items) || items.length === 0 || items.length > max) {
    return {
      message: `Pass 1 to ${max.toLocaleString("en-US")} items.`,
      param: ["items"],
    };
  }
  const bad = items.findIndex((item: unknown) => !isItem(item));
  if (bad !== -1) {
    return {
      message: `items[${bad}] needs a product (or provider) and an input object.`,
      param: [`items.${bad}`],
    };
  }
  return null;
}

/** Why a batch cannot be sent, or null. Shared with the Zod schemas. */
export function checkBatch(input: BatchSubmitInput): Problem {
  const items = itemProblem(input.items, MAX_ITEMS);
  if (items) {
    return items;
  }
  if (input.webhookUrl !== undefined && !HTTPS.test(input.webhookUrl)) {
    return {
      message: "webhookUrl must be an https:// URL.",
      param: ["webhookUrl"],
    };
  }
  return null;
}

const wireItem = (item: BatchItemInput) =>
  compact({
    product: item.product,
    provider: item.provider,
    input: item.input,
    client_id: item.clientId,
    client_name: item.clientName,
    metadata: item.metadata,
  });

function batchBody(input: Partial<BatchSubmitInput>) {
  return compact({
    items: input.items?.map(wireItem),
    client_id: input.clientId,
    client_name: input.clientName,
    metadata: input.metadata,
    webhook_url: input.webhookUrl,
    priority: input.priority,
  });
}

const clamp = (value: number | undefined, fallback: number, max: number) =>
  Math.min(max, Math.max(1, Math.floor(value ?? fallback)));

const nextOffset = (rows: unknown, limit: number, offset: number) =>
  Array.isArray(rows) && rows.length >= limit ? offset + rows.length : null;

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

export function createBatch(config: TransportConfig): BatchResource {
  const missing = <T>(id: unknown, name: string): Result<T> | null =>
    nonEmpty(id) ? null : invalidInput<T>(config, `Pass the ${name}.`, [name]);
  const onId = <T>(
    id: string,
    name: string,
    call: () => Promise<Result<T>>
  ): Promise<Result<T>> => {
    const refused = missing<T>(id, name);
    return refused ? Promise.resolve(refused) : call();
  };
  const path = (id: string) => `/v1/batch/${segment(id.trim())}`;

  const get: BatchResource["get"] = (batchId, options) =>
    onId(batchId, "batchId", () =>
      send<Batch>(config, { method: "GET", path: path(batchId) }, options)
    );

  const results: BatchResource["results"] = async (batchId, given, options) => {
    if (!nonEmpty(batchId)) {
      return invalidPage(config, "Pass the batchId.", ["batchId"]);
    }
    const input = given ?? {};
    const limit = clamp(input.limit, DEFAULT_PAGE, MAX_PAGE);
    const offset = Math.max(0, input.offset ?? 0);
    const result = await send<BatchItems>(
      config,
      {
        method: "GET",
        path: `${path(batchId)}/results`,
        query: { limit, offset, status: input.status },
      },
      options
    );
    return paged(result, {
      items: (data) => data.items,
      nextOffset: (data) => nextOffset(data.items, limit, offset),
    });
  };

  const wait: BatchResource["wait"] = async (batchId, options = {}) => {
    const interval = Math.max(
      MIN_POLL_MS,
      options.pollIntervalMs ?? DEFAULT_POLL_MS
    );
    const deadline = Date.now() + (options.timeoutMs ?? DEFAULT_WAIT_MS);
    for (let polls = 1; ; polls += 1) {
      // biome-ignore lint/performance/noAwaitInLoops: polling reads one status at a time.
      const result = await get(batchId, { signal: options.signal });
      if (result.error) {
        return result;
      }
      options.onProgress?.(result.data);
      if (BATCH_FINAL_STATUSES.includes(result.data.status)) {
        return result;
      }
      if (options.signal?.aborted) {
        return {
          data: null,
          error: clientError("network_error", "The request was cancelled."),
          meta: result.meta,
        };
      }
      if (Date.now() + interval > deadline) {
        return {
          data: null,
          error: clientError(
            "timeout",
            `Batch ${batchId} is still ${result.data.status} after ${polls} checks. Call wait again or check it later.`,
            { context: { batch_id: batchId, status: result.data.status } }
          ),
          meta: result.meta,
        };
      }
      await sleep(interval, options.signal);
    }
  };

  const pageOf = async <T extends Record<string, unknown>, Item>(
    route: string,
    key: string,
    given: (ListInput & Record<string, unknown>) | undefined,
    query: Record<string, string | undefined>,
    options: RequestOptions | undefined
  ): Promise<PageResult<T, Item>> => {
    const limit = clamp(given?.limit, DEFAULT_PAGE, MAX_PAGE);
    const offset = Math.max(0, given?.offset ?? 0);
    const result = await send<T>(
      config,
      { method: "GET", path: route, query: { limit, offset, ...query } },
      options
    );
    return paged(result, {
      items: (data) => data[key],
      nextOffset: (data) => nextOffset(data[key], limit, offset),
    });
  };

  return {
    submit: (input, options) => {
      const problem = checkBatch(input);
      if (problem) {
        return Promise.resolve(
          invalidInput(config, problem.message, problem.param)
        );
      }
      const body = batchBody(input);
      if (JSON.stringify(body).length > MAX_BODY_BYTES) {
        return Promise.resolve(
          invalidInput(
            config,
            "The batch is over 1 MB. Split it, or use bulk.submit for large files.",
            ["items"]
          )
        );
      }
      return send(config, { method: "POST", path: "/v1/batch", body }, options);
    },
    previewCost: (input, options) => {
      const problem = itemProblem(input.items, MAX_PREVIEW_ITEMS);
      return problem
        ? Promise.resolve(invalidInput(config, problem.message, problem.param))
        : send(
            config,
            {
              method: "POST",
              path: "/v1/batch/preview-cost",
              body: batchBody(input),
            },
            options
          );
    },
    list: (given, options) =>
      pageOf<BatchList & Record<string, unknown>, Batch>(
        "/v1/batch",
        "batches",
        given as ListInput & Record<string, unknown>,
        { status: given?.status, client_id: given?.clientId },
        options
      ) as Promise<PageResult<BatchList, Batch>>,
    get,
    results,
    resultsAll(batchId, input = {}, options = {}) {
      return iterateOffset<BatchItem>(
        (offset, limit, signal) =>
          results(batchId, { ...input, offset, limit }, { signal }),
        options,
        MAX_PAGE
      );
    },
    wait,
    update: (batchId, input, options) => {
      if (!(input.metadata || nonEmpty(input.clientId))) {
        return Promise.resolve(
          invalidInput(config, "Pass metadata or clientId.", [
            "metadata",
            "clientId",
          ])
        );
      }
      // The product segment of this route is not used; any value reaches the batch.
      return onId(batchId, "batchId", () =>
        send<BatchUpdate>(
          config,
          {
            method: "PATCH",
            path: `/v1/mixed/batch/${segment(batchId.trim())}`,
            body: compact({
              metadata: input.metadata,
              client_id: input.clientId,
            }),
          },
          options
        )
      );
    },
    campaignMetrics: (campaignId, options) =>
      onId(campaignId, "campaignId", () =>
        send<CampaignMetrics>(
          config,
          {
            method: "GET",
            path: `/v1/batch/campaign/${segment(campaignId.trim())}/metrics`,
          },
          options
        )
      ),
    clients: {
      create: (input, options) =>
        nonEmpty(input.name)
          ? send(
              config,
              {
                method: "POST",
                path: "/v1/batch/clients",
                body: compact({
                  name: input.name,
                  display_name: input.displayName,
                  contact_email: input.contactEmail,
                  billing_rate: input.billingRate,
                  notes: input.notes,
                  industry: input.industry,
                  website: input.website,
                  phone: input.phone,
                  address: input.address,
                  custom_fields: input.customFields,
                }),
              },
              options
            )
          : Promise.resolve(
              invalidInput(config, "Pass the client's name.", ["name"])
            ),
      list: (given, options) =>
        pageOf<BatchClientList & Record<string, unknown>, BatchClient>(
          "/v1/batch/clients",
          "clients",
          given as ListInput & Record<string, unknown>,
          {},
          options
        ) as Promise<PageResult<BatchClientList, BatchClient>>,
      metrics: (clientId, options) =>
        onId(clientId, "clientId", () =>
          send<BatchClientMetrics>(
            config,
            {
              method: "GET",
              path: `/v1/batch/clients/${segment(clientId.trim())}/metrics`,
            },
            options
          )
        ),
      webhooks: (clientId, options) =>
        onId(clientId, "clientId", () =>
          send<BatchClientWebhook[]>(
            config,
            {
              method: "GET",
              path: `/v1/batch/clients/${segment(clientId.trim())}/webhooks`,
            },
            options
          )
        ),
    },
    providers: {
      list: (options) =>
        send(config, { method: "GET", path: "/v1/batch/providers" }, options),
      create: (input, options) =>
        HTTPS.test(String(input.baseUrl))
          ? send(
              config,
              {
                method: "POST",
                path: "/v1/batch/providers",
                body: compact({ ...input }),
              },
              options
            )
          : Promise.resolve(
              invalidInput(config, "baseUrl must be an https:// URL.", [
                "baseUrl",
              ])
            ),
    },
  };
}
