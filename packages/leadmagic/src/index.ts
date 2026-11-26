export {
  createClient,
  findCompany,
  getCredits,
  type LeadMagicClient,
  type LeadMagicOptions,
  validateEmail,
} from "./client";
export {
  isLeadMagicError,
  type LeadMagicApiErrorCode,
  type LeadMagicClientErrorCode,
  LeadMagicError,
  type LeadMagicErrorCode,
  type LeadMagicErrorKind,
} from "./errors";
export type {
  RateLimitInfo,
  RequestOptions,
  ResponseMeta,
  Result,
  SandboxOutcome,
} from "./http";
export type {
  Company,
  CompanyLookup,
  FindCompanyInput,
  FindCompanyResult,
} from "./resources/company";
export type { Credits, GetCreditsResult } from "./resources/credits";
export type {
  EmailCompanyLocation,
  EmailStatus,
  EmailValidation,
  EmailVerdict,
  ValidateEmailOptions,
  ValidateEmailResult,
} from "./resources/email";
export { VERSION } from "./version";
