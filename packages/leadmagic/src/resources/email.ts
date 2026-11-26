import { clientError } from "../errors";
import type { RequestOptions, Result, TransportConfig } from "../http";
import { send } from "../http";

/** What the API concluded about the mailbox. */
export type EmailStatus = "valid" | "invalid" | "unknown";

/**
 * The one field a form needs.
 * - `deliverable`: the mailbox accepts mail.
 * - `undeliverable`: it does not; ask the visitor to fix it.
 * - `unknown`: it could not be confirmed (catch-all domain, timeout). Let it through.
 */
export type EmailVerdict = "deliverable" | "undeliverable" | "unknown";

export interface EmailCompanyLocation {
  address_line_2: string | null;
  continent: string | null;
  country: string | null;
  geo: string | null;
  locality: string | null;
  metro: string | null;
  name: string | null;
  postal_code: string | null;
  region: string | null;
  street_address: string | null;
}

/** `POST /v1/people/email-validation`. Field names match the API reference. */
export interface EmailValidation {
  /** Present on degraded answers, e.g. `email_validation_unavailable`. */
  code?: string;
  company_facebook_url: string | null;
  company_founded: number | null;
  company_industry: string | null;
  company_linkedin_id: string | null;
  company_linkedin_url: string | null;
  company_location: EmailCompanyLocation | null;
  company_name: string | null;
  company_size: string | null;
  company_twitter_url: string | null;
  company_type: string | null;
  /** `valid` and `invalid` cost 0.25 credits; `unknown` is free. */
  credits_consumed: number;
  email: string;
  email_status: EmailStatus;
  extended_info?: Record<string, unknown>;
  /** The local part is a role or shared mailbox such as `info@` or `sales@`. */
  is_role_based: boolean;
  message: string;
  mx_gateway: string | null;
  mx_gateway_type: string | null;
  mx_provider: string | null;
  mx_record: string | null;
  mx_security_gateway: boolean;
  pipeline_version?: string;
  validated_at?: string;
  validation_path_code?: string;
  /** Added by the SDK from `email_status`. */
  verdict: EmailVerdict;
  verification?: Record<string, unknown>;
}

export interface ValidateEmailOptions extends RequestOptions {
  /** Include `extended_info` in the response. */
  includeExtendedInfo?: boolean;
  /** Include the `verification` object in the response. */
  includeVerificationDetails?: boolean;
  /** `strict` reports policy-only rejections as `unknown` (free) instead of `invalid`. */
  verificationPolicy?: "legacy" | "strict";
}

/** What `validateEmail` resolves to. Check `error` and `data` narrows to {@link EmailValidation}. */
export type ValidateEmailResult = Result<EmailValidation>;

const MAX_EMAIL_LENGTH = 320;
const STATUSES: ReadonlySet<string> = new Set(["valid", "invalid", "unknown"]);

export function verdictFor(status: EmailStatus): EmailVerdict {
  if (status === "valid") {
    return "deliverable";
  }
  if (status === "invalid") {
    return "undeliverable";
  }
  return "unknown";
}

/** Normalizes the body: unknown statuses become `unknown`, `verdict` is added. */
export function toEmailValidation(
  body: Record<string, unknown>
): EmailValidation {
  const raw =
    typeof body.email_status === "string" ? body.email_status : "unknown";
  const status = (STATUSES.has(raw) ? raw : "unknown") as EmailStatus;
  return {
    ...(body as unknown as EmailValidation),
    email_status: status,
    is_role_based: body.is_role_based === true,
    verdict: verdictFor(status),
  };
}

export async function validateEmailWith(
  config: TransportConfig,
  email: string,
  options: ValidateEmailOptions = {}
): Promise<ValidateEmailResult> {
  const value = typeof email === "string" ? email.trim() : "";
  if (!value.includes("@") || value.length > MAX_EMAIL_LENGTH) {
    return {
      data: null,
      error: clientError("invalid_input", "That is not an email address.", {
        param: ["email"],
      }),
      meta: {
        status: 0,
        requestId: undefined,
        sandbox: config.sandbox,
        credits: { consumed: 0, remaining: undefined },
        rateLimit: { limit: undefined, remaining: undefined, reset: undefined },
      },
    };
  }

  const body: Record<string, unknown> = { email: value };
  if (options.includeExtendedInfo) {
    body.include_extended_info = true;
  }
  if (options.includeVerificationDetails) {
    body.include_verification_details = true;
  }
  if (options.verificationPolicy) {
    body.verification_policy = options.verificationPolicy;
  }

  const result = await send<Record<string, unknown>>(
    config,
    "POST",
    "/v1/people/email-validation",
    body,
    options
  );
  if (result.error) {
    return result;
  }
  return { ...result, data: toEmailValidation(result.data) };
}
