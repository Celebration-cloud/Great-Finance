import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export function verifyPaystackSignature(rawBody: string, signature: string | null, secret: string) {
  if (!signature || !/^[a-f0-9]{128}$/i.test(signature)) return false;
  const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
  return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signature, "hex"));
}

export function hashWebhook(rawBody: string) {
  return createHash("sha256").update(rawBody).digest("hex");
}
