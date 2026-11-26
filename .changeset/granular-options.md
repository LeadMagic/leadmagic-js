---
"leadmagic": minor
---

`useEmailValidation` takes options in the style of TanStack Query: `enabled`, `staleTime`, `retry`, `retryDelay`, `timeoutMs`, `headers`, `queryFn`, `shouldValidate`, `onSuccess`, `onError`, `onSettled` and `validateOn: "manual"`. It also returns `data`, `error`, `isChecking`, `isDeliverable`, `isUndeliverable` and `isUnknown`.

New in `leadmagic/react`: `LeadMagicProvider` sets options once and lets fields share answers, `checkEmail` is the plain request function, and `emailValidationQueryOptions` plugs the check into TanStack Query.

The route handler adds `skip`, `failOpen` and `verificationPolicy`.

An answer is now reused for 10 minutes by default (`staleTime`) instead of for as long as the field is mounted.

Three input checks no longer use patterns that could run slowly on very long text.
