import { NextResponse } from "next/server";
import { appendAuditLog } from "@/features/audit/service";
import { requireApiPrincipal, requireApiRole } from "@/lib/auth/api";
import { getPrisma } from "@/lib/db";
import { AppError, errors } from "@/lib/errors/app-error";
import { apiError, createApiContext } from "@/lib/http/api-response";
import { createDownloadUrl } from "@/lib/storage/neon";
import { getPrivateBlob } from "@/lib/storage/vercel-blob";

const reviewers = new Set(["REVIEWER", "ADMIN", "SUPER_ADMIN"]);

export async function GET(request: Request, { params }: { params: Promise<{ submissionId: string; kind: string }> }) {
  const context = createApiContext(request, "vendor-kyc.document.download");
  try {
    const principal = await requireApiPrincipal();
    requireApiRole(principal, [...reviewers] as ("REVIEWER" | "ADMIN" | "SUPER_ADMIN")[], "Reviewer access required.");
    const { submissionId, kind } = await params;
    const isDownload = new URL(request.url).searchParams.get("download") === "1";
    if (kind !== "identity" && kind !== "selfie") throw errors.validation("Unknown document type.");
    const submission = await getPrisma().vendorKycSubmission.findUnique({ where: { id: submissionId } });
    if (!submission) throw errors.notFound("KYC submission not found.");
    const key = kind === "identity" ? submission.identityObjectKey : submission.selfieObjectKey;
    const contentType = kind === "identity" ? submission.identityContentType : submission.selfieContentType;
    const auditAction = isDownload ? "vendor-kyc.document-downloaded" : "vendor-kyc.document-viewed";
    await getPrisma().$transaction((tx) => appendAuditLog(tx, { actorId: principal.userId, actorRole: principal.role, action: auditAction, entityType: "vendor-kyc", entityId: submission.id, metadata: { kind } }));
    if (contentType.startsWith("image/")) {
      const result = await getPrivateBlob(key, request.headers.get("if-none-match") ?? undefined);
      if (!result) throw errors.notFound("Document not found.");
      if (result.statusCode === 304) {
        return new NextResponse(null, { status: 304, headers: { ETag: result.blob.etag, "Cache-Control": "private, no-cache", "x-request-id": context.requestId } });
      }
      const ext = result.blob.pathname.split(".").pop() ?? "bin";
      const safeName = `${kind}-kyc.${ext}`;
      const disposition = isDownload
        ? `attachment; filename="${safeName}"`
        : `inline; filename="${safeName}"`;
      return new NextResponse(result.stream, {
        headers: {
          "Content-Type": result.blob.contentType,
          "Content-Disposition": disposition,
          "X-Content-Type-Options": "nosniff",
          ETag: result.blob.etag,
          "Cache-Control": "private, no-cache",
          "x-request-id": context.requestId,
        },
      });
    }
    const dispositionMode = isDownload ? "attachment" : "inline";
    const response = NextResponse.redirect(await createDownloadUrl(key, dispositionMode));

    response.headers.set("x-request-id", context.requestId);
    return response;
  } catch (cause) {
    if (cause instanceof AppError) return apiError(context, cause);
    return apiError(context, errors.storageUnavailable("The document could not be opened.", cause));
  }
}
