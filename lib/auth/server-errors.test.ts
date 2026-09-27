import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { classifyAuthServerError } from "./server-errors.ts";

describe("server authentication error classification", () => {
  it("distinguishes invalid sessions from provider outages", () => {
    assert.equal(classifyAuthServerError({ status: 401 }).code, "AUTH_SESSION_INVALID");
    assert.equal(classifyAuthServerError({ status: 503 }).code, "AUTH_SERVICE_UNAVAILABLE");
  });

  it("preserves authentication rate limits", () => {
    const error = classifyAuthServerError({ status: 429 });
    assert.equal(error.code, "RATE_LIMITED");
    assert.equal(error.retryable, true);
  });
});
