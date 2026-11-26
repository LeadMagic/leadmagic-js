# Security policy

## Report a vulnerability

Please do not open a public issue, discussion or pull request for a security problem.

1. **GitHub** (preferred): use [Report a vulnerability](https://github.com/LeadMagic/leadmagic-js/security/advisories/new) on the Security tab.
2. **Email**: security@leadmagic.io.

Include the affected version, steps to reproduce and the impact you expect. We aim to acknowledge reports within 48 hours and to give a first assessment within 5 business days.

If you think your LeadMagic API key has leaked, rotate it now at [app.leadmagic.io/settings/api](https://app.leadmagic.io/settings/api); you do not need to wait for us.

## Supported versions

The latest release on npm.

## How the package protects you

**Your API key**

- The SDK refuses to run in a browser with a key, and refuses keys in variables that frameworks bundle into client code, such as `NEXT_PUBLIC_LEADMAGIC_API_KEY`.
- The key is sent to `https` only (plain `http` is allowed for localhost), and never follows a redirect to another host.
- The key is never written to logs or error messages.

**The form route (`leadmagic/next`)**

- Answers same-origin JSON requests only, with a 2 kB body limit.
- Returns `{ verdict, roleBased }` and nothing else from the API.
- Caps checks per visitor and in total, and caches answers, so the route cannot be used to drain credits quickly. Add `protect` for bot detection or a shared rate limiter.

**The package itself**

- No runtime dependencies and no install scripts.
- Published from GitHub Actions with npm trusted publishing and [provenance](https://docs.npmjs.com/generating-provenance-statements), so each version links to the commit and workflow that built it. Check it with `npm audit signatures`.
