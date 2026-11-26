// @vitest-environment happy-dom
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  checkEmail,
  EmailCheckError,
  emailValidationQueryOptions,
  LeadMagicProvider,
  useEmailValidation,
} from "../src/react/index";

function reply(body: unknown, status = 200) {
  return vi.fn(async (_url?: unknown, _init?: unknown) =>
    Response.json(body, { status })
  );
}

const field = (value: string) => ({ currentTarget: { value } });

describe("useEmailValidation", () => {
  it("checks on blur and reports the verdict", async () => {
    const fetchImpl = reply({ verdict: "undeliverable", roleBased: false });
    const { result } = renderHook(() =>
      useEmailValidation({ fetch: fetchImpl })
    );

    act(() => result.current.inputProps.onBlur(field("ada@stripe.com")));
    expect(result.current.status).toBe("checking");
    expect(result.current.inputProps["aria-busy"]).toBe(true);

    await waitFor(() => expect(result.current.status).toBe("undeliverable"));
    expect(result.current.inputProps["aria-invalid"]).toBe(true);
    expect(fetchImpl).toHaveBeenCalledWith(
      "/api/leadmagic/validate-email",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "ada@stripe.com" }),
      })
    );
  });

  it("does not call the route for text that is not an address", async () => {
    const fetchImpl = reply({ verdict: "deliverable" });
    const { result } = renderHook(() =>
      useEmailValidation({ fetch: fetchImpl })
    );
    let verdict: string | undefined;
    await act(async () => {
      verdict = await result.current.validate("ada@");
    });
    expect(verdict).toBe("undeliverable");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("resolves unknown when the route fails", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new TypeError("offline");
    });
    const { result } = renderHook(() =>
      useEmailValidation({ fetch: fetchImpl })
    );
    let verdict: string | undefined;
    await act(async () => {
      verdict = await result.current.validate("ada@stripe.com");
    });
    expect(verdict).toBe("unknown");
    expect(result.current.status).toBe("unknown");
  });

  it("clears the verdict when the visitor edits the address", async () => {
    const fetchImpl = reply({ verdict: "undeliverable", roleBased: false });
    const { result } = renderHook(() =>
      useEmailValidation({ fetch: fetchImpl })
    );
    await act(async () => {
      await result.current.validate("ada@stripe.con");
    });
    expect(result.current.status).toBe("undeliverable");

    act(() => result.current.inputProps.onChange(field("ada@stripe.com")));
    expect(result.current.status).toBe("idle");
  });

  it("reuses answers for the same address", async () => {
    const fetchImpl = reply({ verdict: "deliverable", roleBased: true });
    const { result } = renderHook(() =>
      useEmailValidation({ fetch: fetchImpl })
    );
    await act(async () => {
      await result.current.validate("info@stripe.com");
      await result.current.validate("INFO@stripe.com");
    });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(result.current.roleBased).toBe(true);
  });

  it("debounces while typing when validateOn is change", async () => {
    vi.useFakeTimers();
    const fetchImpl = reply({ verdict: "deliverable" });
    const { result } = renderHook(() =>
      useEmailValidation({
        fetch: fetchImpl,
        validateOn: "change",
        debounceMs: 300,
      })
    );
    act(() => {
      result.current.inputProps.onChange(field("ada@stripe.c"));
      result.current.inputProps.onChange(field("ada@stripe.co"));
      result.current.inputProps.onChange(field("ada@stripe.com"));
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });
    vi.useRealTimers();
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(fetchImpl.mock.calls[0]).toBeDefined();
  });

  it("ignores a stale answer after a newer check", async () => {
    let resolveFirst: ((value: Response) => void) | undefined;
    const fetchImpl = vi
      .fn()
      .mockImplementationOnce(
        (_url: string, init: RequestInit) =>
          new Promise<Response>((resolve, reject) => {
            resolveFirst = resolve;
            init.signal?.addEventListener("abort", () =>
              reject(new DOMException("aborted", "AbortError"))
            );
          })
      )
      .mockImplementationOnce(async () =>
        Response.json({ verdict: "deliverable", roleBased: false })
      );
    const { result } = renderHook(() =>
      useEmailValidation({ fetch: fetchImpl })
    );

    await act(async () => {
      result.current.validate("first@stripe.com");
      await result.current.validate("second@stripe.com");
    });
    resolveFirst?.(Response.json({ verdict: "undeliverable" }));
    expect(result.current.status).toBe("deliverable");
  });
});

