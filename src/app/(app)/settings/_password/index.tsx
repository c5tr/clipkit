"use client";

import { useFormState } from "react-dom";
import { SubmitButton } from "~/components/submit-button";
import { updatePassword } from "./actions";
import { useEffect, useRef } from "react";

export function UpdatePassword() {
  const [state, formAction] = useFormState(updatePassword, null);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (state?.success) formRef.current!.reset();
  }, [state]);

  return (
    <form
      className="flex flex-col gap-2 [&>*]:flex [&>*]:flex-col"
      ref={formRef}
      action={formAction}
    >
      <h3 className="font-bold">Update password</h3>
      {state?.success && (
        <p className="text-sm text-green-500">Password updated successfully.</p>
      )}
      <input type="password" name="oldPassword" placeholder="Old password" />
      {state?.errors?.oldPassword && (
        <p className="text-sm text-red-500">{state.errors.oldPassword}</p>
      )}
      <input type="password" name="newPassword" placeholder="New password" />
      {state?.errors?.newPassword && (
        <p className="text-sm text-red-500">{state.errors.newPassword}</p>
      )}
      <input
        type="password"
        name="repeatedNewPassword"
        placeholder="Repeat new password"
      />
      {state?.errors?.repeatedNewPassword && (
        <p className="text-sm text-red-500">
          {state.errors.repeatedNewPassword}
        </p>
      )}
      <SubmitButton variant="filled">Update</SubmitButton>
    </form>
  );
}
