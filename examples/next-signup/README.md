# Next.js signup example

A signup form that validates the email with LeadMagic. It shows the three pieces together:

- [`app/api/leadmagic/validate-email/route.ts`](app/api/leadmagic/validate-email/route.ts): the route your form calls.
- [`components/email-field.tsx`](components/email-field.tsx): the email field, checked when it loses focus.
- [`app/actions.ts`](app/actions.ts): the server action that checks again on submit.

## Run it

From the repository root:

```bash
pnpm install
pnpm build
pnpm -F next-signup-example dev
```

Open [http://localhost:3333](http://localhost:3333). The example runs on the Sandbox, so it needs no API key and uses no credits.

To use the real API, create `examples/next-signup/.env.local`:

```bash
LEADMAGIC_SANDBOX=0
LEADMAGIC_API_KEY=lm_live_...
```

See [Validate emails in Next.js forms](https://leadmagic.io/docs/sdk/nextjs-forms) for the full guide.
