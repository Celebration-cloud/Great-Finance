import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import { verifyPaystackSignature } from "./paystack-signature.ts";

describe("Paystack webhook signatures", () => {
  it("accepts the HMAC of the unchanged raw body", () => {
    const body = JSON.stringify({ event: "charge.success", data: { reference: "GF-1" } });
    const secret = "sk_test_signature_secret";
    const signature = createHmac("sha512", secret).update(body).digest("hex");
    assert.equal(verifyPaystackSignature(body, signature, secret), true);
    assert.equal(verifyPaystackSignature(`${body} `, signature, secret), false);
  });
  it("rejects malformed signatures", () => assert.equal(verifyPaystackSignature("{}", "nope", "secret"), false));
});
