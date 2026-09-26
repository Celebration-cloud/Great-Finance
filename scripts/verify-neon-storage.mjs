import "dotenv/config";
import { randomUUID } from "node:crypto";
import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const required = ["NEON_STORAGE_BUCKET", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_ENDPOINT_URL_S3", "AWS_REGION"];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) throw new Error(`Missing storage variables: ${missing.join(", ")}`);

const client = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  forcePathStyle: true,
  credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY },
});
const bucket = process.env.NEON_STORAGE_BUCKET;
const key = `healthchecks/${Date.now()}-${randomUUID()}.txt`;
const body = `great-finance-storage-check:${randomUUID()}`;

try {
  const uploadUrl = await getSignedUrl(client, new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: "text/plain" }), { expiresIn: 60 });
  const upload = await fetch(uploadUrl, { method: "PUT", headers: { "Content-Type": "text/plain" }, body });
  if (!upload.ok) throw new Error(`Presigned upload failed with HTTP ${upload.status}.`);
  const head = await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
  const downloadUrl = await getSignedUrl(client, new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn: 60 });
  const download = await fetch(downloadUrl);
  if (!download.ok) throw new Error(`Presigned download failed with HTTP ${download.status}.`);
  const content = await download.text();
  if (content !== body || head.ContentType !== "text/plain") throw new Error("Storage round-trip verification failed.");
  console.log("Neon Storage upload, metadata, and download checks passed.");
} finally {
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}
