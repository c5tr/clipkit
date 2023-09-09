import { json, type ActionArgs } from "@remix-run/node";
import { createClipUpload } from "~/utils/clips.server";
import { requireUser } from "~/utils/sessions.server";

export async function action({ request }: ActionArgs) {
  const user = await requireUser(request);
  const filename = (await request.formData()).get("filename")?.toString();
  if (!filename) {
    return json({ error: "You have to provide a filename" }, { status: 400 });
  }
  try {
    return json(await createClipUpload(user.id, filename));
  } catch (e) {
    console.log(e);
    return json({ error: "Unknown error" }, { status: 400 });
  }
}
