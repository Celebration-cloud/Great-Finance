import { NextResponse } from "next/server";
import { appendAuditLog } from "@/features/audit/service";
import { getPrincipal } from "@/lib/auth/principal";
import { getPrisma } from "@/lib/db";
import { createDownloadUrl } from "@/lib/storage/neon";
import { getPrivateBlob } from "@/lib/storage/vercel-blob";

const reviewers = new Set(["REVIEWER", "ADMIN", "SUPER_ADMIN"]);

export async function GET(request: Request, { params }: { params: Promise<{ submissionId: string; kind: string }> }) {
  const principal = await getPrincipal();
  if (!principal) return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
  if (!reviewers.has(principal.role)) return NextResponse.json({ success: false, message: "Reviewer access required." }, { status: 403 });

  const { submissionId, kind } = await params;
  if (kind !== "identity" && kind !== "selfie") return NextResponse.json({ success: false, message: "Unknown document type." }, { status: 400 });
  const submission = await getPrisma().vendorKycSubmission.findUnique({ where: { id: submissionId } });
  if (!submission) return NextResponse.json({ success: false, message: "KYC submission not found." }, { status: 404 });

  try {
    const key = kind === "identity" ? submission.identityObjectKey : submission.selfieObjectKey;
    const contentType = kind === "identity" ? submission.identityContentType : submission.selfieContentType;
    await getPrisma().$transaction((tx) => appendAuditLog(tx, { actorId: principal.userId, actorRole: principal.role, action: "vendor-kyc.document-viewed", entityType: "vendor-kyc", entityId: submission.id, metadata: { kind } }));
    if (contentType.startsWith("image/")) {
      const result = await getPrivateBlob(key, request.headers.get("if-none-match") ?? undefined);
      if (!result) return NextResponse.json({ success: false, message: "Document not found." }, { status: 404 });
      if (result.statusCode === 304) {
        return new NextResponse(null, { status: 304, headers: { ETag: result.blob.etag, "Cache-Control": "private, no-cache" } });
      }
      return new NextResponse(result.stream, {
        headers: {
          "Content-Type": result.blob.contentType,
          "Content-Disposition": `attachment; filename="${kind}.${result.blob.pathname.split(".").pop() ?? "bin"}"`,
          "X-Content-Type-Options": "nosniff",
          ETag: result.blob.etag,
          "Cache-Control": "private, no-cache",
        },
      });
    }
    return NextResponse.redirect(await createDownloadUrl(key));
  } catch (error) {
    console.error("vendor-kyc.document-download.failed", error);
    return NextResponse.json({ success: false, message: "The document could not be opened." }, { status: 503 });
  }
}
