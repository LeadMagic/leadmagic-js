const MAX_TRACKED_IPS = 10_000;

/** Counts hits per key in fixed windows. Memory is bounded. */
export class WindowCounter {
  readonly #hits = new Map<string, { count: number; resets: number }>();
  readonly #windowMs: number;

  constructor(windowMs: number) {
    this.#windowMs = windowMs;
  }

  /** Counts one hit. False once `key` has passed `limit` in this window. */
  take(key: string, limit: number): boolean {
    const now = Date.now();
    const hit = this.#hits.get(key);
    if (hit && hit.resets > now) {
      hit.count += 1;
      return hit.count <= limit;
    }
    this.#hits.delete(key);
    if (this.#hits.size >= MAX_TRACKED_IPS) {
      this.#makeRoom(now);
    }
    this.#hits.set(key, { count: 1, resets: now + this.#windowMs });
    return limit >= 1;
  }

  #makeRoom(now: number): void {
    for (const [key, hit] of this.#hits) {
      if (hit.resets <= now) {
        this.#hits.delete(key);
      }
    }
    if (this.#hits.size >= MAX_TRACKED_IPS) {
      const oldest = this.#hits.keys().next().value;
      if (oldest !== undefined) {
        this.#hits.delete(oldest);
      }
    }
  }
}

function firstValue(header: string | null): string | undefined {
  return header?.split(",")[0]?.trim() || undefined;
}

/**
 * The visitor's IP as the hosting platform reports it. Best effort: where no
 * platform sets these headers a caller can forge them, which is why the
 * `total` cap exists.
 */
export function clientIp(request: Request): string | undefined {
  const { headers } = request;
  const agent = (globalThis as { navigator?: { userAgent?: string } }).navigator
    ?.userAgent;
  if (agent === "Cloudflare-Workers") {
    return firstValue(headers.get("cf-connecting-ip"));
  }
  return (
    firstValue(headers.get("x-real-ip")) ??
    firstValue(headers.get("x-forwarded-for"))
  );
}
