import { z } from "zod";

export const MAX_KYC_FILE_BYTES = 40 * 1024 * 1024;

const identityTypes = ["image/jpeg", "image/png", "image/webp"] as const;
const selfieTypes = ["image/jpeg", "image/png", "image/webp"] as const;

export const KYC_IMAGE_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export function isKycImageContentType(contentType: string) {
  return KYC_IMAGE_CONTENT_TYPES.some((type) => type === contentType);
}

export const kycUploadRequestSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("identity"), fileName: z.string().min(1).max(180), contentType: z.enum(identityTypes), size: z.number().int().positive().max(MAX_KYC_FILE_BYTES) }),
  z.object({ kind: z.literal("selfie"), fileName: z.string().min(1).max(180), contentType: z.enum(selfieTypes), size: z.number().int().positive().max(MAX_KYC_FILE_BYTES) }),
]);


const uploadedObjectSchema = z.object({
  key: z.string().min(1).max(600),
  provider: z.enum(["neon-storage", "vercel-blob"]),
  contentType: z.string().min(1).max(120),
  size: z.number().int().positive().max(MAX_KYC_FILE_BYTES),
});

export const kycSubmissionSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  stateOfOrigin: z.string().trim().min(2).max(80),
  localGovernment: z.string().trim().min(2).max(120),
  identity: uploadedObjectSchema,
  selfie: uploadedObjectSchema,
});
