// @vitest-environment happy-dom
import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useEmailValidation } from "../src/react/index";

function reply(body: unknown, status = 200) {
  return vi.fn(async () => Response.json(body, { status }));
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
