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
} from "./resources/company";
export type { Credits } from "./resources/credits";
export type {
  EmailStatus,
  EmailValidation,
  EmailVerdict,
  ValidateEmailOptions,
} from "./resources/email";
export { VERSION } from "./version";
