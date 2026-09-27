import { randomUUID } from "node:crypto";
import { isKycImageContentType, kycUploadRequestSchema } from "@/features/kyc/schemas";
import { requireApiPrincipal, requireApiRole } from "@/lib/auth/api";
import { AppError, errors } from "@/lib/errors/app-error";
import { apiSuccess, readJson, withApiHandler } from "@/lib/http/api-response";
import { createUploadUrl } from "@/lib/storage/neon";

const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "application/pdf": "pdf" };

export async function POST(request: Request) {
  return withApiHandler(request, "vendor-kyc.upload.prepare", async (context) => {
    const principal = await requireApiPrincipal();
    requireApiRole(principal, ["VENDOR"], "Vendor access required.");
    const parsed = kycUploadRequestSchema.safeParse(await readJson(request));
    if (!parsed.success) throw errors.validation("Invalid KYC file.", parsed.error.flatten().fieldErrors);
    const extension = extensions[parsed.data.contentType];
    const key = `vendor-kyc/${principal.organizationId}/${principal.userId}/${randomUUID()}-${parsed.data.kind}.${extension}`;
    if (isKycImageContentType(parsed.data.contentType)) {
      return apiSuccess(context, { key, provider: "vercel-blob" }, "Private Blob upload prepared.");
    }
    try {
      const uploadUrl = await createUploadUrl(key, parsed.data.contentType);
      return apiSuccess(context, { key, provider: "neon-storage", uploadUrl }, "Secure upload URL created.");
    } catch (cause) {
      if (cause instanceof AppError) throw cause;
      throw errors.storageUnavailable("Secure storage is temporarily unavailable.", cause);
    }
  });
}
