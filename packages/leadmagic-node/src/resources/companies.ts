import type { RequestOptions, TransportConfig } from "../core/http";
import { send } from "../core/http";
import {
  compact,
  invalidLookup,
  invalidPage,
  isObj,
  iterate,
  lookup,
  nonEmpty,
  paged,
} from "../core/shape";
import type {
  ApiRequest,
  ApiResponse,
  IterateOptions,
  LookupResult,
  PageResult,
} from "../core/types";

export type CompanySearchResult = ApiResponse<"company-search-v3">;
export type Company = NonNullable<CompanySearchResult["companies"]>[number];
export type LookalikeResult = ApiResponse<"company-lookalike-v3">;
export type FundingResult = ApiResponse<"company-funding">;
export type CompetitorsResult = ApiResponse<"competitors-search">;
export type TechnographicsResult = ApiResponse<"technographics">;

type CompanySearchBody = ApiRequest<"company-search-v3">;
type LookalikeBody = ApiRequest<"company-lookalike-v3">;

export interface SearchCompaniesInput {
  /** Discovery criteria: headquarters, industry, headcount, revenue, … (API field names). */
  companyFilters?: CompanySearchBody["company_filters"];
  /** Next page: `page.nextCursor` from the previous call, with the same filters. */
  cursor?: string;
  /** Rows per page, at most 50. Each company costs 1 credit. Default 10. */
  limit?: number;
  /** Free-text description of the companies you want. */
  query?: string;
}

export interface CompanyInput {
  companyName?: string;
  /** Company domain or website, e.g. `stripe.com`. Preferred. */
  domain?: string;
  /** Company profile URL. */
  profileUrl?: string;
}

export interface LookalikesInput {
  companyFilters?: LookalikeBody["company_filters"];
  companyName?: string;
  /** Describe the kind of company instead of naming a seed. */
  description?: string;
  /** The seed company's domain. Preferred. */
  domain?: string;
  /** Rows per page, at most 100. Default 25. */
  limit?: number;
  /** Lookalike pages by offset (100, 200, …), up to 2000. */
  offset?: number;
}

export interface CompaniesResource {
  /** Competitors of a company. 5 credits when found. */
  competitors: (
    input: CompanyInput,
    options?: RequestOptions
  ) => Promise<LookupResult<CompetitorsResult>>;
  /**
   * One company by domain, name or profile URL. 1 credit when found.
   * The record is `data.companies[0]`.
   */
  find: (
    input: CompanyInput,
    options?: RequestOptions
  ) => Promise<LookupResult<CompanySearchResult>>;
  /** Funding rounds, investors and leadership. 4 credits when found. */
  funding: (
    input: Omit<CompanyInput, "profileUrl">,
    options?: RequestOptions
  ) => Promise<LookupResult<FundingResult>>;
  /** Companies like a seed company or description. 5 credits when any come back. */
  lookalikes: (
    input: LookalikesInput,
    options?: RequestOptions
  ) => Promise<PageResult<LookalikeResult, Company>>;
  /** One page of companies. 1 credit per company returned. */
  search: (
    input: SearchCompaniesInput,
    options?: RequestOptions
  ) => Promise<PageResult<CompanySearchResult, Company>>;
  /** Every matching company, page by page, up to `maxItems`. Throws on the first failed page. */
  searchAll: (
    input: Omit<SearchCompaniesInput, "cursor" | "limit">,
    options: IterateOptions
  ) => AsyncGenerator<Company, void, undefined>;
  /** The tools a company uses. 1 credit when found. */
  technographics: (
    input: { domain: string },
    options?: RequestOptions
  ) => Promise<LookupResult<TechnographicsResult>>;
}

const MAX_PAGE = 50;
const MAX_LOOKALIKE_PAGE = 100;
const MAX_LOOKALIKE_OFFSET = 2000;

function companyFrom(data: CompanySearchResult): unknown {
  const first = Array.isArray(data.companies) ? data.companies[0] : undefined;
  if (isObj(first)) {
    return first;
  }
  return isObj(data.company) ? data.company : undefined;
}

