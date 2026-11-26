export type { EmailVerdict } from "../resources/email";
export {
  type CheckEmailOptions,
  checkEmail,
  EmailCheckError,
  type EmailValidationQueryOptions,
  type EmailValidationResult,
  emailValidationQueryOptions,
  type RequestHeaders,
} from "./check-email";
export {
  type EmailValidationDefaults,
  LeadMagicProvider,
  type LeadMagicProviderProps,
} from "./provider";
export {
  type EmailFieldStatus,
  type EmailInputProps,
  type UseEmailValidation,
  type UseEmailValidationOptions,
  useEmailValidation,
} from "./use-email-validation";
