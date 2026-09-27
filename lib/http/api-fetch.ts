import { type ApiErrorPayload, type ApiResult, extractApiError } from "./client-error";

/**
 * Typed fetch wrapper that maps the server's canonical JSON contract to a
 * discriminated union. It never throws — network failures are returned as
 * `{ ok: false, error: ApiErrorDetail }` just like server-side API errors.
 *
 * @example
 * const result = await apiFetch<{ reference: string }>("/api/payments/initialize", {
 *   method: "POST",
 *   body: JSON.stringify(payload),
 * });
 * if (!result.ok) { console.error(result.error.message); return; }
 * console.log(result.data.reference);
 */
export async function apiFetch<T>(
  url: string,
  init?: RequestInit,
): Promise<ApiResult<T>> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (init?.headers) {
    const incoming = init.headers instanceof Headers
      ? Object.fromEntries(init.headers.entries())
      : init.headers as Record<string, string>;
    Object.assign(headers, incoming);
  }

  let response: Response;
  try {
    response = await fetch(url, { ...init, headers });
  } catch {
    return {
      ok: false,
      error: {
        code: "NETWORK_ERROR",
        message: "The service could not be reached. Check your connection and try again.",
        retryable: true,
      },
    };
  }

  let payload: ApiErrorPayload & { data?: T; message?: string };
  try {
    payload = await response.json() as typeof payload;
  } catch {
    return {
      ok: false,
      error: {
        code: "MALFORMED_RESPONSE",
        message: "The server returned an unexpected response.",
        retryable: false,
      },
    };
  }

  if (!response.ok) {
    return { ok: false, error: extractApiError(payload, "The request could not be completed.") };
  }

  return {
    ok: true,
    data: payload.data as T,
    message: payload.message ?? "Done.",
  };
}
