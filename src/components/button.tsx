import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { cn } from "~/utils/cn";

export function Button(
  props: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
) {
  return (
    <button
      {...props}
      className={cn(
        "rounded-lg bg-blue-500 px-4 py-2 text-white hover:brightness-105",
        props.className,
      )}
    />
  );
}
