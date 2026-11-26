"use client";

import type { UseEmailValidationOptions } from "leadmagic/react";
import { useEmailValidation } from "leadmagic/react";
import type { ChangeEvent, ComponentProps, FocusEvent } from "react";
import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface EmailFieldProps
  extends Omit<
    ComponentProps<typeof Input>,
    "type" | "aria-invalid" | "aria-busy"
  > {
  /**
   * A message from your server, such as your server action's answer. It
   * replaces the field's own hint, so only one message shows at a time.
   */
  error?: string;
  label?: string;
  /** Options for the LeadMagic hook, e.g. a custom `endpoint`. */
  validation?: UseEmailValidationOptions;
}

/**
 * An email input that checks the address with LeadMagic when it loses focus.
 * Requires the route from `createValidateEmailHandler` in `leadmagic/next`.
 * This file is yours: change the copy and layout freely.
 */
export function EmailField({
  error,
  label = "Email",
  validation,
  id,
  onBlur,
  onChange,
  name = "email",
  ...props
}: EmailFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const email = useEmailValidation(validation);

  let hint: string | null = null;
  let invalid = false;
  if (error) {
    hint = error;
    invalid = true;
  } else if (email.status === "undeliverable") {
    hint = "This address can't receive email. Check it for typos.";
    invalid = true;
  } else if (email.status === "deliverable" && email.roleBased) {
    hint =
      "This looks like a shared inbox. A personal address reaches you faster.";
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor={inputId}>{label}</Label>
      <Input
        {...props}
        aria-busy={email.inputProps["aria-busy"]}
        aria-describedby={hint ? hintId : undefined}
        aria-invalid={error ? true : email.inputProps["aria-invalid"]}
        autoComplete={props.autoComplete ?? "email"}
        id={inputId}
        name={name}
        onBlur={(event: FocusEvent<HTMLInputElement>) => {
          email.inputProps.onBlur(event);
          onBlur?.(event);
        }}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          email.inputProps.onChange(event);
          onChange?.(event);
        }}
        type="email"
      />
      {hint ? (
        <p
          className={
            invalid
              ? "text-destructive text-sm"
              : "text-muted-foreground text-sm"
          }
          id={hintId}
          role={error ? "alert" : undefined}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
