/**
 * Zod schemas for every method's input, grouped like the client:
 * `people.findByRole` validates what `client.people.findByRole()` takes.
 *
 * Zod 4 schemas implement Standard Schema, so they also plug into tRPC,
 * TanStack Form, Hono validators, React Hook Form and AI SDK tools. The
 * refinements match the checks the client runs before sending, with the same
 * messages.
 */
import { z } from "zod";
import type { ApiRequest } from "../core/types";
import type { DaysInput, SummaryInput } from "../resources/account";
import type { AdsInput } from "../resources/ads";
import type {
  BulkListInput,
  BulkLocalLeadsInput,
  BulkRestartInput,
  BulkRowsInput,
  BulkSubmitInput,
} from "../resources/bulk";
import { checkLocalLeads, checkSubmission } from "../resources/bulk";
import type {
  CompanyInput,
  LookalikesInput,
  SearchCompaniesInput,
} from "../resources/companies";
import type { FindEmailInput, ProfileUrlInput } from "../resources/email";
import type { SearchJobsInput } from "../resources/jobs";
import type { SearchLocalLeadsInput } from "../resources/local-leads";
import type {
  DetectJobChangeInput,
  FindByRoleInput,
  FindEmployeesInput,
  FindMobileInput,
  FromEmailInput,
  SearchPeopleInput,
} from "../resources/people";

const text = z.string().trim().min(1);
const optionalText = z.string().trim().min(1).optional();
const email = z.string().trim().max(320).email("That is not an email address.");
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/u, "Use YYYY-MM-DD.");

const isPlainObject = (value: unknown): boolean =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

/** Filter objects are checked by the API; here only their shape is. */
function filters<T>() {
  return z.custom<T>(isPlainObject, "Pass an object.").optional();
}

function hasSome(value: Record<string, unknown>, keys: string[]): boolean {
  return keys.some((key) => {
    const v = value[key];
    return Array.isArray(v) ? v.length > 0 : v !== undefined && v !== "";
  });
}

function refineSome<S extends z.ZodType<Record<string, unknown>>>(
  schema: S,
  keys: string[],
  message: string,
  path: string
): S {
  return schema.refine(
    (value) => hasSome(value as Record<string, unknown>, keys),
    { message, path: [path] }
  ) as unknown as S;
}

/* Email ------------------------------------------------------------------- */

const validateEmail = z.object({
  email,
  includeExtendedInfo: z.boolean().optional(),
  includeVerificationDetails: z.boolean().optional(),
  verificationPolicy: z.enum(["legacy", "strict"]).optional(),
});

const findEmail = z
  .object({
    firstName: optionalText,
    lastName: optionalText,
    fullName: optionalText,
    domain: optionalText,
    companyName: optionalText,
    profileUrl: optionalText,
    allowDomainMismatch: z.boolean().optional(),
  })
  .refine(
    (v) =>
      Boolean(v.profileUrl) ||
      (Boolean(v.firstName || v.fullName) &&
        Boolean(v.domain || v.companyName)),
    {
      message: "Pass a name with a domain or company name, or a profileUrl.",
      path: ["firstName"],
    }
  );

const profileUrl = z.object({ profileUrl: text });

export const emailSchemas = {
  validate: validateEmail,
  find: findEmail,
  findPersonal: profileUrl,
  fromProfile: profileUrl,
} as const;

/* People ------------------------------------------------------------------ */

type PeopleSearchBody = ApiRequest<"people-search">;

const searchPeopleBase = z.object({
  domain: optionalText,
  companyName: optionalText,
  companyProfileUrl: optionalText,
  companyFilters: filters<PeopleSearchBody["company_filters"]>(),
  peopleFilters: filters<PeopleSearchBody["people_filters"]>(),
  titles: z.array(text).optional(),
  roles: z.array(text).optional(),
  query: optionalText,
  includeCompany: z.boolean().optional(),
  limit: z.number().int().min(1).max(50).optional(),
  cursor: optionalText,
});

const searchPeople = refineSome(
  searchPeopleBase,
  [
    "domain",
    "companyName",
    "companyProfileUrl",
    "companyFilters",
    "peopleFilters",
    "titles",
    "roles",
    "query",
  ],
  "Pass at least one filter: a company, titles, roles, a query or filters.",
  "query"
);

const fromEmail = refineSome(
  z.object({ workEmail: email.optional(), personalEmail: email.optional() }),
  ["workEmail", "personalEmail"],
  "Pass a workEmail or personalEmail.",
  "workEmail"
);

