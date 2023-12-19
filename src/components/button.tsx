import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { cn } from "~/utils/cn";

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant: "filled" | "outlined";
};

export function Button(props: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "rounded-lg px-4 py-2 hover:brightness-105",
        props.variant === "filled"
          ? "bg-blue-500 text-white"
          : "border border-zinc-300 bg-transparent text-black dark:border-0 dark:bg-zinc-900 dark:text-white",
        props.className,
      )}
    />
  );
}
