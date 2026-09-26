import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { verifyPaystackSignature } from "./paystack";

describe("Paystack webhook signatures", () => {
  it("accepts the HMAC of the unchanged raw body", () => {
    const body = JSON.stringify({ event: "charge.success", data: { reference: "GF-1" } });
    const secret = "sk_test_signature_secret";
    const signature = createHmac("sha512", secret).update(body).digest("hex");
    expect(verifyPaystackSignature(body, signature, secret)).toBe(true);
    expect(verifyPaystackSignature(`${body} `, signature, secret)).toBe(false);
  });
  it("rejects malformed signatures", () => expect(verifyPaystackSignature("{}", "nope", "secret")).toBe(false));
});
