"use client";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./button";
import { cn } from "~/utils/cn";

export function SubmitButton(
  props: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
) {
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
