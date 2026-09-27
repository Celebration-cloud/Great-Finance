import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { apiError, createApiContext, readJson } from "./api-response.ts";

describe("API error responses", () => {
  it("returns a stable request ID without exposing the internal cause", async () => {
    const request = new Request("https://great-finance.test/api/test", { headers: { "x-request-id": "request-12345678" } });
    const context = createApiContext(request, "test.operation");
    const original = console.error;
    console.error = () => undefined;
    const response = apiError(context, new Error("database password leaked"), "Unable to complete the test request.");
    console.error = original;
    const body = await response.json();

    assert.equal(response.status, 500);
    assert.equal(response.headers.get("x-request-id"), "request-12345678");
    assert.equal(body.error.code, "INTERNAL_ERROR");
    assert.equal(body.error.message, "Unable to complete the test request.");
    assert.equal(JSON.stringify(body).includes("database password"), false);
  });

  it("classifies malformed JSON as a client error", async () => {
    const request = new Request("https://great-finance.test/api/test", { method: "POST", body: "{" });
    await assert.rejects(readJson(request), (error: unknown) => typeof error === "object" && error !== null && "code" in error && error.code === "MALFORMED_JSON");
  });
});
