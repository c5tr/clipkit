import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { json, redirect } from "@remix-run/node";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { ZodError } from "zod";
import AuthForm from "~/components/auth-form";
import { UserType } from "~/types/user";
import { getUser, loginUser } from "~/utils/sessions.server";

export async function loader({ request }: LoaderArgs) {
  if (await getUser(request)) throw redirect("/app");
  return json({
    enableRegistrations: process.env.ENABLE_REGISTRATIONS == "true"
  });
}

export async function action({ request }: ActionArgs) {
  // TODO: move to users.server.ts
  const data = Object.fromEntries(await request.formData());
  try {
    const user = UserType.parse(data);
    return await loginUser(user);
  } catch (e) {
    if (e instanceof ZodError) {
      return json({ error: e.issues[0].message }, { status: 400 });
    }

    if (e instanceof PrismaClientKnownRequestError) {
      return json({ error: "Database error. TODO" }, { status: 500 });
    }
    return json({ error: "Unknown error" }, { status: 500 });
  }
}

export default function Login() {
  const loaderData = useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();
  return <AuthForm mode="login" message={data?.error} enableRegistrations={loaderData.enableRegistrations}/>;
}
