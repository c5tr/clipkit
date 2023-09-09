import { json, type ActionArgs, redirect } from "@remix-run/node";
import { ZodError } from "zod";
import { UpdatePasswordType } from "~/types/password";
import { requireUser } from "~/utils/sessions.server";
import { updatePassword } from "~/utils/users.server";

export async function action({ request }:ActionArgs) {
    const user = await requireUser(request);
    try {
        const passwordData = UpdatePasswordType.parse(Object.fromEntries(await request.formData()));
        if (passwordData.newPassword != passwordData.confirmNewPassword) {
            return json({ error: "Password confirmation has to match" }, { status: 400 });
        }
        const success = await updatePassword(user.id, passwordData.oldPassword, passwordData.newPassword);
        
        const params = new URL(request.url).searchParams;
        if (params.get("redirect") != null) {
            return redirect("/app/settings");
        }

        return json({ success: true });
    } catch (e) {
        if (e instanceof ZodError) {
        return json({ error: e.issues[0].message }, { status: 400 });
      }
      return json({ error: "Unknown error" }, { status: 500 });
    }
}