import { clientError } from "./errors";

export const DEFAULT_BASE_URL = "https://api.leadmagic.io";
export const SANDBOX_BASE_URL = "https://leadmagic.io/playground/api/sandbox";
export const API_KEYS_URL = "https://app.leadmagic.io/settings/api";

/** Env var names that a framework would inline into browser bundles. */
const PUBLIC_KEY_VARS = [
  "NEXT_PUBLIC_LEADMAGIC_API_KEY",
  "VITE_LEADMAGIC_API_KEY",
  "PUBLIC_LEADMAGIC_API_KEY",
  "REACT_APP_LEADMAGIC_API_KEY",
  "EXPO_PUBLIC_LEADMAGIC_API_KEY",
  "NUXT_PUBLIC_LEADMAGIC_API_KEY",
] as const;

const TRAILING_SLASHES = /\/+$/u;
/** Printable ASCII without spaces: what an HTTP header value can carry safely. */
const HEADER_SAFE = /^[\x21-\x7e]+$/u;
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

/** True for https, and for http on this machine (local proxies and tests). */
function isSafeKeyDestination(baseUrl: string): boolean {
  try {
    const url = new URL(baseUrl);
    return (
      url.protocol === "https:" ||
      (url.protocol === "http:" && LOCAL_HOSTS.has(url.hostname))
    );
  } catch {
    return false;
  }
}

/** Reads an env var without assuming `process` exists (Workers, Deno, browsers). */
export function readEnv(name: string): string | undefined {
  try {
    const value = (
      globalThis as { process?: { env?: Record<string, string | undefined> } }
    ).process?.env?.[name];
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
  } catch {
    // Some runtimes throw on `process.env` access; treat that as unset.
  }
}

export function isBrowser(): boolean {
  const g = globalThis as { window?: unknown; document?: unknown };
  return typeof g.window !== "undefined" && typeof g.document !== "undefined";
}

function isProduction(): boolean {
  return readEnv("NODE_ENV") === "production";
}

function truthy(value: string | undefined): boolean {
  return value === "1" || value?.toLowerCase() === "true";
}

export interface ResolveOptions {
  apiKey?: string;
  baseUrl?: string;
  sandbox?: boolean;
}

export interface ResolvedConfig {
  apiKey: string | undefined;
  baseUrl: string;
  sandbox: boolean;
}

let warnedPublicKey = false;
let warnedSandbox = false;

/**
 * Works out the key, base URL and mode. Throws a `config` LeadMagicError when
 * the setup would leak the key or cannot authenticate. These are programming
 * errors, so they throw instead of coming back in `{ error }`.
 */
export function resolveConfig(options: ResolveOptions = {}): ResolvedConfig {
  const sandbox = options.sandbox ?? truthy(readEnv("LEADMAGIC_SANDBOX"));
  const baseUrl = (
    options.baseUrl ??
    readEnv("LEADMAGIC_BASE_URL") ??
    (sandbox ? SANDBOX_BASE_URL : DEFAULT_BASE_URL)
  ).replace(TRAILING_SLASHES, "");

  if (sandbox) {
    // The Sandbox needs no key and returns synthetic data, so it is safe anywhere.
    if (isProduction() && !isBrowser() && !warnedSandbox) {
      warnedSandbox = true;
      console.warn(
        "[leadmagic] Sandbox mode is on in production: every answer is synthetic, so no email is really checked. Unset LEADMAGIC_SANDBOX and set LEADMAGIC_API_KEY to go live."
      );
    }
    return { apiKey: undefined, baseUrl, sandbox };
  }

  if (isBrowser()) {
    throw clientError(
      "browser_runtime",
      "LeadMagic API keys must stay on the server. Call LeadMagic from a route handler or server action, and use `leadmagic/react` in the browser."
    );
  }

  const exposed = PUBLIC_KEY_VARS.find((name) => readEnv(name));
  if (exposed) {
    const message = `${exposed} is set. Variables with this prefix are bundled into client code, which publishes your API key. Rename it to LEADMAGIC_API_KEY and rotate the key at ${API_KEYS_URL}.`;
    if (!isProduction()) {
      throw clientError("public_api_key", message);
    }
    if (!warnedPublicKey) {
      warnedPublicKey = true;
      console.warn(`[leadmagic] ${message}`);
    }
  }

  const apiKey = options.apiKey?.trim() || readEnv("LEADMAGIC_API_KEY");
  if (!apiKey) {
    throw clientError(
      "missing_api_key",
      `No LeadMagic API key. Set LEADMAGIC_API_KEY on the server (create one at ${API_KEYS_URL}), pass { apiKey }, or set LEADMAGIC_SANDBOX=1 to use synthetic data without a key.`
    );
  }
  // Checked here so the key never reaches a header error, which would print it.
  if (!HEADER_SAFE.test(apiKey)) {
    throw clientError(
      "malformed_api_key",
      `The LeadMagic API key contains a space, line break or other character that cannot be sent. Copy it again from ${API_KEYS_URL}.`
    );
  }
  if (!isSafeKeyDestination(baseUrl)) {
    throw clientError(
      "insecure_base_url",
      "The base URL must use https, so the API key is never sent in clear text. Plain http is allowed for localhost only."
    );
  }

  return { apiKey, baseUrl, sandbox };
}

/** For tests. */
export function resetEnvWarnings(): void {
  warnedPublicKey = false;
  warnedSandbox = false;
}
