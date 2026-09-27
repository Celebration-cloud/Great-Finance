import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { logEvent } from "./logger.ts";

describe("structured logging", () => {
  it("redacts credential fields and credential-shaped strings", () => {
    let output = "";
    const original = console.error;
    console.error = (value) => { output = String(value); };
    logEvent("error", "test.failure", {
      authorization: "Bearer private-token",
      error: new Error("provider rejected sk_test_privatevalue"),
    });
    console.error = original;

    assert.equal(output.includes("private-token"), false);
    assert.equal(output.includes("sk_test_privatevalue"), false);
    assert.match(output, /\[REDACTED\]/);
  });
});
