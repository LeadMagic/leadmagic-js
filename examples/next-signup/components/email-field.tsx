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
  if (email.status === "undeliverable") {
    hint = "This address can't receive email. Check it for typos.";
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
        aria-invalid={email.inputProps["aria-invalid"]}
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
            email.status === "undeliverable"
              ? "text-destructive text-sm"
              : "text-muted-foreground text-sm"
          }
          id={hintId}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
