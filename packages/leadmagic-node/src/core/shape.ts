import type { LeadMagicError } from "./errors";
import type { ResponseMeta, Result } from "./http";
import { invalidInput } from "./http";
import type { IterateOptions, LookupResult, Page, PageResult } from "./types";

type Obj = Record<string, unknown>;

export function isObj(value: unknown): value is Obj {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/** Trims strings and drops `undefined`, `null` and blank strings. */
export function compact<T extends Obj>(input: T): Obj {
  const out: Obj = {};
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined || value === null) {
      continue;
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed) {
        out[key] = trimmed;
      }
      continue;
    }
    out[key] = value;
  }
  return out;
}

const UPPER = /[A-Z]/gu;

/** `regionCode` → `region_code`, top level only. */
export function snakeKeys(input: Obj): Obj {
  const out: Obj = {};
  for (const [key, value] of Object.entries(input)) {
    out[key.replace(UPPER, (c) => `_${c.toLowerCase()}`)] = value;
  }
  return out;
}

export function nonEmpty(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === "string") {
    return value.trim() !== "";
  }
  return value !== null && value !== undefined;
}

/** Adds `found` to a result. Errors are never found. */
export function lookup<T>(
  result: Result<T>,
  isFound: (data: T) => boolean
): LookupResult<T> {
  if (result.error) {
    return { ...result, found: false };
  }
  return { ...result, found: isFound(result.data) };
}

export interface PageReader<T> {
  cursor?: (data: T) => unknown;
  hasMore?: (data: T) => unknown;
  items: (data: T) => unknown;
  /** For offset-paged endpoints: the offset of the next page, or null. */
  nextOffset?: (data: T) => number | null;
}

/** Adds `page` to a result, read the same way whatever the endpoint calls its fields. */
export function paged<T, Item>(
  result: Result<T>,
  reader: PageReader<T>
): PageResult<T, Item> {
  if (result.error) {
    return { ...result, page: null };
  }
  const items = reader.items(result.data);
  const cursor = reader.cursor?.(result.data);
  const nextCursor = typeof cursor === "string" && cursor ? cursor : null;
  const nextOffset = reader.nextOffset?.(result.data) ?? null;
  const more = reader.hasMore?.(result.data);
  const next = nextCursor !== null || nextOffset !== null;
  const page: Page<Item> = {
    items: Array.isArray(items) ? (items as Item[]) : [],
    nextCursor,
    nextOffset,
    hasMore: typeof more === "boolean" ? more && next : next,
  };
  return { ...result, page };
}

/**
 * Walks a cursor-paginated search row by row. Throws the `LeadMagicError` of
 * the first failed page, since an iterator has no other way to report it.
 */
export async function* iterate<Item>(
  fetchPage: (
    cursor: string | undefined,
    limit: number,
    signal: AbortSignal | undefined
  ) => Promise<PageResult<unknown, Item>>,
  options: IterateOptions,
  maxPageSize: number
): AsyncGenerator<Item, void, undefined> {
  const max = Math.max(0, Math.floor(options.maxItems));
  const size = Math.min(
    maxPageSize,
    Math.max(1, options.pageSize ?? maxPageSize)
  );
  let seen = 0;
  let cursor: string | undefined;
  while (seen < max) {
    // biome-ignore lint/performance/noAwaitInLoops: each page needs the previous cursor.
    const result = await fetchPage(
      cursor,
      Math.min(size, max - seen),
      options.signal
    );
    if (result.error) {
      throw result.error;
    }
    for (const item of result.page.items) {
      if (seen >= max) {
        return;
      }
      seen += 1;
      yield item;
    }
    if (!(result.page.hasMore && result.page.nextCursor)) {
      return;
    }
    cursor = result.page.nextCursor;
  }
}

/** Encodes one path segment. */
export function segment(value: string | number): string {
  return encodeURIComponent(String(value));
}

interface Failed {
  data: null;
  error: LeadMagicError;
  meta: ResponseMeta;
}

/** A lookup the SDK refuses before sending: nothing is billed. */
export function invalidLookup<T>(
  config: { sandbox: boolean },
  message: string,
  param: string[]
): LookupResult<T> {
  const result = invalidInput<T>(config, message, param);
  return { ...(result as Failed), found: false };
}

/** A list call the SDK refuses before sending: nothing is billed. */
export function invalidPage<T, Item>(
  config: { sandbox: boolean },
  message: string,
  param: string[]
): PageResult<T, Item> {
  const result = invalidInput<T>(config, message, param);
  return { ...(result as Failed), page: null };
}

/**
 * Walks an offset-paginated list row by row. Throws the `LeadMagicError` of
 * the first failed page.
 */
export async function* iterateOffset<Item>(
  fetchPage: (
    offset: number,
    limit: number,
    signal: AbortSignal | undefined
  ) => Promise<PageResult<unknown, Item>>,
  options: { maxItems?: number; pageSize?: number; signal?: AbortSignal },
  maxPageSize: number
): AsyncGenerator<Item, void, undefined> {
  const max =
    options.maxItems === undefined
      ? Number.POSITIVE_INFINITY
      : Math.max(0, Math.floor(options.maxItems));
  const size = Math.min(
    maxPageSize,
    Math.max(1, options.pageSize ?? maxPageSize)
  );
  let seen = 0;
  let offset = 0;
  while (seen < max) {
    // biome-ignore lint/performance/noAwaitInLoops: each page follows the previous one.
    const result = await fetchPage(
      offset,
      Math.min(size, max - seen),
      options.signal
    );
    if (result.error) {
      throw result.error;
    }
    for (const item of result.page.items) {
      if (seen >= max) {
        return;
      }
      seen += 1;
      yield item;
    }
    if (!(result.page.hasMore && result.page.nextOffset !== null)) {
      return;
    }
    offset = result.page.nextOffset;
  }
}
