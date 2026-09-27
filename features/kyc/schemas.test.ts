import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MAX_KYC_FILE_BYTES, isKycImageContentType, kycUploadRequestSchema } from "./schemas.ts";

describe("KYC upload validation", () => {
  it("accepts supported identity image documents within the size limit", () => {
    assert.equal(kycUploadRequestSchema.safeParse({ kind: "identity", fileName: "passport.jpg", contentType: "image/jpeg", size: 1024 }).success, true);
    assert.equal(kycUploadRequestSchema.safeParse({ kind: "identity", fileName: "nin.png", contentType: "image/png", size: 1024 }).success, true);
  });

  it("rejects non-image documents such as PDF or Word files", () => {
    assert.equal(kycUploadRequestSchema.safeParse({ kind: "identity", fileName: "passport.pdf", contentType: "application/pdf", size: 1024 }).success, false);
    assert.equal(kycUploadRequestSchema.safeParse({ kind: "identity", fileName: "doc.docx", contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", size: 1024 }).success, false);
  });

  it("rejects files larger than 40 MB", () => {
    assert.equal(kycUploadRequestSchema.safeParse({ kind: "identity", fileName: "large.jpg", contentType: "image/jpeg", size: MAX_KYC_FILE_BYTES + 1 }).success, false);
  });

  it("verifies supported image content types", () => {
    assert.equal(isKycImageContentType("image/jpeg"), true);
    assert.equal(isKycImageContentType("image/png"), true);
    assert.equal(isKycImageContentType("application/pdf"), false);
  });
});
