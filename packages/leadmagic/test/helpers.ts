export interface Call {
  body: unknown;
  headers: Record<string, string>;
  method: string;
  url: string;
}

type Reply =
  | { body?: unknown; headers?: Record<string, string>; status?: number }
  | ((
      call: Call,
      signal: AbortSignal | undefined
    ) => Promise<Response> | Response)
  | Error;

/** A fetch that answers from a queue and records every call. */
export function mockFetch(...replies: Reply[]): {
  calls: Call[];
  fetch: typeof fetch;
} {
  const calls: Call[] = [];
  const fn = (async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const headers = Object.fromEntries(new Headers(init.headers).entries());
    const call: Call = {
      url: String(input),
      method: init.method ?? "GET",
      headers,
      body: typeof init.body === "string" ? JSON.parse(init.body) : undefined,
    };
    calls.push(call);
    const reply = replies.length > 1 ? replies.shift() : replies[0];
    if (!reply) {
      throw new Error("mockFetch: no reply queued");
    }
    if (reply instanceof Error) {
      throw reply;
    }
    if (typeof reply === "function") {
      return reply(call, init.signal ?? undefined);
    }
    const status = reply.status ?? 200;
    const isProblem = status >= 400;
    return new Response(
      reply.body === undefined ? null : JSON.stringify(reply.body),
      {
        status,
        headers: {
          "content-type": isProblem
            ? "application/problem+json"
            : "application/json",
          ...reply.headers,
        },
      }
    );
  }) as typeof fetch;
  return { fetch: fn, calls };
}

/** Never answers until aborted. */
export function hangingReply(
  _call: Call,
  signal: AbortSignal | undefined
): Promise<Response> {
  return new Promise((_resolve, reject) => {
    signal?.addEventListener("abort", () => reject(signal.reason), {
      once: true,
    });
  });
}

export function problem(
  status: number,
  code: string,
  extra: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    type: `https://api.leadmagic.io/errors/${code}`,
    title: `title for ${code}`,
    status,
    code,
    detail: `detail for ${code}`,
    trace: {
      request_id: "req_test_123456",
      timestamp: "2026-11-25T00:00:00Z",
      elapsed_ms: 1,
    },
    success: false,
    ...extra,
  };
}

export const VALID_EMAIL_BODY = {
  email: "ada@stripe.com",
  email_status: "valid",
  is_role_based: false,
  credits_consumed: 0.25,
  message: "Email is valid.",
  mx_record: "mx1.stripe.com",
  mx_provider: "Google",
  mx_gateway: null,
  mx_gateway_type: null,
  mx_security_gateway: false,
  company_name: "Stripe",
  company_industry: "Financial Services",
  company_size: "5001-10000",
  company_founded: 2010,
  company_type: "Private",
  company_location: null,
  company_linkedin_url: null,
  company_linkedin_id: null,
  company_facebook_url: null,
  company_twitter_url: null,
};
