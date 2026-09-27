export type ApiErrorPayload = {
  message?: string;
  requestId?: string;
  error?: { message?: string; requestId?: string; retryable?: boolean; code?: string; fieldErrors?: Record<string, unknown> };
};

/** Structured error detail extracted from a failed API response. */
export type ApiErrorDetail = {
  code: string;
  message: string;
  retryable: boolean;
  requestId?: string;
  fieldErrors?: Record<string, string[]>;
};

/** Discriminated union returned by `apiFetch`. Never throws. */
export type ApiResult<T> =
  | { ok: true; data: T; message: string }
  | { ok: false; error: ApiErrorDetail };

export function getApiErrorMessage(payload: ApiErrorPayload | undefined, fallback: string) {
  const message = payload?.error?.message ?? payload?.message ?? fallback;
  const requestId = payload?.error?.requestId ?? payload?.requestId;
  return requestId ? `${message} Reference: ${requestId}` : message;
}

export function extractApiError(payload: ApiErrorPayload | undefined, fallback: string): ApiErrorDetail {
  return {
    code: payload?.error?.code ?? "INTERNAL_ERROR",
    message: getApiErrorMessage(payload, fallback),
    retryable: payload?.error?.retryable ?? false,
    requestId: payload?.error?.requestId ?? payload?.requestId,
    fieldErrors: payload?.error?.fieldErrors as Record<string, string[]> | undefined,
  };
}
