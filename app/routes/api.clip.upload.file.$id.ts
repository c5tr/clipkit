import {
  json,
  type ActionArgs,
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { addClipUrl, getClipById } from "~/utils/clips.server";
import { requireUser } from "~/utils/sessions.server";
import { exec as nodeExec } from "node:child_process";
import * as util from "node:util";

const exec = util.promisify(nodeExec);

export async function action({ request, params }: ActionArgs) {
  const user = await requireUser(request);
  const fileId = params.id;
  if (!fileId) {
    return json({ error: "A file ID is required" }, { status: 400 });
  }
  const clip = await getClipById(fileId);
  if (user.id != clip?.userId) {
    return json({ error: "This clip belongs to another user" }, { status: 401 });
  }
  
  let file: string;
  const uploadHandler = unstable_createFileUploadHandler({
    maxPartSize: 100 * 1024 * 1024,
    directory: "./public/uploads/",
    file: ({ filename }) => {
      file = fileId + filename.substring(filename.lastIndexOf("."));
      return file;
    },
  });
  await unstable_parseMultipartFormData(request, uploadHandler);
  // generate thumbnail
  await exec(`ffmpeg -i ./public/uploads/${file!} -vframes 1 ./public/uploads/${fileId}.webp`);
  const updatedClip = await addClipUrl(
    fileId,
    process.env.PUBLIC_URL + file!,
    process.env.PUBLIC_URL + fileId + ".webp",
  );
  return json(updatedClip);
}
