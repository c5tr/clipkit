import { type ActionArgs, json, redirect } from "@remix-run/node";
import { ZodError } from "zod";
import { UsernameType } from "~/types/user";
import { requireUser } from "~/utils/sessions.server";
import { updateUsername } from "~/utils/users.server";

export async function action({ request }: ActionArgs) {
  const user = await requireUser(request);
  try {
    const newUsername = UsernameType.parse((await request.formData()).get("username"));
    const newUser = await updateUsername(user.id, newUsername);

    const params = new URL(request.url).searchParams;
    if (params.get("redirect") != null) {
      return redirect("/app/settings");
    }

    return json({ id: newUser.id, username: newUser.username });
  } catch (e) {
    if (e instanceof ZodError) {
      return json({ error: e.issues[0].message }, { status: 400 });
    }
    return json({ error: "Unknown error" }, { status: 500 });
  }
}
