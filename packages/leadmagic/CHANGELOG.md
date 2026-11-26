# leadmagic

## 0.3.0

### Minor Changes

- 25a9f21: Sandbox mode is removed. The `sandbox` option, `LEADMAGIC_SANDBOX`, the `sandboxOutcome` request option, the `SandboxOutcome` type, `client.sandbox` and `meta.sandbox` are gone, and every client now needs `LEADMAGIC_API_KEY`. The README links to creating a key.

## 0.2.0

### Minor Changes

- 140e759: `useEmailValidation` takes options in the style of TanStack Query: `enabled`, `staleTime`, `retry`, `retryDelay`, `timeoutMs`, `headers`, `queryFn`, `shouldValidate`, `onSuccess`, `onError`, `onSettled` and `validateOn: "manual"`. It also returns `data`, `error`, `isChecking`, `isDeliverable`, `isUndeliverable` and `isUnknown`.
  
  New in `leadmagic/react`: `LeadMagicProvider` sets options once and lets fields share answers, `checkEmail` is the plain request function, and `emailValidationQueryOptions` plugs the check into TanStack Query.
  
  The route handler adds `skip`, `failOpen` and `verificationPolicy`.
  
  An answer is now reused for 10 minutes by default (`staleTime`) instead of for as long as the field is mounted.
  
  Three input checks no longer use patterns that could run slowly on very long text.

## 0.1.1

### Patch Changes

- No functional change. This is the first version released through npm staged publishing, where a maintainer approves each release before it can be installed.

## 0.1.0

### Minor Changes

- First release: `validateEmail`, `findCompany` and `getCredits`; `createValidateEmailHandler` for Next.js; `useEmailValidation` for React; Sandbox mode. The form route caps checks per visitor and in total; the key is sent over https only and never follows a redirect.
