import "server-only";

import { get, head } from "@vercel/blob";
import { z } from "zod";

const blobEnvSchema = z.object({
  BLOB_READ_WRITE_TOKEN: z.string().min(1),
});

function getBlobToken() {
  const parsed = blobEnvSchema.safeParse(process.env);
  if (!parsed.success) throw new Error("Vercel Blob configuration is incomplete: BLOB_READ_WRITE_TOKEN");
  return parsed.data.BLOB_READ_WRITE_TOKEN;
}

export async function inspectPrivateBlob(pathname: string) {
  const blob = await head(pathname, { token: getBlobToken() });
  return { contentType: blob.contentType, size: blob.size };
}

export function getPrivateBlob(pathname: string, ifNoneMatch?: string) {
  return get(pathname, {
    access: "private",
    token: getBlobToken(),
    ifNoneMatch,
  });
}
