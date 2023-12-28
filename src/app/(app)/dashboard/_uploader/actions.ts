"use server";

import { requireUser } from "~/data/auth";
import { createClip } from "~/data/clips";

export async function createUpload(filename: string) {
  const user = await requireUser();
  return await createClip(user.id, filename);
}