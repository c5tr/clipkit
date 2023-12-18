"use server";

import { AuthService } from "~/data/auth";
import { ClipsService } from "~/data/clips";
import { S3Service } from "~/data/s3";

// manually creating type because Awaited<typeof getClips> is not unwrapping the promise
export type Clip = {
  id: string;
  title: string;
  thumbnailUrl: string;
}

export async function getClips(userId: number) {
  const clips = await ClipsService.getAllByUser(userId);
  return clips.map((clip) => ({
    ...clip,
    thumbnailUrl: `${process.env.S3_PUBLIC_URL}/${clip.id}.webp`
  }));
}

export async function deleteClip(id: string) {
  const user = await AuthService.requireUser();
  const clip = await ClipsService.getClipById(id, user.id);
  if (!clip) return false;
  await ClipsService.deleteClip(id);
  await S3Service.deleteObjects(`${id}.${clip.videoFormat}`, `${id}.webp`);
  return true;
}
