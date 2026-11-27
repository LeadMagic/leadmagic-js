import type { RequestOptions, Result, TransportConfig } from "../core/http";
import { invalidInput, send } from "../core/http";
import { compact, invalidLookup, lookup, nonEmpty } from "../core/shape";
import type { ApiResponse, LookupResult } from "../core/types";

export type EmailValidation = ApiResponse<"email-validation">;
export type EmailFinderResult = ApiResponse<"email-finder">;
export type PersonalEmailResult = ApiResponse<"personal-email-finder">;
export type ProfileEmailResult = ApiResponse<"b2b-profile-email">;

export interface ValidateEmailOptions extends RequestOptions {
  /** Include `extended_info` in the response. */
  includeExtendedInfo?: boolean;
  /** Include the `verification` object in the response. */
  includeVerificationDetails?: boolean;
  /** `strict` reports policy-only rejections as `unknown` (free) instead of `invalid`. */
  verificationPolicy?: "legacy" | "strict";
}

export interface FindEmailInput {
  /**
   * Return an email found on a domain other than the one asked for. By
   * default that comes back as a free not-found.
   */
  allowDomainMismatch?: boolean;
  /** Company name; used when there is no domain. */
  companyName?: string;
  /** Company domain, e.g. `stripe.com`. Preferred over `companyName`. */
  domain?: string;
  firstName?: string;
  /** Use instead of `firstName` and `lastName`. */
  fullName?: string;
  lastName?: string;
  /** The person's profile URL or username. Enough on its own. */
  profileUrl?: string;
}

export interface ProfileUrlInput {
  /** The person's profile URL or username. */
  profileUrl: string;
}

export interface EmailResource {
  /** Find a work email. 1 credit when found; free otherwise. */
  find: (
    input: FindEmailInput,
    options?: RequestOptions
  ) => Promise<LookupResult<EmailFinderResult>>;
  /** Find personal emails from a profile. 2 credits when found. */
  findPersonal: (
    input: ProfileUrlInput,
    options?: RequestOptions
  ) => Promise<LookupResult<PersonalEmailResult>>;
  /** Work email from a profile. 5 credits when found. */
  fromProfile: (
    input: ProfileUrlInput,
    options?: RequestOptions
  ) => Promise<LookupResult<ProfileEmailResult>>;
  /** Validate one address. 0.25 credits for `valid` or `invalid`; `unknown` is free. */
  validate: (
    email: string,
    options?: ValidateEmailOptions
  ) => Promise<Result<EmailValidation>>;
}

const MAX_EMAIL_LENGTH = 320;

export function createEmail(config: TransportConfig): EmailResource {
  return {
    validate(email, options = {}) {
      const value = typeof email === "string" ? email.trim() : "";
      if (!value.includes("@") || value.length > MAX_EMAIL_LENGTH) {
        return Promise.resolve(
          invalidInput(config, "That is not an email address.", ["email"])
        );
      }
      const {
        includeExtendedInfo,
        includeVerificationDetails,
        verificationPolicy,
        ...request
      } = options;
      return send(
        config,
        {
          method: "POST",
          path: "/v1/people/email-validation",
          body: compact({
            email: value,
            include_extended_info: includeExtendedInfo || undefined,
            include_verification_details:
              includeVerificationDetails || undefined,
            verification_policy: verificationPolicy,
          }),
        },
        request
      );
    },

    async find(input, options) {
      const body = compact({
        first_name: input.firstName,
        last_name: input.lastName,
        full_name: input.fullName,
        domain: input.domain,
        company_name: input.companyName,
        profile_url: input.profileUrl,
        allow_domain_mismatch: input.allowDomainMismatch,
      });
      const hasName = Boolean(body.first_name || body.full_name);
      const hasCompany = Boolean(body.domain || body.company_name);
      if (!(body.profile_url || (hasName && hasCompany))) {
        return invalidLookup(
          config,
          "Pass a name with a domain or company name, or a profileUrl.",
          ["firstName", "domain", "profileUrl"]
        );
      }
      const result = await send<EmailFinderResult>(
        config,
        { method: "POST", path: "/v1/people/email-finder", body },
        options
      );
      return lookup(result, (data) => nonEmpty(data.email));
    },

    async findPersonal(input, options) {
      if (!nonEmpty(input?.profileUrl)) {
        return invalidLookup(config, "Pass a profileUrl.", ["profileUrl"]);
      }
      const result = await send<PersonalEmailResult>(
        config,
        {
          method: "POST",
          path: "/v1/people/personal-email-finder",
          body: compact({ profile_url: input.profileUrl }),
        },
        options
      );
      return lookup(
        result,
        (data) =>
          nonEmpty(data.first_personal_email) || nonEmpty(data.personal_emails)
      );
    },

    async fromProfile(input, options) {
      if (!nonEmpty(input?.profileUrl)) {
        return invalidLookup(config, "Pass a profileUrl.", ["profileUrl"]);
      }
      const result = await send<ProfileEmailResult>(
        config,
        {
          method: "POST",
          path: "/v1/people/b2b-profile-email",
          body: compact({ profile_url: input.profileUrl }),
        },
        options
      );
      return lookup(result, (data) => nonEmpty(data.email));
    },
  };
}
