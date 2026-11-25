# leadmagic

The official JavaScript SDK for [LeadMagic](https://leadmagic.io). Validate emails and look up companies from Node.js, Next.js, Bun, Deno or Cloudflare Workers.

```bash
npm install leadmagic
```

```ts
import { validateEmail } from "leadmagic";

const { data, error } = await validateEmail("alex@example.com");
if (data) console.log(data.verdict); // "deliverable" | "undeliverable" | "unknown"
```

Set `LEADMAGIC_API_KEY` on your server. The SDK refuses to run in a browser with a key, and refuses `NEXT_PUBLIC_LEADMAGIC_API_KEY`. No key yet? Set `LEADMAGIC_SANDBOX=1` for synthetic data and no credits.

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

The route answers same-origin requests only, returns `{ verdict, roleBased }`, caches answers, and answers `unknown` when LeadMagic can't, so signups never block.

## Imports

| Import            |                                                              |
| ----------------- | ------------------------------------------------------------ |
| `leadmagic`       | `validateEmail`, `findCompany`, `getCredits`, `createClient` |
| `leadmagic/next`  | `createValidateEmailHandler`                                 |
| `leadmagic/react` | `useEmailValidation`                                         |

Every call returns `{ data, error, meta }` and never throws for API or network failures. Branch on `error.kind`: `config`, `auth`, `billing`, `rate_limit`, `invalid_input` or `unavailable`.

## Docs

- [JavaScript SDK](https://leadmagic.io/docs/sdk/introduction)
- [Validate emails in Next.js forms](https://leadmagic.io/docs/sdk/nextjs-forms)
- [Errors](https://leadmagic.io/docs/sdk/errors)
- [Example app](https://github.com/LeadMagic/leadmagic-js/tree/main/examples/next-signup)

## License

MIT
