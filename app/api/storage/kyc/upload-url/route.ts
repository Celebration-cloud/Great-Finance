import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { kycUploadRequestSchema } from "@/features/kyc/schemas";
import { getPrincipal } from "@/lib/auth/principal";
import { createUploadUrl } from "@/lib/storage/neon";

const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "application/pdf": "pdf" };

export async function POST(request: Request) {
  const principal = await getPrincipal();
  if (!principal) return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
  if (principal.role !== "VENDOR") return NextResponse.json({ success: false, message: "Vendor access required." }, { status: 403 });

  const parsed = kycUploadRequestSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ success: false, message: "Invalid KYC file.", errors: parsed.error.flatten().fieldErrors }, { status: 400 });

  try {
    const extension = extensions[parsed.data.contentType];
    const key = `vendor-kyc/${principal.organizationId}/${principal.userId}/${randomUUID()}-${parsed.data.kind}.${extension}`;
    const uploadUrl = await createUploadUrl(key, parsed.data.contentType);
    return NextResponse.json({ success: true, data: { key, uploadUrl }, message: "Secure upload URL created." });
  } catch (error) {
    console.error("vendor-kyc.upload-url.failed", error);
    return NextResponse.json({ success: false, message: "Secure storage is temporarily unavailable." }, { status: 503 });
  }
}
