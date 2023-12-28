import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({
  endpoint: process.env.S3_ENDPOINT!,
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: process.env.S3_USE_PATH_STYLE_URLS === "true",
});

const bucket = process.env.S3_BUCKET!;

/**
 * Creates an S3 presigned URL to upload a file
 * @param key Filename
 * @returns URL
 */
export async function createUploadUrl(key: string) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  const signedUrl = await getSignedUrl(client, command, {
    expiresIn: 3600,
  });
  return signedUrl;
}

/**
 * Delete a file from the S3 bucket
 * @param key Filename
 */
export async function deleteObject(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  await client.send(command);
  return true;
}

/**
 * Delete multiple objects from the S3 bucket
 * @param objects Filenames
 */
export async function deleteObjects(...objects: string[]) {
  const command = new DeleteObjectsCommand({
    Bucket: bucket,
    Delete: {
      Objects: objects.map((object) => ({ Key: object })),
    },
  });
  await client.send(command);
  return true;
}
