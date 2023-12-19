"use client";
import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "./button";
import { cn } from "~/utils/cn";

export function SubmitButton(props: ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <>
      <Button
        type="submit"
        {...props}
        className={cn(
          pending && "cursor-wait opacity-80 hover:brightness-100",
          props.className,
        )}
        aria-disabled={pending}
      />
    </>
  );
}
