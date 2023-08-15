import { Form, Link } from "@remix-run/react";
import Button from "./button";
import TextInput from "./text-input";

export default function AuthForm({
  mode,
  message,
  enableRegistrations = true,
}: {
  mode: "login" | "register";
  message?: string;
  enableRegistrations?: boolean;
}) {
  return (
    <Form
      className="m-8 flex w-full max-w-lg flex-col gap-2 self-center rounded-xl border p-6 dark:border-zinc-700"
      method="post"
    >
      <div className="flex flex-col items-center gap-2 self-center">
        <div className="icon-[bi--camera-video] text-3xl" />
        <h1>{mode == "login" ? "Login" : "Register"}</h1>
      </div>
      {message && <div className="rounded-lg bg-blue-500 px-4 py-2 text-white">{message}</div>}
      <TextInput type="text" name="username" placeholder="Username" />
      <TextInput type="password" name="password" placeholder="Password" />
      <Button type="submit">{mode == "login" ? "Login" : "Register"}</Button>
      {enableRegistrations && (
        <Link
          to={mode == "login" ? "/register" : "/login"}
          className="mt-2 self-center text-center text-blue-500"
        >
          {mode == "login" ? "I don't have an account" : "I have an account"}
        </Link>
      )}
    </Form>
  );
}
