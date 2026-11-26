export { LeadMagic, type LeadMagicOptions } from "./client";
export {
  isLeadMagicError,
  type LeadMagicApiErrorCode,
  type LeadMagicClientErrorCode,
  LeadMagicError,
  type LeadMagicErrorCode,
  type LeadMagicErrorContext,
  type LeadMagicErrorIssue,
  type LeadMagicErrorKind,
  type LeadMagicErrorReason,
} from "./core/errors";
export type {
  Call,
  HttpMethod,
  QueryValue,
  RateLimitInfo,
  RequestOptions,
  ResponseMeta,
  Result,
  SandboxOutcome,
} from "./core/http";
export type {
  ApiQuery,
  ApiRequest,
  ApiResponse,
  IterateOptions,
  LookupResult,
  OperationId,
  Page,
  PageResult,
} from "./core/types";
export { VERSION } from "./core/version";
export type * from "./resources/account";
export type * from "./resources/ads";
export type * from "./resources/companies";
export type * from "./resources/email";
export type * from "./resources/jobs";
export type * from "./resources/local-leads";
export type * from "./resources/people";
