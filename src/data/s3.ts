import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class S3Service {
  private static client = new S3Client({
    endpoint: process.env.S3_ENDPOINT!,
    region: process.env.S3_REGION!,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: process.env.S3_USE_PATH_STYLE_URLS === "true",
  });

  private static bucket = process.env.S3_BUCKET!;

  static async createUploadUrl(key: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    const signedUrl = await getSignedUrl(this.client, command, {
      expiresIn: 3600,
    });
    return signedUrl;
  }

  static async deleteObject(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    try {
      await this.client.send(command);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  static async deleteObjects(...objects: string[]) {
    const command = new DeleteObjectsCommand({
      Bucket: this.bucket,
      Delete: {
        Objects: objects.map((object) => ({ Key: object })),
      },
    });
    await this.client.send(command);
  }
}
