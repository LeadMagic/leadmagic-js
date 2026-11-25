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

/** Shows the last four characters only, never the key. */
export function maskKey(key: string): string {
  return key.length > 8 ? `…${key.slice(-4)}` : "…";
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

  return { apiKey, baseUrl, sandbox };
}

/** For tests. */
export function resetEnvWarnings(): void {
  warnedPublicKey = false;
}
