import { clientError } from "../errors";
import type { RequestOptions, Result, TransportConfig } from "../http";
import { send } from "../http";

/**
 * A company record from `POST /v3/companies/search`. The commonly used fields
 * are typed; the API returns more (funding, technographics, SIC/NAICS), which
 * stay available through the index signature.
 */
export interface Company {
  company_about?: string | null;
  company_domain?: string | null;
  company_headline?: string | null;
  company_industry_linkedin?: string | null;
  company_name?: string | null;
  company_website?: string | null;
  employee_max?: number | null;
  employee_min?: number | null;
  employee_range?: string | null;
  founded_year?: number | null;
  hq_city?: string | null;
  hq_country?: string | null;
  hq_country_code?: string | null;
  hq_state?: string | null;
  linkedin_url?: string | null;
  revenue_range?: string | null;
  specialties?: string | null;
  total_funding?: number | null;
  [field: string]: unknown;
}

export interface CompanyLookup {
  /** Null when no company matched (not billed). */
  company: Company | null;
  /** 1 per company returned, 0 when not found. */
  credits_consumed: number;
  found: boolean;
}

export interface FindCompanyInput {
  /** Company domain or website, e.g. `stripe.com`. Preferred. */
  domain?: string;
  /** Company LinkedIn URL. */
  linkedinUrl?: string;
  /** Company name; least precise. */
  name?: string;
}

type Obj = Record<string, unknown>;

function isObj(value: unknown): value is Obj {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/**
 * Reads both the v3 list shape (`companies[]`) and the single-lookup fields
 * (`company`). `found` follows whether a record came back, so it can never
 * disagree with `company`.
 */
export function toCompanyLookup(body: Obj): CompanyLookup {
  const fromList =
    Array.isArray(body.companies) && isObj(body.companies[0])
      ? body.companies[0]
      : null;
  const company = (fromList ??
    (isObj(body.company) ? body.company : null)) as Company | null;
  const credits = Number(body.credits_consumed);
  return {
    found: company !== null,
    company,
    credits_consumed: Number.isFinite(credits) ? credits : 0,
  };
}

export async function findCompanyWith(
  config: TransportConfig,
  input: FindCompanyInput,
  options: RequestOptions = {}
): Promise<Result<CompanyLookup>> {
  const body: Obj = {};
  if (input.domain?.trim()) {
    body.company_domain = input.domain.trim();
  }
  if (input.name?.trim()) {
    body.company_name = input.name.trim();
  }
  if (input.linkedinUrl?.trim()) {
    body.profile_url = input.linkedinUrl.trim();
  }
  if (Object.keys(body).length === 0) {
    return {
      data: null,
      error: clientError(
        "invalid_input",
        "Pass a domain, name or linkedinUrl.",
        {
          param: ["domain", "name", "linkedinUrl"],
        }
      ),
      meta: {
        status: 0,
        requestId: undefined,
        sandbox: config.sandbox,
        credits: { consumed: 0, remaining: undefined },
        rateLimit: { limit: undefined, remaining: undefined, reset: undefined },
      },
    };
  }

  const result = await send<Obj>(
    config,
    "POST",
    "/v3/companies/search",
    body,
    options
  );
  if (result.error) {
    return result;
  }
  return { ...result, data: toCompanyLookup(result.data) };
}
