"use client";

import { useActionState, useCallback, useState } from "react";
import { EmailField } from "@/components/email-field";
import type { SignupState } from "./actions";
import { signup } from "./actions";

export function SignupForm() {
  const [state, action, pending] = useActionState<SignupState, FormData>(
    signup,
    {}
  );
  // The server's message stays until the visitor edits the address.
  const [editedAfter, setEditedAfter] = useState<SignupState | null>(null);
  const clearError = useCallback(() => setEditedAfter(state), [state]);

  if (state.ok) {
    return (
      <p className="text-sm" role="status">
        Thanks. {state.email} is on the list.
      </p>
    );
  }

  return (
    <form action={action} className="grid gap-4">
      <EmailField
        defaultValue={state.email}
        error={editedAfter === state ? undefined : state.error}
        onChange={clearError}
        placeholder="you@company.com"
        required
      />
      <button
        className="bg-primary text-primary-foreground h-9 rounded-md px-4 text-sm font-medium disabled:opacity-50"
        disabled={pending}
        type="submit"
      >
        {pending ? "Signing up…" : "Sign up"}
      </button>
    </form>
  );
}
