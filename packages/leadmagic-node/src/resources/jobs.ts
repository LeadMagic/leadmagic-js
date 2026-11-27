import type { RequestOptions, Result, TransportConfig } from "../core/http";
import { send } from "../core/http";
import { compact, isObj, iterate, paged, snakeKeys } from "../core/shape";
import type {
  ApiQuery,
  ApiRequest,
  ApiResponse,
  CamelKeys,
  IterateOptions,
  PageResult,
} from "../core/types";

export type JobSearchResult = ApiResponse<"job-search">;
export type JobSignal = NonNullable<JobSearchResult["signals"]>[number];
/** Job search filters. The API takes these in camelCase already. */
export type SearchJobsInput = ApiRequest<"job-search">;
export type ExportJobsInput = ApiRequest<"job-search-export">;
export type ResolveJobFiltersInput = ApiRequest<"job-search-resolve">;
export type SearchStatsInput = ApiRequest<"search-stats-v3">;

/** The API reference does not describe these bodies yet. */
export type JsonObject = Record<string, unknown>;

export type CatalogEntry = ApiResponse<"job-country">[number];

export interface JobLookupResource {
  /** Every lookup catalog in one call. */
  catalogs: (options?: RequestOptions) => Promise<Result<JsonObject>>;
  companies: (
    input?: CamelKeys<ApiQuery<"job-search-companies">>,
    options?: RequestOptions
  ) => Promise<Result<JsonObject>>;
  locations: (
    input?: CamelKeys<ApiQuery<"job-search-locations">>,
    options?: RequestOptions
  ) => Promise<Result<JsonObject>>;
  occupations: (
    input?: CamelKeys<ApiQuery<"job-search-occupation-taxonomy">>,
    options?: RequestOptions
  ) => Promise<Result<JsonObject>>;
  roles: (
    input?: CamelKeys<ApiQuery<"job-search-roles">>,
    options?: RequestOptions
  ) => Promise<Result<JsonObject>>;
  tags: (
    input?: CamelKeys<ApiQuery<"job-search-tags">>,
    options?: RequestOptions
  ) => Promise<Result<JsonObject>>;
  titles: (
    input?: CamelKeys<ApiQuery<"job-search-titles">>,
    options?: RequestOptions
  ) => Promise<Result<JsonObject>>;
}

/** Id lists for the job search filters. Free. */
export interface JobCatalogResource {
  companyTypes: (options?: RequestOptions) => Promise<Result<CatalogEntry[]>>;
  countries: (options?: RequestOptions) => Promise<Result<CatalogEntry[]>>;
  industries: (options?: RequestOptions) => Promise<Result<CatalogEntry[]>>;
  jobTypes: (options?: RequestOptions) => Promise<Result<CatalogEntry[]>>;
  regions: (options?: RequestOptions) => Promise<Result<CatalogEntry[]>>;
}

export interface JobsResource {
  /** The `/v1/jobs` id catalogs: countries, regions, job and company types, industries. Free. */
  catalog: JobCatalogResource;
  /** Up to `limit` jobs in one response, for exports. 1 credit per job. */
  export: (
    input: ExportJobsInput,
    options?: RequestOptions
  ) => Promise<Result<JsonObject>>;
  /** Free-text lookups for titles, companies, locations and tags. Free. */
  lookup: JobLookupResource;
  /** Turn names into the ids that search filters take. Free. */
  resolveFilters: (
    input: ResolveJobFiltersInput,
    options?: RequestOptions
  ) => Promise<Result<JsonObject>>;
  /** One page of job postings. 1 credit per job returned. */
  search: (
    input: SearchJobsInput,
    options?: RequestOptions
  ) => Promise<PageResult<JobSearchResult, JobSignal>>;
  /** Every matching job, page by page, up to `maxItems`. Throws on the first failed page. */
  searchAll: (
    input: Omit<SearchJobsInput, "cursor" | "limit">,
    options: IterateOptions
  ) => AsyncGenerator<JobSignal, void, undefined>;
  /** Result counts for a search across products, without running it. Free. */
  searchStats: (
    input: SearchStatsInput,
    options?: RequestOptions
  ) => Promise<Result<JsonObject>>;
  /** Size and freshness of the job dataset. Free. */
  stats: (options?: RequestOptions) => Promise<Result<JsonObject>>;
}

const MAX_PAGE = 50;

export function createJobs(config: TransportConfig): JobsResource {
  const get =
    <T>(path: string) =>
    (options?: RequestOptions): Promise<Result<T>> =>
      send<T>(config, { method: "GET", path }, options);
  const getWith =
    (path: string) =>
    (
      input: Record<string, unknown> = {},
      options?: RequestOptions
    ): Promise<Result<JsonObject>> =>
      send<JsonObject>(
        config,
        {
          method: "GET",
          path,
          query: snakeKeys(compact(input)) as Record<string, string>,
        },
        options
      );
  const post =
    <I extends object>(path: string) =>
    (input: I, options?: RequestOptions): Promise<Result<JsonObject>> =>
      send<JsonObject>(
        config,
        {
          method: "POST",
          path,
          body: compact({ ...(input as Record<string, unknown>) }),
        },
        options
      );

  const search: JobsResource["search"] = async (input, options) => {
    const result = await send<JobSearchResult>(
      config,
      { method: "POST", path: "/v3/jobs/search", body: compact({ ...input }) },
      options
    );
    return paged(result, {
      items: (data) => data.signals,
      cursor: (data) =>
        (isObj(data.pagination) ? data.pagination.next_cursor : undefined) ??
        data.next_cursor,
      hasMore: (data) =>
        (isObj(data.pagination) ? data.pagination.has_more : undefined) ??
        data.has_more,
    });
  };

  return {
    search,
    searchAll(input, options) {
      return iterate(
        (cursor, limit, signal) =>
          search({ ...input, cursor, limit }, signal ? { signal } : undefined),
        options,
        MAX_PAGE
      );
    },
    export: post<ExportJobsInput>("/v3/jobs/search/export"),
    resolveFilters: post<ResolveJobFiltersInput>("/v3/jobs/search/resolve"),
    searchStats: post<SearchStatsInput>("/v3/search/stats"),
    stats: get<JsonObject>("/v3/jobs/search/stats"),
    lookup: {
      catalogs: get<JsonObject>("/v3/jobs/search/catalogs"),
      companies: getWith("/v3/jobs/search/companies"),
      titles: getWith("/v3/jobs/search/titles"),
      roles: getWith("/v3/jobs/search/roles"),
      tags: getWith("/v3/jobs/search/tags"),
      locations: getWith("/v3/jobs/search/locations"),
      occupations: getWith("/v3/jobs/search/occupation-taxonomy"),
    },
    catalog: {
      countries: get<CatalogEntry[]>("/v1/jobs/countries"),
      regions: get<CatalogEntry[]>("/v1/jobs/regions"),
      jobTypes: get<CatalogEntry[]>("/v1/jobs/job-types"),
      companyTypes: get<CatalogEntry[]>("/v1/jobs/company-types"),
      industries: get<CatalogEntry[]>("/v1/jobs/industries"),
    },
  };
}
