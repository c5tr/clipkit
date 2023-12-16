import { eq } from "drizzle-orm";
import { db } from "./db";
import { clips } from "./db/schema";
import { S3Service } from "./s3";

export class ClipsService {
  /**
   * Creates a upload entry in the database
   * @param name Title of the upload
   * @returns Object containing upload ID and S3 presigned upload url.
   */
  static async create(userId: number, filename: string) {
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

    const uploadUrl = await S3Service.createUploadUrl(id + "." + fileExtension);

    return {
      id,
      uploadUrl,
    };
  }

  static async markAsAvailable(id: string) {
    await db
      .update(clips)
      .set({
        status: "available",
      })
      .where(eq(clips.id, id));
  }
}