describe("request options", () => {
  it("calls a custom endpoint with extra headers", async () => {
    const fetchImpl = reply({ verdict: "deliverable", roleBased: false });
    const { result } = renderHook(() =>
      useEmailValidation({
        fetch: fetchImpl,
        endpoint: "/api/forms/check-email",
        headers: async () => ({ "x-bot-token": "abc" }),
      })
    );
    await act(async () => {
      await result.current.validate("ada@stripe.com");
    });
    expect(fetchImpl).toHaveBeenCalledWith(
      "/api/forms/check-email",
      expect.objectContaining({
        headers: {
          "x-bot-token": "abc",
          "content-type": "application/json",
        },
      })
    );
  });

  it("uses queryFn instead of the route", async () => {
    const fetchImpl = reply({ verdict: "deliverable" });
    const queryFn = vi.fn(async (_email: string) => ({
      verdict: "undeliverable" as const,
      roleBased: true,
    }));
    const { result } = renderHook(() =>
      useEmailValidation({ fetch: fetchImpl, queryFn })
    );
    await act(async () => {
      await result.current.validate("info@stripe.com");
    });
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(queryFn).toHaveBeenCalledWith(
      "info@stripe.com",
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
    expect(result.current.data).toEqual({
      email: "info@stripe.com",
      verdict: "undeliverable",
      roleBased: true,
    });
    expect(result.current.isUndeliverable).toBe(true);
  });

  it("gives up after timeoutMs and reports why", async () => {
    const fetchImpl = vi.fn(
      (_url: string, init: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init.signal?.addEventListener("abort", () =>
            reject(new DOMException("aborted", "AbortError"))
          );
        })
    );
    const { result } = renderHook(() =>
      useEmailValidation({ fetch: fetchImpl as typeof fetch, timeoutMs: 20 })
    );
    await act(async () => {
      await result.current.validate("ada@stripe.com");
    });
    expect(result.current.status).toBe("unknown");
    expect(result.current.error?.message).toContain("20 ms");
  });
});

