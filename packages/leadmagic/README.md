# leadmagic

The official JavaScript and TypeScript SDK for [LeadMagic](https://leadmagic.io). Validate emails and look up companies from Node.js, Next.js, Bun, Deno or Cloudflare Workers. Types are included; there is no `@types` package to install.

```bash
npm install leadmagic
```

```ts
import { validateEmail } from "leadmagic";

const { data, error } = await validateEmail("alex@example.com");
if (data) console.log(data.verdict); // "deliverable" | "undeliverable" | "unknown"
```

Set `LEADMAGIC_API_KEY` on your server. The SDK refuses to run in a browser with a key, and refuses `NEXT_PUBLIC_LEADMAGIC_API_KEY`. No key yet? [Create an API key](https://app.leadmagic.io/settings/api).

## Next.js forms

```ts
// app/api/leadmagic/validate-email/route.ts
import { createValidateEmailHandler } from "leadmagic/next";

export const POST = createValidateEmailHandler();
```

```tsx
"use client";
import { useEmailValidation } from "leadmagic/react";

export function EmailInput() {
  const email = useEmailValidation();
  return <input type="email" name="email" {...email.inputProps} />;
}
```

Or install the ready-made field: `npx shadcn@latest add https://leadmagic.io/docs/r/email-field.json`.

The route answers same-origin requests only, returns `{ verdict, roleBased }`, caches answers, caps checks per visitor and in total, and answers `unknown` when LeadMagic can't, so signups never block. Anyone who loads your page can call it, so add bot detection or a shared rate limiter with `protect`.

### Options

The hook takes options in the style of TanStack Query. Every one is optional:

```tsx
const email = useEmailValidation({
  endpoint: "/api/forms/check-email", // wherever you mounted the route
  validateOn: "change", // "blur" (default), "change" or "manual"
  staleTime: 60_000, // reuse an answer for a minute
  retry: 1,
  headers: async () => ({ "x-bot-token": await getToken() }),
  onSuccess: (result) => track("email_checked", result),
});

email.data; // { email, verdict, roleBased } | undefined
email.error; // why the last check failed, or null
email.isChecking; // also isDeliverable, isUndeliverable, isUnknown
```

- **No route?** Pass `queryFn` to call a server action or your own API instead: `useEmailValidation({ queryFn: (email) => checkEmailAction(email) })`.
- **Shared defaults:** wrap your app in `<LeadMagicProvider endpoint="…">` to set options once. Fields under it share answers, so an address is asked about once.
- **Already on TanStack Query?** `useQuery(emailValidationQueryOptions(email))` gives you its cache, retries and devtools.
- **Another framework?** `checkEmail(email, options)` is the plain function underneath.

The route has its own options too: `allowedOrigins`, `protect`, `rateLimit`, `cache`, `skip`, `failOpen`, `verificationPolicy`, `timeoutMs` and `onResult`. See the [reference](https://leadmagic.io/docs/sdk/nextjs-forms#route-options).

## Imports

| Import            |                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------- |
| `leadmagic`       | `validateEmail`, `findCompany`, `getCredits`, `createClient`                           |
| `leadmagic/next`  | `createValidateEmailHandler`                                                           |
| `leadmagic/react` | `useEmailValidation`, `LeadMagicProvider`, `checkEmail`, `emailValidationQueryOptions` |

Every call returns `{ data, error, meta }` and never throws for API or network failures. Branch on `error.kind`: `config`, `auth`, `billing`, `rate_limit`, `invalid_input` or `unavailable`.

## TypeScript

Checking `error` narrows `data`, so no casts are needed:

```ts
import { validateEmail, type ValidateEmailResult } from "leadmagic";

const result: ValidateEmailResult = await validateEmail("alex@example.com");
if (!result.error) {
  result.data.verdict; // "deliverable" | "undeliverable" | "unknown"
}
```

Every response, option and error code is exported as a type from the entry it belongs to. `error.code` autocompletes the documented codes and still accepts codes the API adds later. Full list: [Types](https://leadmagic.io/docs/sdk/reference#types).

## Security

The key is sent over `https` only, never follows a redirect and never appears in an error message. The package has no runtime dependencies and no install scripts, and each version is published with [provenance](https://docs.npmjs.com/generating-provenance-statements). See [Security](https://leadmagic.io/docs/sdk/security) and the [security policy](https://github.com/LeadMagic/leadmagic-js/blob/main/SECURITY.md).

## Docs

- [JavaScript SDK](https://leadmagic.io/docs/sdk/introduction)
- [Validate emails in Next.js forms](https://leadmagic.io/docs/sdk/nextjs-forms)
- [Errors](https://leadmagic.io/docs/sdk/errors)
- [Example app](https://github.com/LeadMagic/leadmagic-js/tree/main/examples/next-signup)

## License

MIT
