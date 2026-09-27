import { Prisma } from "@/generated/prisma/client";
import { appendAuditLog } from "@/features/audit/service";
import { isKycImageContentType, kycSubmissionSchema } from "@/features/kyc/schemas";
import { requireApiPrincipal, requireApiRole } from "@/lib/auth/api";
import { getPrisma } from "@/lib/db";
import { AppError, errors } from "@/lib/errors/app-error";
import { apiSuccess, readJson, withApiHandler } from "@/lib/http/api-response";
import { inspectStoredObject } from "@/lib/storage/neon";
import { inspectPrivateBlob } from "@/lib/storage/vercel-blob";

export async function POST(request: Request) {
  return withApiHandler(request, "vendor-kyc.submit", async (context) => {
  const principal = await requireApiPrincipal();
  requireApiRole(principal, ["VENDOR"], "Vendor access required.");
  const parsed = kycSubmissionSchema.safeParse(await readJson(request));
  if (!parsed.success) throw errors.validation("Invalid KYC submission.", parsed.error.flatten().fieldErrors);

  const expectedPrefix = `vendor-kyc/${principal.organizationId}/${principal.userId}/`;
  if (!parsed.data.identity.key.startsWith(expectedPrefix) || !parsed.data.selfie.key.startsWith(expectedPrefix) || !parsed.data.identity.key.includes("-identity.") || !parsed.data.selfie.key.includes("-selfie.") || parsed.data.identity.key === parsed.data.selfie.key) {
    throw errors.forbidden("Invalid storage object ownership.");
  }

  const identityProvider = isKycImageContentType(parsed.data.identity.contentType) ? "vercel-blob" : "neon-storage";
  if (parsed.data.identity.provider !== identityProvider || parsed.data.selfie.provider !== "vercel-blob") {
    throw errors.validation("Invalid storage provider.");
  }

  let identity: { contentType?: string; size?: number };
  let selfie: { contentType?: string; size?: number };
  try {
    [identity, selfie] = await Promise.all([
      identityProvider === "vercel-blob" ? inspectPrivateBlob(parsed.data.identity.key) : inspectStoredObject(parsed.data.identity.key),
      inspectPrivateBlob(parsed.data.selfie.key),
    ]);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw errors.storageUnavailable("Uploaded files could not be verified. Please retry shortly.", error);
  }
  if (identity.contentType !== parsed.data.identity.contentType || identity.size !== parsed.data.identity.size || selfie.contentType !== parsed.data.selfie.contentType || selfie.size !== parsed.data.selfie.size) {
    throw errors.conflict("Uploaded file metadata could not be verified.");
  }

  const existing = await getPrisma().approvalRequest.findFirst({ where: { resourceType: "vendor-kyc", requestedBy: principal.userId, status: "PENDING" }, select: { id: true } });
  if (existing) throw errors.conflict("A KYC verification is already pending.");

    const result = await getPrisma().$transaction(async (tx) => {
      const submission = await tx.vendorKycSubmission.create({ data: {
        organizationId: principal.organizationId,
        authUserId: principal.userId,
        fullName: parsed.data.fullName,
        stateOfOrigin: parsed.data.stateOfOrigin,
        localGovernment: parsed.data.localGovernment,
        identityObjectKey: parsed.data.identity.key,
        identityContentType: parsed.data.identity.contentType,
        identitySizeBytes: parsed.data.identity.size,
        selfieObjectKey: parsed.data.selfie.key,
        selfieContentType: parsed.data.selfie.contentType,
        selfieSizeBytes: parsed.data.selfie.size,
      } });
      const approval = await tx.approvalRequest.create({ data: {
        organizationId: principal.organizationId,
        resourceType: "vendor-kyc",
        resourceId: submission.id,
        action: "verify",
        requestedBy: principal.userId,
        payload: { fullName: submission.fullName, stateOfOrigin: submission.stateOfOrigin, localGovernment: submission.localGovernment } as Prisma.InputJsonValue,
      } });
      await appendAuditLog(tx, { actorId: principal.userId, actorRole: principal.role, action: "vendor-kyc.submitted", entityType: "vendor-kyc", entityId: submission.id, metadata: { approvalId: approval.id } });
      return { submissionId: submission.id, approvalId: approval.id };
    });

    return apiSuccess(context, result, "KYC verification submitted securely.", 201);
  });
}
