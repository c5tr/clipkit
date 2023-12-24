import { execFileSync } from "child_process";
import { readFileSync } from "fs";
import { unlink } from "fs/promises";
import { AuthService } from "~/data/auth";
import { ClipsService } from "~/data/clips";
import { S3Service } from "~/data/s3";

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const user = await AuthService.getUser();
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
  const clip = await ClipsService.getClipById(id, user.id);
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
  const uploadUrl = await S3Service.createUploadUrl(`${id}.webp`);
  const file = readFileSync(`/tmp/${id}.webp`);
  await fetch(uploadUrl, {
    method: 'PUT',
    body: file
  })
  await ClipsService.markAsAvailable(id);
  await unlink(`/tmp/${id}.webp`);
  return new Response(undefined);
}
