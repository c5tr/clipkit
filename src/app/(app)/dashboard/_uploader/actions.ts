"use server";

import { execFileSync } from "child_process";
import { unlink } from "fs/promises";
import { revalidatePath } from "next/cache";
import { AuthService } from "~/data/auth";
import { ClipsService } from "~/data/clips";
import { S3Service } from "~/data/s3";

export async function createUpload(filename: string) {
  const user = await AuthService.requireUser();
  return await ClipsService.create(user.id, filename);
}

export async function finishUpload(id: string) {
  const user = await AuthService.requireUser();
  const clip = await ClipsService.getClipById(id, user.id);
  if (!clip)
    return {
      error: "Unauthorized",
    };
  execFileSync(process.env.FFMPEG_PATH!, [
    "-i",
    `${process.env.S3_PUBLIC_URL}/${id}.${clip.videoFormat}`,
    "-vframes",
    "1",
    `${id}.webp`,
  ]);
  await S3Service.uploadLocalFile(`${id}.webp`);
  await ClipsService.markAsAvailable(id);
  revalidatePath('/dashboard');
  await unlink(`${id}.webp`);
}
