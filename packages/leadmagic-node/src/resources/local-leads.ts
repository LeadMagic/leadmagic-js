import type { RequestOptions, Result, TransportConfig } from "../core/http";
import { send } from "../core/http";
import { compact, invalidPage, iterate, paged, snakeKeys } from "../core/shape";
import type {
  ApiQuery,
  ApiRequest,
  ApiResponse,
  CamelKeys,
  IterateOptions,
  PageResult,
} from "../core/types";

export type LocalLeadsResult = ApiResponse<"local-leads-search-v3">;
export type LocalLead = NonNullable<LocalLeadsResult["leads"]>[number];
export type LocalLeadCategoriesResult =
  ApiResponse<"local-leads-categories-v3">;

/**
 * Local business filters. Same fields as the API reference, in camelCase:
 * `regionCode`, `categoryContains`, `hasBusinessEmail`, `radiusM`, …
 */
export type SearchLocalLeadsInput = CamelKeys<
  ApiRequest<"local-leads-search-v3">
>;

export type LocalLeadCategoriesInput = CamelKeys<
  ApiQuery<"local-leads-categories-v3">
>;

export interface LocalLeadsResource {
  /** Business categories to search by. Free. */
  categories: (
    input?: LocalLeadCategoriesInput,
    options?: RequestOptions
  ) => Promise<Result<LocalLeadCategoriesResult>>;
  /** One page of local businesses. Billed per lead returned. */
  search: (
    input: SearchLocalLeadsInput,
    options?: RequestOptions
  ) => Promise<PageResult<LocalLeadsResult, LocalLead>>;
  /**
   * Every matching business, page by page, up to `maxItems`. Throws on the
   * first failed page. The API sets the page size, so the last page can
   * return (and bill) more rows than the iterator yields.
   */
  searchAll: (
    input: Omit<SearchLocalLeadsInput, "cursor">,
    options: Omit<IterateOptions, "pageSize">
  ) => AsyncGenerator<LocalLead, void, undefined>;
}

/** The page size is fixed by the API; the iterator just follows cursors. */
const PAGE_SIZE_UNBOUNDED = Number.MAX_SAFE_INTEGER;

export function createLocalLeads(config: TransportConfig): LocalLeadsResource {
  const search: LocalLeadsResource["search"] = async (input, options) => {
    const body = snakeKeys(compact({ ...input }));
    if (Object.keys(body).filter((key) => key !== "cursor").length === 0) {
      return invalidPage(
        config,
        "Pass at least one filter, such as country and category.",
        ["country", "category"]
      );
    }
    const result = await send<LocalLeadsResult>(
      config,
      { method: "POST", path: "/v3/local-leads/search", body },
      options
    );
    return paged(result, {
      items: (data) => data.leads,
      cursor: (data) => data.next_cursor,
      hasMore: (data) => data.has_more,
    });
  };

  return {
    search,
    searchAll(input, options) {
      return iterate(
        (cursor, _limit, signal) =>
          search({ ...input, cursor }, signal ? { signal } : undefined),
        options,
        PAGE_SIZE_UNBOUNDED
      );
    },
    categories: (input, options) =>
      send(
        config,
        {
          method: "GET",
          path: "/v3/local-leads/categories",
          query: snakeKeys(compact({ ...input })) as Record<string, string>,
        },
        options
      ),
  };
}
