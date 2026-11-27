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
export type { ServerSentEvent } from "./core/sse";
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
export type * from "./resources/bulk";
export { BULK_FINAL_STATUSES, isFinalStatus } from "./resources/bulk";
export type * from "./resources/companies";
export type * from "./resources/email";
export type * from "./resources/jobs";
export type * from "./resources/local-leads";
export type * from "./resources/people";
export {
  type BulkWebhook,
  type BulkWebhookEvent,
  signWebhook,
  type VerifyWebhookInput,
  verifyWebhook,
  WEBHOOK_SIGNATURE_HEADER,
} from "./webhooks";
