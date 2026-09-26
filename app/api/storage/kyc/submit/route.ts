import { Prisma } from "@/generated/prisma/client";
import { NextResponse } from "next/server";
import { appendAuditLog } from "@/features/audit/service";
import { kycSubmissionSchema } from "@/features/kyc/schemas";
import { getPrincipal } from "@/lib/auth/principal";
import { getPrisma } from "@/lib/db";
import { inspectStoredObject } from "@/lib/storage/neon";

export async function POST(request: Request) {
  const principal = await getPrincipal();
  if (!principal) return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
  if (principal.role !== "VENDOR") return NextResponse.json({ success: false, message: "Vendor access required." }, { status: 403 });

  const parsed = kycSubmissionSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ success: false, message: "Invalid KYC submission.", errors: parsed.error.flatten().fieldErrors }, { status: 400 });

  const expectedPrefix = `vendor-kyc/${principal.organizationId}/${principal.userId}/`;
  if (!parsed.data.identity.key.startsWith(expectedPrefix) || !parsed.data.selfie.key.startsWith(expectedPrefix) || !parsed.data.identity.key.includes("-identity.") || !parsed.data.selfie.key.includes("-selfie.") || parsed.data.identity.key === parsed.data.selfie.key) {
    return NextResponse.json({ success: false, message: "Invalid storage object ownership." }, { status: 403 });
  }

  let identity: Awaited<ReturnType<typeof inspectStoredObject>>;
  let selfie: Awaited<ReturnType<typeof inspectStoredObject>>;
  try {
    [identity, selfie] = await Promise.all([inspectStoredObject(parsed.data.identity.key), inspectStoredObject(parsed.data.selfie.key)]);
  } catch (error) {
    console.error("vendor-kyc.storage-verification.failed", error);
    return NextResponse.json({ success: false, message: "Uploaded files could not be verified." }, { status: 409 });
  }
  if (identity.contentType !== parsed.data.identity.contentType || identity.size !== parsed.data.identity.size || selfie.contentType !== parsed.data.selfie.contentType || selfie.size !== parsed.data.selfie.size) {
    return NextResponse.json({ success: false, message: "Uploaded file metadata could not be verified." }, { status: 409 });
  }

  const existing = await getPrisma().approvalRequest.findFirst({ where: { resourceType: "vendor-kyc", requestedBy: principal.userId, status: "PENDING" }, select: { id: true } });
  if (existing) return NextResponse.json({ success: false, message: "A KYC verification is already pending." }, { status: 409 });

  try {
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

    return NextResponse.json({ success: true, data: result, message: "KYC verification submitted securely." }, { status: 201 });
  } catch (error) {
    console.error("vendor-kyc.submission.failed", error);
    return NextResponse.json({ success: false, message: "Unable to record the KYC submission." }, { status: 500 });
  }
}
