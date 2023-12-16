"use client";

import { useFormState } from "react-dom";
import { SubmitButton } from "~/components/submit-button";

const initialState = {
  message: null,
};

export function AuthForm({
  mode,
  action,
  enableRegistrations,
}: {
  mode: "login" | "register";
  action: any;
  enableRegistrations: boolean;
}) {
  const [state, formAction] = useFormState(action, initialState);

  return (
    <form action={formAction} className="flex w-full flex-col gap-2">
      <h1 className="text-center text-xl font-bold">
        {mode === "login" ? "Login" : "Register"}
      </h1>
      {state.message && (
        <p
          className="rounded-lg bg-blue-500 px-4 py-2 text-white"
          aria-live="polite"
        >
          {state.message}
        </p>
      )}
      <input type="email" placeholder="Email" name="email" required />
      <input type="password" placeholder="Password" name="password" required />
      <SubmitButton>{mode === "login" ? "Login" : "Register"}</SubmitButton>
      {enableRegistrations && (
        <a href={mode == "login" ? "/register" : "/login"} className="text-center mt-2">
          {mode == "login"
            ? "I don't have an account"
            : "I already have an account"}
        </a>
      )}
    </form>
  );
}
