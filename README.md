# leadmagic-js

The [`leadmagic`](packages/leadmagic) npm package and its Next.js example.

| Path                   |                                                              |
| ---------------------- | ------------------------------------------------------------ |
| `packages/leadmagic`   | The SDK: `leadmagic`, `leadmagic/next`, `leadmagic/react`    |
| `registry/`            | The shadcn email field, built to `public/r/email-field.json` |
| `examples/next-signup` | A waitlist form that runs on the Sandbox with no key         |

## Develop

```bash
pnpm install
pnpm check            # lint, typecheck, tests, build, package checks
pnpm test:contract    # against the public Sandbox
pnpm -F next-signup-example dev
```

After changing `registry/email-field.tsx`, run `pnpm registry:build`.

## Release

Add a changeset with `pnpm changeset`. On `main`, the release workflow opens a version PR; merging it publishes to npm with provenance.
