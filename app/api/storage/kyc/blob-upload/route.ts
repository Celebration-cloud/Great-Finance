import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { KYC_IMAGE_CONTENT_TYPES, MAX_KYC_FILE_BYTES, kycUploadRequestSchema } from "@/features/kyc/schemas";
import { getPrincipal } from "@/lib/auth/principal";

const clientPayloadSchema = z.object({
  kind: z.enum(["identity", "selfie"]),
  contentType: z.enum(KYC_IMAGE_CONTENT_TYPES),
  size: z.number().int().positive().max(MAX_KYC_FILE_BYTES),
});

export async function POST(request: Request) {
  let body: HandleUploadBody;
  try {
    body = await request.json() as HandleUploadBody;
  } catch {
    return NextResponse.json({ success: false, message: "Invalid upload request." }, { status: 400 });
  }

  try {
    const response = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const principal = await getPrincipal();
        if (!principal) throw new Error("Authentication required.");
        if (principal.role !== "VENDOR") throw new Error("Vendor access required.");

        const parsedPayload = clientPayloadSchema.safeParse(clientPayload ? JSON.parse(clientPayload) : null);
        if (!parsedPayload.success) throw new Error("Invalid upload metadata.");
        const expectedPrefix = `vendor-kyc/${principal.organizationId}/${principal.userId}/`;
        if (!pathname.startsWith(expectedPrefix) || !pathname.includes(`-${parsedPayload.data.kind}.`)) throw new Error("Invalid storage object ownership.");

        const validatedFile = kycUploadRequestSchema.safeParse({
          kind: parsedPayload.data.kind,
          fileName: pathname.split("/").pop(),
          contentType: parsedPayload.data.contentType,
          size: parsedPayload.data.size,
        });
        if (!validatedFile.success || !validatedFile.data.contentType.startsWith("image/")) throw new Error("Invalid KYC image.");

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
    return NextResponse.json(response);
  } catch (error) {
    console.error("vendor-kyc.blob-upload.failed", error);
    const reason = error instanceof Error ? error.message : "";
    if (reason === "Authentication required.") return NextResponse.json({ success: false, message: reason }, { status: 401 });
    if (reason === "Vendor access required." || reason === "Invalid storage object ownership.") return NextResponse.json({ success: false, message: reason }, { status: 403 });
    if (reason === "Invalid upload metadata." || reason === "Invalid KYC image.") return NextResponse.json({ success: false, message: reason }, { status: 400 });
    return NextResponse.json({ success: false, message: "Private image upload is unavailable." }, { status: 503 });
  }
}