const findMobile = refineSome(
  z.object({
    profileUrl: optionalText,
    workEmail: email.optional(),
    personalEmail: email.optional(),
  }),
  ["profileUrl", "workEmail", "personalEmail"],
  "Pass a profileUrl, workEmail or personalEmail.",
  "profileUrl"
);

const findByRole = refineSome(
  z.object({
    jobTitle: text,
    domain: optionalText,
    companyName: optionalText,
    companyProfileUrl: optionalText,
  }),
  ["domain", "companyName", "companyProfileUrl"],
  "Pass a jobTitle and a domain, companyName or companyProfileUrl.",
  "domain"
);

const findEmployees = refineSome(
  z.object({
    domain: optionalText,
    companyName: optionalText,
    limit: z.number().int().min(1).optional(),
  }),
  ["domain", "companyName"],
  "Pass a domain or companyName.",
  "domain"
);

const detectJobChange = refineSome(
  z.object({
    profileUrl: text,
    domain: optionalText,
    companyName: optionalText,
  }),
  ["domain", "companyName"],
  "Pass a profileUrl and the domain or companyName you expect.",
  "domain"
);

export const peopleSchemas = {
  search: searchPeople,
  getProfile: profileUrl,
  fromEmail,
  findMobile,
  findByRole,
  findEmployees,
  detectJobChange,
} as const;

/* Companies --------------------------------------------------------------- */

type CompanySearchBody = ApiRequest<"company-search-v3">;
type LookalikeBody = ApiRequest<"company-lookalike-v3">;

const searchCompanies = refineSome(
  z.object({
    companyFilters: filters<CompanySearchBody["company_filters"]>(),
    query: optionalText,
    limit: z.number().int().min(1).max(50).optional(),
    cursor: optionalText,
  }),
  ["companyFilters", "query"],
  "Pass companyFilters or a query.",
  "query"
);

const company = refineSome(
  z.object({
    domain: optionalText,
    companyName: optionalText,
    profileUrl: optionalText,
  }),
  ["domain", "companyName", "profileUrl"],
  "Pass a domain, companyName or profileUrl.",
  "domain"
);

const companyNoProfile = refineSome(
  z.object({ domain: optionalText, companyName: optionalText }),
  ["domain", "companyName"],
  "Pass a domain or companyName.",
  "domain"
);

const lookalikes = refineSome(
  z.object({
    domain: optionalText,
    companyName: optionalText,
    description: optionalText,
    companyFilters: filters<LookalikeBody["company_filters"]>(),
    limit: z.number().int().min(1).max(2000).optional(),
    offset: z.number().int().min(0).max(2000).optional(),
  }),
  ["domain", "companyName", "description"],
  "Pass a seed domain, companyName or description.",
  "domain"
);

export const companiesSchemas = {
  search: searchCompanies,
  find: company,
  lookalikes,
  funding: companyNoProfile,
  competitors: company,
  technographics: z.object({ domain: text }),
} as const;

/* Local leads, jobs, ads, analytics ---------------------------------------- */

export const localLeadsSchemas = {
  /** Filters are checked by the API; this checks there is at least one. */
  search: z.custom<SearchLocalLeadsInput>(
    (value) =>
      isPlainObject(value) &&
      Object.keys(value as object).some((key) => key !== "cursor"),
    "Pass at least one filter, such as country and category."
  ),
} as const;

export const jobsSchemas = {
  /** Filters are checked by the API; this checks the shape. */
  search: z.custom<SearchJobsInput>(isPlainObject, "Pass an object."),
} as const;

const ads = companyNoProfile.and(
  z.object({ limit: z.number().int().min(1).max(100).optional() })
);

export const adsSchemas = {
  google: ads,
  meta: ads,
  b2b: ads,
  b2bDetails: z.object({ adUrl: text }),
} as const;

export const analyticsSchemas = {
  days: z.object({ days: z.number().int().min(1).max(90).optional() }),
  summary: z.object({ startDate: date.optional(), endDate: date.optional() }),
  day: date,
} as const;

/* Bulk ------------------------------------------------------------------------ */

const record = z.record(z.string(), z.unknown());

/** Adds the client's own check, with its message on the first field it names. */
function sameCheck<T>(
  check: (value: T) => { message: string; param: string[] } | null
) {
  return (value: unknown, ctx: z.RefinementCtx) => {
    const problem = check(value as T);
    if (problem) {
      ctx.addIssue({
        code: "custom",
        message: problem.message,
        path: problem.param[0]?.split(".") ?? [],
      });
    }
  };
}

