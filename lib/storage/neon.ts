import "server-only";

import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";

const storageEnvSchema = z.object({
  NEON_STORAGE_BUCKET: z.string().min(1),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_ENDPOINT_URL_S3: z.string().url(),
  AWS_REGION: z.string().min(1),
});

let storageClient: S3Client | undefined;

function getStorageConfig() {
  const parsed = storageEnvSchema.safeParse(process.env);
  if (!parsed.success) throw new Error(`Neon Storage configuration is incomplete: ${parsed.error.issues.map((issue) => issue.path.join(".")).join(", ")}`);
  return parsed.data;
}

function getStorageClient() {
  if (storageClient) return storageClient;
  const env = getStorageConfig();
  storageClient = new S3Client({
    region: env.AWS_REGION,
    endpoint: env.AWS_ENDPOINT_URL_S3,
    forcePathStyle: true,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });
  return storageClient;
}

export async function createUploadUrl(key: string, contentType: string) {
  const { NEON_STORAGE_BUCKET: bucket } = getStorageConfig();
  return getSignedUrl(getStorageClient(), new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }), { expiresIn: 300 });
}

export async function inspectStoredObject(key: string) {
  const { NEON_STORAGE_BUCKET: bucket } = getStorageConfig();
  const result = await getStorageClient().send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
  return { contentType: result.ContentType, size: result.ContentLength };
}

export async function createDownloadUrl(key: string) {
  const { NEON_STORAGE_BUCKET: bucket } = getStorageConfig();
  return getSignedUrl(getStorageClient(), new GetObjectCommand({ Bucket: bucket, Key: key, ResponseContentDisposition: "attachment" }), { expiresIn: 300 });
}
