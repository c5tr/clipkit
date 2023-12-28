import { and, desc, eq } from "drizzle-orm";
import { db } from "./db";
import { clips } from "./db/schema";
import { createUploadUrl } from "./s3";

/**
 * Creates a upload entry in the database
 * @param name Title of the upload
 * @returns Object containing upload ID and S3 presigned upload url.
 */
export async function createClip(userId: number, filename: string) {
  const id = crypto.randomUUID().replaceAll("-", "").substring(0, 16);
  const fileExtension = filename.substring(
    filename.lastIndexOf(".") + 1,
    filename.length,
  );

  await db.insert(clips).values({
    id,
    title: filename.substring(0, filename.lastIndexOf(".")),
    userId: userId,
    videoFormat: fileExtension,
  });

  const uploadUrl = await createUploadUrl(id + "." + fileExtension);

  return {
    id,
    uploadUrl,
  };
}

/**
 * Marks a video as available after an upload is successful.
 * @param id Clip ID
 */
export async function markClipAsAvailable(id: string) {
  await db
    .update(clips)
    .set({
      status: "available",
    })
    .where(eq(clips.id, id));
}

/**
 * Returns all clips that belong to a user.
 *
 * TODO: Pagination
 * @param id User's ID
 * @returns Array of clips containing IDs and titles
 */
export async function getAllClipsByUser(id: number) {
  return await db.query.clips.findMany({
    where: and(eq(clips.userId, id), eq(clips.status, "available")),
    columns: {
      id: true,
      title: true,
    },
    orderBy: desc(clips.createdAt),
  });
}

/**
 * Get a clip
 * @param id Clip ID
 * @param user User ID. Include to only return clip if it's owned by the specified user
 */
export async function getClipById(
  id: string,
  user: number | undefined = undefined,
) {
  return await db.query.clips.findFirst({
    where: !user
      ? eq(clips.id, id)
      : and(eq(clips.id, id), eq(clips.userId, user)),
    columns: {
      userId: false,
      id: false,
    },
  });
}

/**
 * Delete a clip
 * @param id Clip ID
 */
export async function deleteClip(id: string) {
  await db.delete(clips).where(eq(clips.id, id));
}