describe("when the field checks", () => {
  it("does not check by itself when enabled is false, but validate() does", async () => {
    const fetchImpl = reply({ verdict: "deliverable", roleBased: false });
    const { result } = renderHook(() =>
      useEmailValidation({ fetch: fetchImpl, enabled: false })
    );
    act(() => result.current.inputProps.onBlur(field("ada@stripe.com")));
    expect(result.current.status).toBe("idle");
    expect(fetchImpl).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.validate("ada@stripe.com");
    });
    expect(result.current.isDeliverable).toBe(true);
  });

  it("leaves checking to you when validateOn is manual", () => {
    const fetchImpl = reply({ verdict: "deliverable" });
    const { result } = renderHook(() =>
      useEmailValidation({ fetch: fetchImpl, validateOn: "manual" })
    );
    act(() => result.current.inputProps.onBlur(field("ada@stripe.com")));
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("skips addresses that shouldValidate turns down", async () => {
    const fetchImpl = reply({ verdict: "undeliverable" });
    const { result } = renderHook(() =>
      useEmailValidation({
        fetch: fetchImpl,
        shouldValidate: (email) => !email.endsWith("@ourcompany.com"),
      })
    );
    let verdict: string | undefined;
    await act(async () => {
      verdict = await result.current.validate("me@ourcompany.com");
    });
    expect(verdict).toBe("unknown");
    expect(result.current.isUnknown).toBe(true);
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});

describe("caching and retries", () => {
  it("asks again once staleTime has passed", async () => {
    const fetchImpl = reply({ verdict: "deliverable", roleBased: false });
    const { result } = renderHook(() =>
      useEmailValidation({ fetch: fetchImpl, staleTime: 0 })
    );
    await act(async () => {
      await result.current.validate("ada@stripe.com");
      await result.current.validate("ada@stripe.com");
    });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("retries a failed request, then succeeds", async () => {
    const fetchImpl = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("offline"))
      .mockResolvedValueOnce(new Response("busy", { status: 503 }))
      .mockResolvedValueOnce(
        Response.json({ verdict: "deliverable", roleBased: false })
      );
    const { result } = renderHook(() =>
      useEmailValidation({ fetch: fetchImpl, retry: 2, retryDelay: 0 })
    );
    await act(async () => {
      await result.current.validate("ada@stripe.com");
    });
    expect(fetchImpl).toHaveBeenCalledTimes(3);
    expect(result.current.status).toBe("deliverable");
    expect(result.current.error).toBeNull();
  });

  it("does not retry a refusal from the route", async () => {
    const fetchImpl = reply({ error: "Request refused." }, 403);
    const { result } = renderHook(() =>
      useEmailValidation({ fetch: fetchImpl, retry: 3, retryDelay: 0 })
    );
    await act(async () => {
      await result.current.validate("ada@stripe.com");
    });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBeInstanceOf(EmailCheckError);
    expect((result.current.error as EmailCheckError).status).toBe(403);
  });
});

describe("callbacks", () => {
  it("reports success, failure and settlement", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json({ verdict: "deliverable", roleBased: false })
      )
      .mockRejectedValueOnce(new TypeError("offline"));
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const onSettled = vi.fn();
    const { result } = renderHook(() =>
      useEmailValidation({ fetch: fetchImpl, onSuccess, onError, onSettled })
    );

    await act(async () => {
      await result.current.validate("ada@stripe.com");
    });
    const answer = {
      email: "ada@stripe.com",
      verdict: "deliverable",
      roleBased: false,
    };
    expect(onSuccess).toHaveBeenCalledWith(answer);
    expect(onSettled).toHaveBeenLastCalledWith(answer, null, "ada@stripe.com");

    await act(async () => {
      await result.current.validate("bob@stripe.com");
    });
    expect(onError).toHaveBeenCalledWith(
      expect.any(EmailCheckError),
      "bob@stripe.com"
    );
    expect(onSettled).toHaveBeenLastCalledWith(
      undefined,
      expect.any(EmailCheckError),
      "bob@stripe.com"
    );
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});

describe("LeadMagicProvider", () => {
  it("sets defaults, shares one cache, and lets a hook override", async () => {
    const fetchImpl = reply({ verdict: "deliverable", roleBased: false });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <LeadMagicProvider endpoint="/api/shared" fetch={fetchImpl}>
        {children}
      </LeadMagicProvider>
    );
    const { result } = renderHook(
      () => ({
        first: useEmailValidation(),
        second: useEmailValidation(),
        custom: useEmailValidation({ endpoint: "/api/custom" }),
      }),
      { wrapper }
    );

    await act(async () => {
      await result.current.first.validate("ada@stripe.com");
      await result.current.second.validate("ada@stripe.com");
    });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(fetchImpl.mock.calls[0]?.[0]).toBe("/api/shared");
    expect(result.current.second.isDeliverable).toBe(true);

    await act(async () => {
      await result.current.custom.validate("bob@stripe.com");
    });
    expect(fetchImpl.mock.calls[1]?.[0]).toBe("/api/custom");
  });
});

describe("requests in flight", () => {
  function slowRoute() {
    const settle: Array<(response: Response) => void> = [];
    const fetchImpl = vi.fn(
      (_url: string, init: RequestInit) =>
        new Promise<Response>((resolve, reject) => {
          settle.push(resolve);
          init.signal?.addEventListener("abort", () =>
            reject(new DOMException("aborted", "AbortError"))
          );
        })
    );
    return { fetchImpl, settle };
  }

  it("asks once when two fields check the same address together", async () => {
    const { fetchImpl, settle } = slowRoute();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <LeadMagicProvider fetch={fetchImpl as typeof fetch}>
        {children}
      </LeadMagicProvider>
    );
    const { result } = renderHook(
      () => ({ first: useEmailValidation(), second: useEmailValidation() }),
      { wrapper }
    );

    await act(async () => {
      const both = Promise.all([
        result.current.first.validate("ada@stripe.com"),
        result.current.second.validate("ADA@stripe.com"),
      ]);
      await Promise.resolve();
      settle[0]?.(Response.json({ verdict: "deliverable", roleBased: false }));
      await both;
    });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(result.current.first.isDeliverable).toBe(true);
    expect(result.current.second.isDeliverable).toBe(true);
  });

  it("keeps a shared request alive when only one field moves on", async () => {
    const { fetchImpl, settle } = slowRoute();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <LeadMagicProvider fetch={fetchImpl as typeof fetch}>
        {children}
      </LeadMagicProvider>
    );
    const { result } = renderHook(
      () => ({ first: useEmailValidation(), second: useEmailValidation() }),
      { wrapper }
    );

    await act(async () => {
      const first = result.current.first.validate("ada@stripe.com");
      const second = result.current.second.validate("ada@stripe.com");
      await Promise.resolve();
      // The first field is edited; the second still wants the answer.
      result.current.first.reset();
      settle[0]?.(
        Response.json({ verdict: "undeliverable", roleBased: false })
      );
      await Promise.all([first, second]);
    });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(result.current.first.status).toBe("idle");
    expect(result.current.second.isUndeliverable).toBe(true);
  });

  it("keeps answers from different routes apart", async () => {
    const fetchImpl = reply({ verdict: "deliverable", roleBased: false });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <LeadMagicProvider fetch={fetchImpl}>{children}</LeadMagicProvider>
    );
    const { result } = renderHook(
      () => ({
        standard: useEmailValidation(),
        other: useEmailValidation({ endpoint: "/api/other" }),
      }),
      { wrapper }
    );
    await act(async () => {
      await result.current.standard.validate("ada@stripe.com");
      await result.current.other.validate("ada@stripe.com");
    });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });
});