export function createCompanies(config: TransportConfig): CompaniesResource {
  const search: CompaniesResource["search"] = async (input, options) => {
    const body = compact({
      company_filters: input.companyFilters,
      query: input.query,
      limit: input.limit,
      cursor: input.cursor,
    });
    if (!(nonEmpty(body.company_filters) || nonEmpty(body.query))) {
      return invalidPage(config, "Pass companyFilters or a query.", [
        "companyFilters",
        "query",
      ]);
    }
    const result = await send<CompanySearchResult>(
      config,
      { method: "POST", path: "/v3/companies/search", body },
      options
    );
    return paged(result, {
      items: (data) => data.companies,
      cursor: (data) => data.next_cursor,
      hasMore: (data) => data.has_more,
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

    async find(input, options) {
      const body = compact({
        company_domain: input.domain,
        company_name: input.companyName,
        profile_url: input.profileUrl,
      });
      if (Object.keys(body).length === 0) {
        return invalidLookup(
          config,
          "Pass a domain, companyName or profileUrl.",
          ["domain", "companyName", "profileUrl"]
        );
      }
      const result = await send<CompanySearchResult>(
        config,
        { method: "POST", path: "/v3/companies/search", body },
        options
      );
      return lookup(result, (data) => companyFrom(data) !== undefined);
    },

    async lookalikes(input, options) {
      const body = compact({
        company_domain: input.domain,
        company_name: input.companyName,
        description: input.description,
        company_filters: input.companyFilters,
        limit: input.limit,
        offset: input.offset,
      });
      if (!(body.company_domain || body.company_name || body.description)) {
        return invalidPage(
          config,
          "Pass a seed domain, companyName or description.",
          ["domain", "companyName", "description"]
        );
      }
      const result = await send<LookalikeResult>(
        config,
        { method: "POST", path: "/v3/companies/lookalike", body },
        options
      );
      const limit = typeof body.limit === "number" ? body.limit : 25;
      const offset = typeof body.offset === "number" ? body.offset : 0;
      return paged(result, {
        items: (data) => data.companies,
        nextOffset: (data) => {
          const count = Array.isArray(data.companies)
            ? data.companies.length
            : 0;
          const next = offset + count;
          return count >= Math.min(limit, MAX_LOOKALIKE_PAGE) &&
            next < MAX_LOOKALIKE_OFFSET
            ? next
            : null;
        },
      });
    },

    async funding(input, options) {
      const body = compact({
        company_domain: input.domain,
        company_name: input.companyName,
      });
      if (Object.keys(body).length === 0) {
        return invalidLookup(config, "Pass a domain or companyName.", [
          "domain",
          "companyName",
        ]);
      }
      const result = await send<FundingResult>(
        config,
        { method: "POST", path: "/v1/companies/company-funding", body },
        options
      );
      return lookup(result, (data) => isObj(data.basicInfo));
    },

    async competitors(input, options) {
      const body = compact({
        company_domain: input.domain,
        company_name: input.companyName,
        company_url: input.profileUrl,
      });
      if (Object.keys(body).length === 0) {
        return invalidLookup(
          config,
          "Pass a domain, companyName or profileUrl.",
          ["domain", "companyName", "profileUrl"]
        );
      }
      const result = await send<CompetitorsResult>(
        config,
        { method: "POST", path: "/v1/companies/competitors-search", body },
        options
      );
      return lookup(result, (data) => nonEmpty(data.competitors));
    },

    async technographics(input, options) {
      if (!nonEmpty(input?.domain)) {
        return invalidLookup(config, "Pass a domain.", ["domain"]);
      }
      const result = await send<TechnographicsResult>(
        config,
        {
          method: "POST",
          path: "/v1/companies/technographics",
          body: compact({ company_domain: input.domain }),
        },
        options
      );
      return lookup(
        result,
        (data) =>
          nonEmpty(data.data) &&
          !(isObj(data.data) && Object.keys(data.data).length === 0)
      );
    },
  };
}
