import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export function Button(
  props: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
) {
  return (
    <button
      {...props}
      className={`${props.className} rounded-lg bg-blue-500 px-4 py-2 text-white hover:brightness-105`}
    />
  );
}
