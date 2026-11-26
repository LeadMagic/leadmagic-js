# Contributing

Thanks for helping improve the LeadMagic SDK. Bug reports and pull requests are welcome.

- **Bugs and ideas:** open an [issue](https://github.com/LeadMagic/leadmagic-js/issues). Include the SDK version, your runtime and the `requestId` from the error if you have one.
- **Security problems:** follow [SECURITY.md](SECURITY.md). Please do not open a public issue.
- **Account or billing questions:** use the [Help Center](https://leadmagic.io/help).

## Set up

You need Node.js 20 or later and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm check            # lint, typecheck, tests, build and package checks
pnpm test:contract    # the SDK against the public Sandbox (needs the network)
pnpm -F next-signup-example dev
```

No API key is needed: the tests use a mock `fetch`, and the example runs on the Sandbox.

## Send a change

1. Create a branch and make your change. Add or update a test with it.
2. Run `pnpm check`.
3. If the change affects the published package, run `pnpm changeset` and describe it in one or two sentences. That text becomes the changelog entry.
4. Open a pull request.

After changing `registry/email-field.tsx`, run `pnpm registry:build` so the example and the published registry file stay in step.

## Releases

Maintainers release by merging the "release" pull request that the release workflow opens when changesets are waiting on `main`. Merging it stages the new version on npm with provenance. A maintainer then approves it on npmjs.com, and only then can it be installed.
