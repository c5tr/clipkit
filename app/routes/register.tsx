import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { json, type ActionArgs, redirect, LoaderArgs } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { ZodError } from "zod";
import AuthForm from "~/components/auth-form";
import { UserType } from "~/types/user";
import { getUser, registerUser } from "~/utils/sessions.server";

export async function loader({ request }: LoaderArgs) {
  if (await getUser(request)) {
    throw redirect("/app");
  }
  const enableRegistations = process.env.ENABLE_REGISTRATIONS == "true";
  if (!enableRegistations) {
    throw redirect("/login");
  }
  return json({ enableRegistations });
}

export async function action({ request }: ActionArgs) {
  if (process.env.ENABLE_REGISTRATIONS == "false") {
    return json({ error: "Registrations are not enabled" }, { status: 400 });
  }

  const data = Object.fromEntries(await request.formData());
  try {
    const user = UserType.parse(data);
    return await registerUser(user);
  } catch (e) {
    if (e instanceof ZodError) {
      return json({ error: e.issues[0].message }, { status: 400 });
    }

    if (e instanceof PrismaClientKnownRequestError) {
      return json({ error: "Database error. TODO" }, { status: 500 });
    }
    return json({ error: "Unknown error"}, { status: 500 })
  }
}

export default function Register() {
  const loaderData = useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();
  return (
    <AuthForm mode="register" message={data?.error} enableRegistrations={loaderData.enableRegistations}/>
  );
}