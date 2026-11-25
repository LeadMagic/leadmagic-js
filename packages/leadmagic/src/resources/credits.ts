import type { RequestOptions, Result, TransportConfig } from "../http";
import { send } from "../http";

export interface Credits {
  /** Credits you can spend now. */
  available: number;
  /** True when credits are paused (for example, a past-due subscription). */
  frozen: boolean;
  /** The API's full response. */
  raw: Record<string, unknown>;
}

function n(value: unknown): number | undefined {
  const v = Number(value);
  return value !== null && value !== undefined && Number.isFinite(v)
    ? v
    : undefined;
}

export function toCredits(body: Record<string, unknown>): Credits {
  return {
    available:
      n(body.credits_available) ??
      n(body.available_credits) ??
      n(body.credits) ??
      0,
    frozen: body.is_frozen === true,
    raw: body,
  };
}

/** `GET /v1/credits`. Free. */
export async function getCreditsWith(
  config: TransportConfig,
  options: RequestOptions = {}
): Promise<Result<Credits>> {
  const result = await send<Record<string, unknown>>(
    config,
    "GET",
    "/v1/credits",
    undefined,
    options
  );
  if (result.error) {
    return result;
  }
  return { ...result, data: toCredits(result.data) };
}
