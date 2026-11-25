"use client";

import { useActionState } from "react";
import { EmailField } from "@/components/email-field";
import type { SignupState } from "./actions";
import { signup } from "./actions";

export function SignupForm() {
  const [state, action, pending] = useActionState<SignupState, FormData>(
    signup,
    {}
  );

  if (state.ok) {
    return (
      <p className="text-sm" role="status">
        Thanks. We sent a confirmation to {state.email}.
      </p>
    );
  }

  return (
    <form action={action} className="grid gap-4">
      <EmailField
        defaultValue={state.email}
        placeholder="you@company.com"
        required
      />
      {state.error ? (
        <p className="text-destructive text-sm" role="alert">
          {state.error}
        </p>
      ) : null}
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
