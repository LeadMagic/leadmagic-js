/**
 * Type-level tests. `pnpm typecheck` fails if a public type stops narrowing
 * or disappears from an entry point; the runtime assertions are no-ops.
 */
import { describe, expectTypeOf, it } from "vitest";
import type {
  CompanyLookup,
  Credits,
  EmailCompanyLocation,
  EmailValidation,
  EmailVerdict,
  FindCompanyResult,
  GetCreditsResult,
  LeadMagicApiErrorCode,
  LeadMagicClientErrorCode,
  LeadMagicError,
  LeadMagicErrorCode,
  LeadMagicErrorKind,
  ResponseMeta,
  ValidateEmailResult,
} from "../src/index";
import {
  createClient,
  findCompany,
  getCredits,
  validateEmail,
} from "../src/index";
import type {
  ValidateEmailEvent,
  ValidateEmailHandlerOptions,
  ValidateEmailResponse,
} from "../src/next/index";
import { createValidateEmailHandler } from "../src/next/index";
import type {
  EmailFieldStatus,
  EmailValidationQueryOptions,
  EmailValidationResult,
  LeadMagicProviderProps,
  UseEmailValidation,
  UseEmailValidationOptions,
} from "../src/react/index";
import {
  checkEmail,
  emailValidationQueryOptions,
  useEmailValidation,
} from "../src/react/index";

describe("public types", () => {
  it("methods resolve to their named result types", () => {
    expectTypeOf(
      validateEmail
    ).returns.resolves.toEqualTypeOf<ValidateEmailResult>();
    expectTypeOf(
      findCompany
    ).returns.resolves.toEqualTypeOf<FindCompanyResult>();
    expectTypeOf(getCredits).returns.resolves.toEqualTypeOf<GetCreditsResult>();
    const client = createClient({ apiKey: "lm_live_types" });
    expectTypeOf(
      client.validateEmail
    ).returns.resolves.toEqualTypeOf<ValidateEmailResult>();
  });

  it("checking error narrows data", () => {
    // Never called: the checks run in `tsc`, not at runtime.
    function narrows(
      result: ValidateEmailResult,
      company: FindCompanyResult,
      credits: GetCreditsResult
    ): void {
      expectTypeOf(result.meta).toEqualTypeOf<ResponseMeta>();
      if (result.error) {
        expectTypeOf(result.error).toEqualTypeOf<LeadMagicError>();
        expectTypeOf(result.data).toBeNull();
      } else {
        expectTypeOf(result.data).toEqualTypeOf<EmailValidation>();
        expectTypeOf(result.data.verdict).toEqualTypeOf<EmailVerdict>();
        expectTypeOf(
          result.data.company_location
        ).toEqualTypeOf<EmailCompanyLocation | null>();
      }
      if (!company.error) {
        expectTypeOf(company.data).toEqualTypeOf<CompanyLookup>();
      }
      if (!credits.error) {
        expectTypeOf(credits.data).toEqualTypeOf<Credits>();
      }
    }
    expectTypeOf(narrows).toBeFunction();
  });

  it("error codes autocomplete but accept future codes", () => {
    expectTypeOf<"insufficient_credits">().toExtend<LeadMagicApiErrorCode>();
    expectTypeOf<"timeout">().toExtend<LeadMagicClientErrorCode>();
    expectTypeOf<"some_future_code">().toExtend<LeadMagicErrorCode>();
    expectTypeOf<LeadMagicError["kind"]>().toEqualTypeOf<LeadMagicErrorKind>();
  });

  it("the Next handler and React hook are typed", () => {
    expectTypeOf(createValidateEmailHandler)
      .parameter(0)
      .toEqualTypeOf<ValidateEmailHandlerOptions | undefined>();
    expectTypeOf<
      ValidateEmailResponse["verdict"]
    >().toEqualTypeOf<EmailVerdict>();
    expectTypeOf<
      ValidateEmailEvent["error"]
    >().toEqualTypeOf<LeadMagicError | null>();
    expectTypeOf(useEmailValidation)
      .parameter(0)
      .toEqualTypeOf<UseEmailValidationOptions | undefined>();
    expectTypeOf(
      useEmailValidation
    ).returns.toEqualTypeOf<UseEmailValidation>();
    expectTypeOf<
      UseEmailValidation["status"]
    >().toEqualTypeOf<EmailFieldStatus>();
    expectTypeOf<UseEmailValidation["data"]>().toEqualTypeOf<
      EmailValidationResult | undefined
    >();
    expectTypeOf<UseEmailValidation["error"]>().toEqualTypeOf<Error | null>();
  });

  it("the fetcher, the query options and the provider are typed", () => {
    expectTypeOf(
      checkEmail
    ).returns.resolves.toEqualTypeOf<EmailValidationResult>();
    expectTypeOf(
      emailValidationQueryOptions
    ).returns.toEqualTypeOf<EmailValidationQueryOptions>();
    expectTypeOf<
      EmailValidationResult["verdict"]
    >().toEqualTypeOf<EmailVerdict>();
    // Provider defaults are a subset of the hook's own options.
    expectTypeOf<LeadMagicProviderProps["endpoint"]>().toEqualTypeOf<
      UseEmailValidationOptions["endpoint"]
    >();
    expectTypeOf<LeadMagicProviderProps["queryFn"]>().toEqualTypeOf<
      UseEmailValidationOptions["queryFn"]
    >();
  });
});
