import type { operations } from "../generated/api";
import type { LeadMagicError } from "./errors";
import type { Result } from "./http";

/** An `operationId` from the API reference, e.g. `email-finder`. */
export type OperationId = keyof operations;

type Json<T> = T extends { content: { "application/json": infer B } }
  ? B
  : never;

type Success<R> = R extends { 200: infer X }
  ? X
  : R extends { 201: infer X }
    ? X
    : R extends { 202: infer X }
      ? X
      : never;

/** The documented success body of an operation, field names as on the wire. */
export type ApiResponse<Op extends OperationId> = Json<
  Success<operations[Op]["responses"]>
>;

/** The documented request body of an operation, field names as on the wire. */
export type ApiRequest<Op extends OperationId> = Json<
  NonNullable<operations[Op]["requestBody"]>
>;

/** The documented query parameters of an operation. */
export type ApiQuery<Op extends OperationId> = NonNullable<
  operations[Op]["parameters"]["query"]
>;

type Camel<S extends string> = S extends `${infer Head}_${infer Tail}`
  ? `${Head}${Capitalize<Camel<Tail>>}`
  : S;

/** Top-level keys converted from `snake_case` to `camelCase`. */
export type CamelKeys<T> = {
  [K in keyof T as K extends string ? Camel<K> : K]: T[K];
};

/** A lookup: `found` says whether the API returned what was asked for. */
export type LookupResult<T> =
  | { data: T; error: null; found: boolean; meta: Result<T>["meta"] }
  | {
      data: null;
      error: LeadMagicError;
      found: false;
      meta: Result<T>["meta"];
    };

export interface Page<Item> {
  /** True when another page exists. */
  hasMore: boolean;
  /** The rows on this page, whatever the endpoint calls them. */
  items: Item[];
  /** Pass to the next call as `cursor`; null on the last page or on offset-paged endpoints. */
  nextCursor: string | null;
  /** Offset-paged endpoints only: pass to the next call as `offset`; null on the last page. */
  nextOffset: number | null;
}

/** A list call: `page` reads the rows and cursor the same way for every endpoint. */
export type PageResult<T, Item> =
  | { data: T; error: null; meta: Result<T>["meta"]; page: Page<Item> }
  | {
      data: null;
      error: LeadMagicError;
      meta: Result<T>["meta"];
      page: null;
    };

export interface IterateOptions {
  /**
   * Stops after this many rows. Required because search is billed per row:
   * an iterator without a cap could spend a whole balance.
   */
  maxItems: number;
  /** Rows per request. Defaults to the endpoint's maximum page size. */
  pageSize?: number;
  signal?: AbortSignal;
}
