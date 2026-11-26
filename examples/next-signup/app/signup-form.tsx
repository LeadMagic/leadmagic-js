"use client";

import { useActionState, useCallback, useState } from "react";
import { EmailField } from "@/components/email-field";
import { Button } from "@/components/ui/button";
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
      <Button className="w-full" disabled={pending} type="submit">
        {pending ? "Signing up…" : "Sign up"}
      </Button>
    </form>
  );
}
