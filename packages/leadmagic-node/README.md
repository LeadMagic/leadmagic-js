# leadmagic-node

The LeadMagic API for Node.js, Bun, Deno and edge runtimes: typed methods, one result shape, and one error contract for every endpoint.

```bash
npm install leadmagic-node
```

```ts
import { LeadMagic } from "leadmagic-node";

const lm = new LeadMagic(); // reads LEADMAGIC_API_KEY

const { data, found, error } = await lm.email.find({
  firstName: "Ada",
  lastName: "Lovelace",
  domain: "stripe.com",
});

if (error) {
  console.error(error.kind, error.code, error.message);
} else if (found) {
  console.log(data.email);
}
```

## Methods

| Namespace              | Methods                                                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `email`                | `validate`, `find`, `findPersonal`, `fromProfile`                                                                |
| `people`               | `search`, `searchAll`, `getProfile`, `fromEmail`, `findMobile`, `findByRole`, `findEmployees`, `detectJobChange` |
| `companies`            | `search`, `searchAll`, `find`, `lookalikes`, `funding`, `competitors`, `technographics`                          |
| `localLeads`           | `search`, `searchAll`, `categories`                                                                              |
| `jobs`                 | `search`, `searchAll`, `export`, `resolveFilters`, `searchStats`, `stats`, `lookup.*`, `catalog.*`               |
| `ads`                  | `google`, `meta`, `b2b`, `b2bDetails`                                                                            |
| `credits`, `analytics` | `credits.get`, `analytics.dashboard`, `usage`, `products`, `credits`, `summary`, `daily`, `day`                  |

Anything else: `lm.request({ method, path, body })` sends it with the same key, retries and errors.

## Results

Every method resolves to `{ data, error, meta }` and never throws after the client is created.

- `data` is the API's response, with the field names from the [API reference](https://leadmagic.io/docs/api-reference).
- Lookups add `found`: whether the API returned what you asked for. A miss is free.
- Lists add `page`: `{ items, hasMore, nextCursor, nextOffset }`, the same for every endpoint.
- `meta` has `requestId`, `credits.consumed`, `credits.remaining`, `rateLimit` and `deprecation`.

Inputs are camelCase and use one name per idea: `domain`, `companyName`, `profileUrl`.

## Pages

```ts
for await (const person of lm.people.searchAll(
  { domain: "stripe.com", titles: ["VP Sales"] },
  { maxItems: 200 }
)) {
  console.log(person.contact_full_name);
}
```

`maxItems` is required: search is billed per row.

## Errors

`error.kind` says what to do: `config`, `auth`, `billing`, `rate_limit`, `invalid_input`, `not_found`, `conflict` or `unavailable`. `error.code` is the API's stable code, `error.issues` lists every invalid field, `error.context` carries details such as `credits_required`, and `error.requestId` is what support needs.

The client retries 429, 502, 503, 504 and network errors with the same idempotency key, so a retried call is never billed twice.

## Schemas

```ts
import { peopleSchemas } from "leadmagic-node/zod";

peopleSchemas.findByRole.parse(req.body);
```

`leadmagic-node/zod` has a Zod schema for every method's input, with the same checks and messages as the client. Zod 4 schemas implement Standard Schema, so they work with tRPC, TanStack Form, Hono and the AI SDK.

## Sandbox

`new LeadMagic({ sandbox: true })` talks to the public Sandbox: synthetic data, no key, no credits.