const bulkSubmit = z
  .object({
    product: text,
    rows: z.array(record).optional(),
    csv: optionalText,
    fileUrl: z.string().trim().url().optional(),
    format: z.enum(["csv", "json", "jsonl"]).optional(),
    inputMapping: z
      .record(
        z.string(),
        z.object({
          source: z.string().optional(),
          column: z.string().optional(),
          value: z.unknown().optional(),
        })
      )
      .optional(),
    callback: z
      .object({
        url: z.string().trim().url(),
        events: z
          .array(z.enum(["completed", "failed", "canceled", "progress", "any"]))
          .optional(),
        inlineResults: z.boolean().optional(),
        secret: z.string().min(1).optional(),
        metadata: record.optional(),
      })
      .optional(),
    metadata: record.optional(),
    presetId: optionalText,
    priority: z.number().int().min(-1000).max(1000).optional(),
    fileName: optionalText,
    allowDuplicate: z.boolean().optional(),
  })
  .superRefine(sameCheck<BulkSubmitInput>(checkSubmission))
  .pipe(z.custom<BulkSubmitInput>());

const bulkLocalLeads = z
  .object({
    keywords: z.array(text).min(1).max(25),
    cities: z.array(text).min(1).max(100),
    countryCodes: z.array(z.string().trim().length(2)).optional(),
    fileName: optionalText,
  })
  .superRefine(sameCheck<BulkLocalLeadsInput>(checkLocalLeads));

const bulkRows = z.object({
  limit: z.number().int().min(1).max(1000).optional(),
  offset: z.number().int().min(0).optional(),
  status: optionalText,
});

const bulkRestart = z
  .object({
    mode: z
      .enum(["full", "failed_only", "unstick", "from_row", "from_shard"])
      .optional(),
    startRowIndex: z.number().int().min(0).optional(),
    startShardIndex: z.number().int().min(0).optional(),
    recheckUnverified: z.boolean().optional(),
  })
  .refine((v) => v.mode !== "from_row" || v.startRowIndex !== undefined, {
    message: "Pass startRowIndex with mode from_row.",
    path: ["startRowIndex"],
  })
  .refine((v) => v.mode !== "from_shard" || v.startShardIndex !== undefined, {
    message: "Pass startShardIndex with mode from_shard.",
    path: ["startShardIndex"],
  });

export const bulkSchemas = {
  submit: bulkSubmit,
  validate: bulkSubmit,
  localLeads: bulkLocalLeads,
  quoteLocalLeads: bulkLocalLeads,
  list: z.object({
    limit: z.number().int().min(1).max(200).optional(),
    offset: z.number().int().min(0).max(10_000).optional(),
    product: optionalText,
    status: optionalText,
  }),
  results: bulkRows,
  errors: bulkRows.omit({ status: true }),
  restart: bulkRestart,
  priority: z
    .number()
    .int("priority must be a whole number from -1000 to 1000.")
    .min(-1000, "priority must be a whole number from -1000 to 1000.")
    .max(1000, "priority must be a whole number from -1000 to 1000."),
  jobId: text,
} as const;

/* Every schema's output must be accepted by its method. A mismatch fails the typecheck. */
type Accepts<Input, Schema extends z.ZodType> = [z.output<Schema>] extends [
  Input,
]
  ? true
  : false;
type All<T extends true[]> = T;
export type _InputContract = All<
  [
    Accepts<FindEmailInput, typeof findEmail>,
    Accepts<ProfileUrlInput, typeof profileUrl>,
    Accepts<SearchPeopleInput, typeof searchPeople>,
    Accepts<FromEmailInput, typeof fromEmail>,
    Accepts<FindMobileInput, typeof findMobile>,
    Accepts<FindByRoleInput, typeof findByRole>,
    Accepts<FindEmployeesInput, typeof findEmployees>,
    Accepts<DetectJobChangeInput, typeof detectJobChange>,
    Accepts<SearchCompaniesInput, typeof searchCompanies>,
    Accepts<CompanyInput, typeof company>,
    Accepts<LookalikesInput, typeof lookalikes>,
    Accepts<AdsInput, typeof ads>,
    Accepts<DaysInput, typeof analyticsSchemas.days>,
    Accepts<SummaryInput, typeof analyticsSchemas.summary>,
    Accepts<BulkSubmitInput, typeof bulkSubmit>,
    Accepts<BulkLocalLeadsInput, typeof bulkLocalLeads>,
    Accepts<BulkListInput, typeof bulkSchemas.list>,
    Accepts<BulkRowsInput, typeof bulkRows>,
    Accepts<BulkRestartInput, typeof bulkRestart>,
  ]
>;
