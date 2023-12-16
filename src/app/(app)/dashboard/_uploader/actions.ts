"use server";

import { AuthService } from "~/data/auth";
import { ClipsService } from "~/data/clips";

export async function createUpload(filename: string) {
  const user = await AuthService.requireUser();
  return await ClipsService.create(user.id, filename);
}

export async function finishUpload(id: string) {
  await ClipsService.markAsAvailable(id);
}
