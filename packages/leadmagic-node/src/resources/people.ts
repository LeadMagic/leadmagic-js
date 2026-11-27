import type { RequestOptions, TransportConfig } from "../core/http";
import { send } from "../core/http";
import {
  compact,
  invalidLookup,
  invalidPage,
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

export type PeopleSearchResult = ApiResponse<"people-search">;
export type Person = NonNullable<PeopleSearchResult["people"]>[number];
export type ProfileResult = ApiResponse<"profile-search">;
export type ProfileFromEmailResult = ApiResponse<"email-to-b2b-profile">;
export type MobileResult = ApiResponse<"mobile-finder">;
export type RoleFinderResult = ApiResponse<"role-finder">;
export type EmployeeFinderResult = ApiResponse<"employee-finder">;
export type JobChangeResult = ApiResponse<"job-change-detector">;

type PeopleSearchBody = ApiRequest<"people-search">;

export interface SearchPeopleInput {
  /** Employer criteria: industry, headcount, revenue, location, … (API field names). */
  companyFilters?: PeopleSearchBody["company_filters"];
  /** One employer, by name. */
  companyName?: string;
  /** One employer, by company profile URL or slug. */
  companyProfileUrl?: string;
  /** Next page: `page.nextCursor` from the previous call, with the same filters. */
  cursor?: string;
  /** One employer, by domain. */
  domain?: string;
  /** Add the employer's company row to each person. Default true. */
  includeCompany?: boolean;
  /** Rows per page, at most 50. Each row costs 1 credit. Default 25. */
  limit?: number;
  /** Person criteria: name, title, seniority, location, … (API field names). */
  peopleFilters?: PeopleSearchBody["people_filters"];
  /** Free-text people or title query. */
  query?: string;
  roles?: string[];
  titles?: string[];
}

export interface FromEmailInput {
  personalEmail?: string;
  workEmail?: string;
}

export interface FindMobileInput {
  personalEmail?: string;
  profileUrl?: string;
  workEmail?: string;
}

export interface FindByRoleInput {
  companyName?: string;
  /** Company profile URL. */
  companyProfileUrl?: string;
  domain?: string;
  /** The role to find, e.g. `CEO` or `Head of Sales`. */
  jobTitle: string;
}

export interface FindEmployeesInput {
  companyName?: string;
  /** Preferred over `companyName`. */
  domain?: string;
  /** At most this many employees, 0.05 credits each. Default 10. */
  limit?: number;
}

export interface DetectJobChangeInput {
  /** The company you expect them to work at, by name. */
  companyName?: string;
  /** The company you expect them to work at, by domain. */
  domain?: string;
  profileUrl: string;
}

export interface PeopleResource {
  /** Did this person leave the company you have on file? 3 credits; free if the profile is not found. */
  detectJobChange: (
    input: DetectJobChangeInput,
    options?: RequestOptions
  ) => Promise<LookupResult<JobChangeResult>>;
  /** Find people at a company by role. 2 credits when found. */
  findByRole: (
    input: FindByRoleInput,
    options?: RequestOptions
  ) => Promise<LookupResult<RoleFinderResult>>;
  /** Employees of a company. 0.05 credits per employee returned. */
  findEmployees: (
    input: FindEmployeesInput,
    options?: RequestOptions
  ) => Promise<LookupResult<EmployeeFinderResult>>;
  /** Mobile number from a profile or email. 5 credits when found. */
  findMobile: (
    input: FindMobileInput,
    options?: RequestOptions
  ) => Promise<LookupResult<MobileResult>>;
  /** Profile URL from a work or personal email. 10 credits when found. */
  fromEmail: (
    input: FromEmailInput,
    options?: RequestOptions
  ) => Promise<LookupResult<ProfileFromEmailResult>>;
  /** Full profile: work history, education, location. 1 credit when found. */
  getProfile: (
    input: { profileUrl: string },
    options?: RequestOptions
  ) => Promise<LookupResult<ProfileResult>>;
  /** One page of people. 1 credit per person returned. */
  search: (
    input: SearchPeopleInput,
    options?: RequestOptions
  ) => Promise<PageResult<PeopleSearchResult, Person>>;
  /** Every matching person, page by page, up to `maxItems`. Throws on the first failed page. */
  searchAll: (
    input: Omit<SearchPeopleInput, "cursor" | "limit">,
    options: IterateOptions
  ) => AsyncGenerator<Person, void, undefined>;
}

const MAX_PAGE = 50;

function hasAny(body: Record<string, unknown>, keys: string[]): boolean {
  return keys.some((key) => nonEmpty(body[key]));
}

export function createPeople(config: TransportConfig): PeopleResource {
  const search: PeopleResource["search"] = async (input, options) => {
    const body = compact({
      company_domain: input.domain,
      company_name: input.companyName,
      linkedin_url: input.companyProfileUrl,
      company_filters: input.companyFilters,
      people_filters: input.peopleFilters,
      titles: input.titles,
      roles: input.roles,
      query: input.query,
      include_company: input.includeCompany,
      limit: input.limit,
      cursor: input.cursor,
    });
    if (
      !hasAny(body, [
        "company_domain",
        "company_name",
        "linkedin_url",
        "company_filters",
        "people_filters",
        "titles",
        "roles",
        "query",
      ])
    ) {
      return invalidPage(
        config,
        "Pass at least one filter: a company, titles, roles, a query or filters.",
        ["domain", "companyFilters", "peopleFilters", "query"]
      );
    }
    const result = await send<PeopleSearchResult>(
      config,
      { method: "POST", path: "/v3/people/search", body },
      options
    );
    return paged(result, {
      items: (data) => data.people,
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

    async getProfile(input, options) {
      if (!nonEmpty(input?.profileUrl)) {
        return invalidLookup(config, "Pass a profileUrl.", ["profileUrl"]);
      }
      const result = await send<ProfileResult>(
        config,
        {
          method: "POST",
          path: "/v1/people/profile-search",
          body: compact({ profile_url: input.profileUrl }),
        },
        options
      );
      return lookup(
        result,
        (data) => nonEmpty(data.full_name) || nonEmpty(data.first_name)
      );
    },

    async fromEmail(input, options) {
      const body = compact({
        work_email: input.workEmail,
        personal_email: input.personalEmail,
      });
      if (!hasAny(body, ["work_email", "personal_email"])) {
        return invalidLookup(config, "Pass a workEmail or personalEmail.", [
          "workEmail",
          "personalEmail",
        ]);
      }
      const result = await send<ProfileFromEmailResult>(
        config,
        { method: "POST", path: "/v1/people/b2b-profile", body },
        options
      );
      return lookup(result, (data) => nonEmpty(data.profile_url));
    },

    async findMobile(input, options) {
      const body = compact({
        profile_url: input.profileUrl,
        work_email: input.workEmail,
        personal_email: input.personalEmail,
      });
      if (!hasAny(body, ["profile_url", "work_email", "personal_email"])) {
        return invalidLookup(
          config,
          "Pass a profileUrl, workEmail or personalEmail.",
          ["profileUrl", "workEmail", "personalEmail"]
        );
      }
      const result = await send<MobileResult>(
        config,
        { method: "POST", path: "/v1/people/mobile-finder", body },
        options
      );
      return lookup(result, (data) => nonEmpty(data.mobile_number));
    },

    async findByRole(input, options) {
      const body = compact({
        job_title: input.jobTitle,
        company_domain: input.domain,
        company_name: input.companyName,
        linkedin_url: input.companyProfileUrl,
      });
      if (
        !(
          body.job_title &&
          hasAny(body, ["company_domain", "company_name", "linkedin_url"])
        )
      ) {
        return invalidLookup(
          config,
          "Pass a jobTitle and a domain, companyName or companyProfileUrl.",
          ["jobTitle", "domain"]
        );
      }
      const result = await send<RoleFinderResult>(
        config,
        { method: "POST", path: "/v1/people/role-finder", body },
        options
      );
      return lookup(
        result,
        (data) => nonEmpty(data.profile_url) || nonEmpty(data.name)
      );
    },

    async findEmployees(input, options) {
      const body = compact({
        company_domain: input.domain,
        company_name: input.companyName,
        limit: input.limit,
      });
      if (!hasAny(body, ["company_domain", "company_name"])) {
        return invalidLookup(config, "Pass a domain or companyName.", [
          "domain",
          "companyName",
        ]);
      }
      const result = await send<EmployeeFinderResult>(
        config,
        { method: "POST", path: "/v1/people/employee-finder", body },
        options
      );
      return lookup(result, (data) => nonEmpty(data.employees));
    },

    async detectJobChange(input, options) {
      const body = compact({
        profile_url: input.profileUrl,
        company_domain: input.domain,
        company_name: input.companyName,
      });
      if (
        !(body.profile_url && hasAny(body, ["company_domain", "company_name"]))
      ) {
        return invalidLookup(
          config,
          "Pass a profileUrl and the domain or companyName you expect.",
          ["profileUrl", "domain"]
        );
      }
      const result = await send<JobChangeResult>(
        config,
        { method: "POST", path: "/v1/people/job-change-detector", body },
        options
      );
      return lookup(result, (data) => data.profile_found !== false);
    },
  };
}
