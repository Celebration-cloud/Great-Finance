import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server.js";
import { AppError, normalizeError } from "../errors/app-error.ts";
import { logEvent } from "../observability/logger.ts";

export type ApiContext = { requestId: string; operation: string };

function safeIncomingRequestId(request: Request) {
  const value = request.headers.get("x-request-id");
  return value && /^[A-Za-z0-9._:-]{8,100}$/.test(value) ? value : undefined;
}

export function createApiContext(request: Request, operation: string): ApiContext {
  return { requestId: safeIncomingRequestId(request) ?? randomUUID(), operation };
}

function responseHeaders(context: ApiContext) {
  return { "x-request-id": context.requestId };
}

export function apiSuccess<T>(context: ApiContext, data: T, message: string, status = 200) {
  return NextResponse.json({ success: true, data, message, requestId: context.requestId }, { status, headers: responseHeaders(context) });
}

export function apiMessage(context: ApiContext, message: string, status = 200) {
  return NextResponse.json({ success: true, message, requestId: context.requestId }, { status, headers: responseHeaders(context) });
}

export function apiProtocolJson(context: ApiContext, payload: unknown, status = 200) {
  return NextResponse.json(payload, { status, headers: responseHeaders(context) });
}

export function apiError(context: ApiContext, input: unknown, fallbackMessage?: string) {
  const error = normalizeError(input, fallbackMessage);
  if (error.report !== "none") {
    logEvent(error.report, `${context.operation}.failed`, {
      requestId: context.requestId,
      code: error.code,
      status: error.status,
      retryable: error.retryable,
      error: error.cause ?? error,
    });
  }

  const fieldErrors = error.details?.fieldErrors;
  const headers: Record<string, string> = { ...responseHeaders(context), "Cache-Control": "no-store" };
  if (error.code === "RATE_LIMITED") {
    headers["Retry-After"] = String(error.details?.retryAfter ?? "60");
  }
  return NextResponse.json({
    success: false,
    error: {
      code: error.code,
      message: error.message,
      requestId: context.requestId,
      retryable: error.retryable,
      ...(fieldErrors ? { fieldErrors } : {}),
    },
    // Compatibility fields for existing clients during the response-contract migration.
    message: error.message,
    ...(fieldErrors ? { errors: fieldErrors } : {}),
    requestId: context.requestId,
  }, {
    status: error.status,
    headers,
  });
}

export async function withApiHandler(request: Request, operation: string, handler: (context: ApiContext) => Promise<Response>) {
  const context = createApiContext(request, operation);
  try {
    return await handler(context);
  } catch (error) {
    return apiError(context, error);
  }
}

export async function readJson(request: Request) {
  try {
    return await request.json() as unknown;
  } catch (cause) {
    throw new AppError("MALFORMED_JSON", { status: 400, message: "The request body must be valid JSON.", cause });
  }
}
