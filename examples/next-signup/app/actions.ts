"use server";

import { validateEmail } from "leadmagic";

export interface SignupState {
  email?: string;
  error?: string;
  ok?: boolean;
}

export async function signup(
  _prev: SignupState,
  formData: FormData
): Promise<SignupState> {
  const email = String(formData.get("email") ?? "").trim();

  // The field already checked on blur; this is the check that counts, because
  // browser code can be skipped. Only a clear "undeliverable" blocks the signup.
  const { data, error } = await validateEmail(email, { timeoutMs: 5000 });
  if (data?.verdict === "undeliverable" || error?.kind === "invalid_input") {
    return {
      email,
      error: "This address can't receive email. Check it for typos.",
    };
  }

  // Create the account here.
  return { email, ok: true };
}
