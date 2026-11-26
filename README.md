# LeadMagic for JavaScript

[![npm](https://img.shields.io/npm/v/leadmagic)](https://www.npmjs.com/package/leadmagic)
[![CI](https://github.com/LeadMagic/leadmagic-js/actions/workflows/ci.yml/badge.svg)](https://github.com/LeadMagic/leadmagic-js/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/npm/l/leadmagic)](LICENSE)

The official [LeadMagic](https://leadmagic.io) SDK for JavaScript and TypeScript. Validate emails and look up companies from your server, and add email validation to a Next.js form in three files.

```bash
npm install leadmagic
```

```ts
import { validateEmail } from "leadmagic";

const { data, error } = await validateEmail("alex@example.com");
if (data) console.log(data.verdict); // "deliverable" | "undeliverable" | "unknown"
```

Set `LEADMAGIC_API_KEY` on your server. No key yet? [Create an API key](https://app.leadmagic.io/settings/api).

## What is in the package

| Import            | Use it for                                                              |
| ----------------- | ----------------------------------------------------------------------- |
| `leadmagic`       | `validateEmail`, `findCompany` and `getCredits` from any server runtime |
| `leadmagic/next`  | A Route Handler that validates emails for your forms                    |
| `leadmagic/react` | `useEmailValidation`, a headless hook for email fields                  |

It runs on Node.js 20+, Bun, Deno, Cloudflare Workers and Vercel Functions. Types are included, and the package has no runtime dependencies.

## Documentation

- [Introduction](https://leadmagic.io/docs/sdk/introduction)
- [Validate emails in Next.js forms](https://leadmagic.io/docs/sdk/nextjs-forms)
- [Reference](https://leadmagic.io/docs/sdk/reference)
- [Errors](https://leadmagic.io/docs/sdk/errors)
- [Sandbox and testing](https://leadmagic.io/docs/sdk/sandbox)
- [Keeping your key safe](https://leadmagic.io/docs/sdk/security)

## In this repository

| Path                                           |                                                   |
| ---------------------------------------------- | ------------------------------------------------- |
| [`packages/leadmagic`](packages/leadmagic)     | The SDK                                           |
| [`examples/next-signup`](examples/next-signup) | A Next.js signup form built with shadcn/ui        |
| [`registry`](registry)                         | The email field you install with `npx shadcn add` |

## Contributing and security

See [CONTRIBUTING.md](CONTRIBUTING.md) to set up the repository and send a change. To report a security problem, follow [SECURITY.md](SECURITY.md) instead of opening an issue.

## License

[MIT](LICENSE)
