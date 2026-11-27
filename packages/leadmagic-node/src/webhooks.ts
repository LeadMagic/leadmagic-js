import type { BulkJobStatus } from "./resources/bulk";

export type BulkWebhookEvent =
  | "job.completed"
  | "job.failed"
  | "job.canceled"
  | "job.progress.25"
  | "job.progress.50"
  | "job.progress.75";

/** The body LeadMagic POSTs to a bulk job's `callback.url`. */
export interface BulkWebhook {
  delivery: {
    attempts: number;
    lastAttemptAt: string | null;
    lastError: string | null;
    lastResponseStatus: number | null;
    nextAttemptAt: string | null;
    status: string;
  };
  event: BulkWebhookEvent;
  /** The last 50 events of the job. */
  events: {
    created_at: string;
    event_type: string;
    message: string | null;
    payload: Record<string, unknown>;
  }[];
  jobId: string;
  links: Record<string, string>;
  /** `callback.metadata` from the submission. */
  metadata: Record<string, unknown> | null;
  /** Up to 250 rows when the job was submitted with `inlineResults`. */
  results: Record<string, unknown>[];
  submission: {
    endpoint: string | null;
    executionMode: string | null;
    priority: number | null;
    product: string | null;
  };
  summary: {
    completedAt: string | null;
    createdAt: string | null;
    failedItems: number;
    processedItems: number;
    skippedItems: number;
    startedAt: string | null;
    status: BulkJobStatus;
    succeededItems: number;
    totalCreditsConsumed: string | null;
    totalRows: number;
  };
  /** ISO 8601. */
  timestamp: string;
}

/** The body a batch client webhook receives when a batch ends. */
export interface BatchWebhook {
  batchId: string;
  clientId: string | null;
  completedAt: string | null;
  creditsConsumed: number;
  failedItems: number;
  metadata: Record<string, unknown> | null;
  status: string;
  succeededItems: number;
  totalItems: number;
}

export const WEBHOOK_SIGNATURE_HEADER = "x-leadmagic-signature";

type HeaderBag =
  | Pick<Headers, "get">
  | Record<string, string | string[] | undefined>;

export interface VerifyWebhookInput {
  /** The raw request body, exactly as received. Parsed JSON will not verify. */
  body: string | Uint8Array | ArrayBuffer;
  /** Request headers: a `Headers` object or Node's `req.headers`. */
  headers: HeaderBag;
  /** The `callback.secret` the job was submitted with. */
  secret: string;
}

const HEX = /^[0-9a-f]{64}$/u;
const SHA256_PREFIX = /^sha256=/u;
const encoder = new TextEncoder();

function header(headers: HeaderBag, name: string): string | undefined {
  if (typeof (headers as Headers).get === "function") {
    return (headers as Headers).get(name) ?? undefined;
  }
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === name) {
      return Array.isArray(value) ? value[0] : value;
    }
  }
}

function bytes(body: VerifyWebhookInput["body"]): Uint8Array {
  if (typeof body === "string") {
    return encoder.encode(body);
  }
  return body instanceof Uint8Array ? body : new Uint8Array(body);
}

function subtle(): SubtleCrypto {
  const c = (globalThis as { crypto?: Crypto }).crypto;
  if (!c?.subtle) {
    throw new TypeError("Web Crypto is not available. Use Node 20 or later.");
  }
  return c.subtle;
}

/**
 * The signature LeadMagic sends for `body`: lowercase hex HMAC-SHA256 keyed
 * with the trimmed secret. Useful for testing your webhook handler.
 */
export async function signWebhook(
  body: VerifyWebhookInput["body"],
  secret: string
): Promise<string> {
  const key = await subtle().importKey(
    "raw",
    encoder.encode(secret.trim()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = new Uint8Array(
    await subtle().sign("HMAC", key, bytes(body) as BufferSource)
  );
  return Array.from(mac, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Compares two strings in time that does not depend on where they differ. */
function same(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    // biome-ignore lint/suspicious/noBitwiseOperators: XOR keeps the comparison constant-time.
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Checks a webhook's `X-LeadMagic-Signature` and returns the parsed body:
 * a bulk job callback (`jobId`) or a batch client webhook (`batchId`). Null
 * when the signature is missing or wrong. Never throws for a bad request.
 *
 * The signature covers the body only, with no timestamp, so it does not stop
 * a captured request from being replayed. Use `jobId` and `event` to ignore
 * deliveries you have already handled.
 */
export async function verifyWebhook(
  input: VerifyWebhookInput
): Promise<BulkWebhook | BatchWebhook | null> {
  const secret = typeof input.secret === "string" ? input.secret.trim() : "";
  // Batch client webhooks prefix the hex with `sha256=`; bulk callbacks do not.
  const signature = header(input.headers, WEBHOOK_SIGNATURE_HEADER)
    ?.trim()
    .toLowerCase()
    .replace(SHA256_PREFIX, "");
  if (!(secret && signature && HEX.test(signature))) {
    return null;
  }
  const expected = await signWebhook(input.body, secret);
  if (!same(expected, signature)) {
    return null;
  }
  try {
    const text =
      typeof input.body === "string"
        ? input.body
        : new TextDecoder().decode(bytes(input.body));
    const parsed: unknown = JSON.parse(text);
    if (parsed && typeof parsed === "object") {
      if ("jobId" in parsed) {
        return parsed as BulkWebhook;
      }
      if ("batchId" in parsed) {
        return parsed as BatchWebhook;
      }
    }
    return null;
  } catch {
    return null;
  }
}
