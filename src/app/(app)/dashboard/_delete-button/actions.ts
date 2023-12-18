"use server";

import { revalidatePath } from "next/cache";
import { AuthService } from "~/data/auth";
import { ClipsService } from "~/data/clips";
import { S3Service } from "~/data/s3";

export async function deleteClip(id: string) {
  const user = await AuthService.requireUser();
  const clip = await ClipsService.getClipById(id, user.id);
  if (!clip)
    return {
      error: "Unauthorized",
    };
  await ClipsService.deleteClip(id);
  await S3Service.deleteObjects(`${id}.${clip.videoFormat}`, `${id}.webp`);
  revalidatePath("/");
}
