import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { z } from "zod";
import { KYC_IMAGE_CONTENT_TYPES, MAX_KYC_FILE_BYTES, kycUploadRequestSchema } from "@/features/kyc/schemas";
import { requireApiPrincipal, requireApiRole } from "@/lib/auth/api";
import { AppError, errors } from "@/lib/errors/app-error";
import { apiProtocolJson, readJson, withApiHandler } from "@/lib/http/api-response";

const clientPayloadSchema = z.object({
  kind: z.enum(["identity", "selfie"]),
  contentType: z.enum(KYC_IMAGE_CONTENT_TYPES),
  size: z.number().int().positive().max(MAX_KYC_FILE_BYTES),
});

export async function POST(request: Request) {
  return withApiHandler(request, "vendor-kyc.blob-upload", async (context) => {
    const body = await readJson(request) as HandleUploadBody;
    try {
      const response = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const principal = await requireApiPrincipal();
        requireApiRole(principal, ["VENDOR"], "Vendor access required.");

        let payload: unknown;
        try { payload = clientPayload ? JSON.parse(clientPayload) : null; } catch { throw errors.validation("Invalid upload metadata."); }
        const parsedPayload = clientPayloadSchema.safeParse(payload);
        if (!parsedPayload.success) throw errors.validation("Invalid upload metadata.", parsedPayload.error.flatten().fieldErrors);
        const expectedPrefix = `vendor-kyc/${principal.organizationId}/${principal.userId}/`;
        if (!pathname.startsWith(expectedPrefix) || !pathname.includes(`-${parsedPayload.data.kind}.`)) throw errors.forbidden("Invalid storage object ownership.");

        const validatedFile = kycUploadRequestSchema.safeParse({
          kind: parsedPayload.data.kind,
          fileName: pathname.split("/").pop(),
          contentType: parsedPayload.data.contentType,
          size: parsedPayload.data.size,
        });
        if (!validatedFile.success || !validatedFile.data.contentType.startsWith("image/")) throw errors.validation("Invalid KYC image.");

        return {
          allowedContentTypes: [validatedFile.data.contentType],
          maximumSizeInBytes: MAX_KYC_FILE_BYTES,
          addRandomSuffix: false,
          allowOverwrite: false,
          validUntil: Date.now() + 5 * 60 * 1000,
          tokenPayload: JSON.stringify({ userId: principal.userId, pathname }),
        };
      },
      });
      return apiProtocolJson(context, response);
    } catch (cause) {
      if (cause instanceof AppError) throw cause;
      throw errors.storageUnavailable("Private image upload is unavailable.", cause);
    }
  });
}
