import { execFileSync } from "child_process";
import { readFileSync } from "fs";
import { unlink } from "fs/promises";
import { getUser } from "~/data/auth";
import { getClipById, markClipAsAvailable } from "~/data/clips";
import { createUploadUrl } from "~/data/s3";

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await request.json();
  const id = data["id"] as string | undefined;
  if (!id)
    return Response.json(
      {
        error: "You have to provide an ID",
      },
      { status: 401 },
    );
  const clip = await getClipById(id, user.id);
  if (!clip)
    return Response.json(
      {
        error: "Unauthorized",
      },
      { status: 401 },
    );
  execFileSync(process.env.FFMPEG_PATH!, [
    "-i",
    `${process.env.S3_PUBLIC_URL}/${id}.${clip.videoFormat}`,
    "-vframes",
    "1",
    `/tmp/${id}.webp`,
  ]);
  const uploadUrl = await createUploadUrl(`${id}.webp`);
  const file = readFileSync(`/tmp/${id}.webp`);
  await fetch(uploadUrl, {
    method: 'PUT',
    body: file
  })
  await markClipAsAvailable(id);
  await unlink(`/tmp/${id}.webp`);
  return new Response(undefined);
}
