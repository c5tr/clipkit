"use server";

import { ClipsService } from "~/data/clips";

export async function getClips(userId: number) {
  const clips = await ClipsService.getAllByUser(userId);
  return clips.map((clip) => ({
    ...clip,
    thumbnailUrl: `${process.env.S3_PUBLIC_URL}/${clip.id}.webp`
  }));
}

// manually creating type because Awaited<typeof getClips> is not unwrapping the promise
export type Clip = {
  id: string;
  title: string;
  thumbnailUrl: string;
}