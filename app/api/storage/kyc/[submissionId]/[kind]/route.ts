import { NextResponse } from "next/server";
import { appendAuditLog } from "@/features/audit/service";
import { getPrincipal } from "@/lib/auth/principal";
import { getPrisma } from "@/lib/db";
import { createDownloadUrl } from "@/lib/storage/neon";

const reviewers = new Set(["REVIEWER", "ADMIN", "SUPER_ADMIN"]);

export async function GET(_request: Request, { params }: { params: Promise<{ submissionId: string; kind: string }> }) {
  const principal = await getPrincipal();
  if (!principal) return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
  if (!reviewers.has(principal.role)) return NextResponse.json({ success: false, message: "Reviewer access required." }, { status: 403 });

  const { submissionId, kind } = await params;
  if (kind !== "identity" && kind !== "selfie") return NextResponse.json({ success: false, message: "Unknown document type." }, { status: 400 });
  const submission = await getPrisma().vendorKycSubmission.findUnique({ where: { id: submissionId } });
  if (!submission) return NextResponse.json({ success: false, message: "KYC submission not found." }, { status: 404 });

  try {
    const key = kind === "identity" ? submission.identityObjectKey : submission.selfieObjectKey;
    await getPrisma().$transaction((tx) => appendAuditLog(tx, { actorId: principal.userId, actorRole: principal.role, action: "vendor-kyc.document-viewed", entityType: "vendor-kyc", entityId: submission.id, metadata: { kind } }));
    return NextResponse.redirect(await createDownloadUrl(key));
  } catch (error) {
    console.error("vendor-kyc.document-download.failed", error);
    return NextResponse.json({ success: false, message: "The document could not be opened." }, { status: 503 });
  }
}
