# Next.js signup example

A signup form built with [shadcn/ui](https://ui.shadcn.com) that validates the email with LeadMagic:

- [`app/api/leadmagic/validate-email/route.ts`](app/api/leadmagic/validate-email/route.ts): the route the form calls.
- [`components/email-field.tsx`](components/email-field.tsx): the email field from `npx shadcn add https://leadmagic.io/docs/r/email-field.json`, checked when it loses focus.
- [`app/signup-form.tsx`](app/signup-form.tsx): the form.
- [`app/actions.ts`](app/actions.ts): the server action that checks again on submit.

## Run it

Create `examples/next-signup/.env.local` with your key ([create one](https://app.leadmagic.io/settings/api)):

```bash
LEADMAGIC_API_KEY=lm_live_...
```

Then, from the repository root:

```bash
pnpm install
pnpm build
pnpm -F next-signup-example dev
```

Open [http://localhost:3333](http://localhost:3333).

See [Validate emails in Next.js forms](https://leadmagic.io/docs/sdk/nextjs-forms) for the full guide.
