import { type ActionArgs, json } from "@remix-run/node";
import { deleteClip, getClipById } from "~/utils/clips.server";
import { requireUser } from "~/utils/sessions.server";

export async function action({ request, params }: ActionArgs) {
  const user = await requireUser(request);
  const id = params.id;
  if (!id) {
    return json({ error: "An ID is required" }, { status: 400 });
  }
  const clip = await getClipById(id);
  if (user.id != clip?.userId) {
    return json({ error: "This clip belongs to another user" }, { status: 401 });
  }
  await deleteClip(id);
  return null;
}