describe("checkEmail", () => {
  it("returns the answer from the route", async () => {
    const fetchImpl = reply({ verdict: "deliverable", roleBased: true });
    await expect(
      checkEmail(" Ada@stripe.com ", { fetch: fetchImpl })
    ).resolves.toEqual({
      email: "Ada@stripe.com",
      verdict: "deliverable",
      roleBased: true,
    });
  });

  it("rejects with the status when the route refuses", async () => {
    const fetchImpl = reply({ error: "no" }, 403);
    await expect(
      checkEmail("ada@stripe.com", { fetch: fetchImpl })
    ).rejects.toMatchObject({ name: "EmailCheckError", status: 403 });
  });

  it("rejects when the route answers without a verdict", async () => {
    const fetchImpl = reply({ ok: true });
    await expect(
      checkEmail("ada@stripe.com", { fetch: fetchImpl })
    ).rejects.toBeInstanceOf(EmailCheckError);
  });
});

describe("emailValidationQueryOptions", () => {
  it("builds a key, a fetcher and a stale time for TanStack Query", async () => {
    const fetchImpl = reply({ verdict: "deliverable", roleBased: false });
    const options = emailValidationQueryOptions(" Ada@Stripe.com ", {
      fetch: fetchImpl,
      endpoint: "/api/check",
      staleTime: 5000,
    });
    expect(options.queryKey).toEqual([
      "leadmagic",
      "email-validation",
      "/api/check",
      "ada@stripe.com",
    ]);
    expect(options.enabled).toBe(true);
    expect(options.staleTime).toBe(5000);
    await expect(
      options.queryFn({ signal: new AbortController().signal })
    ).resolves.toMatchObject({ verdict: "deliverable" });
    expect(fetchImpl.mock.calls[0]?.[0]).toBe("/api/check");
  });

  it("stays disabled until the text looks like an address", () => {
    expect(emailValidationQueryOptions("ada@").enabled).toBe(false);
  });

  it("judges the shape of an address the same way the old pattern did", () => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
    const samples = [
      "ada@stripe.com",
      "a@b.co",
      "first.last+tag@sub.example.co.uk",
      "ada@stripe",
      "ada@.com",
      "ada@stripe.",
      "ada@a.b",
      "@stripe.com",
      "ada@@stripe.com",
      "ada@str ipe.com",
      "ada stripe.com",
      "ada@stripe..com",
      "ada",
      "",
      "@",
      "a@b",
      "a@b.",
      "a@.b",
    ];
    for (const sample of samples) {
      expect([sample, emailValidationQueryOptions(sample).enabled]).toEqual([
        sample,
        pattern.test(sample),
      ]);
    }
  });

  it("turns down very long input at once", () => {
    const hostile = `!@${"!.".repeat(200_000)}`;
    const started = performance.now();
    expect(emailValidationQueryOptions(hostile).enabled).toBe(false);
    expect(performance.now() - started).toBeLessThan(50);
  });
});
