import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MAX_KYC_FILE_BYTES, kycUploadRequestSchema } from "./schemas.ts";

describe("KYC upload validation", () => {
  it("accepts supported identity documents within the size limit", () => {
    assert.equal(kycUploadRequestSchema.safeParse({ kind: "identity", fileName: "passport.pdf", contentType: "application/pdf", size: 1024 }).success, true);
  });

  it("requires JPEG for the verification photo", () => {
    assert.equal(kycUploadRequestSchema.safeParse({ kind: "selfie", fileName: "photo.png", contentType: "image/png", size: 1024 }).success, false);
  });

  it("rejects files larger than 40 MB", () => {
    assert.equal(kycUploadRequestSchema.safeParse({ kind: "identity", fileName: "large.pdf", contentType: "application/pdf", size: MAX_KYC_FILE_BYTES + 1 }).success, false);
  });
});
