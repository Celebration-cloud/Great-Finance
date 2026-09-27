"use client";

import { useCallback, useRef, useState } from "react";
import { type UseFormSetError } from "react-hook-form";
import { apiFetch } from "@/lib/http/api-fetch";
import { toast } from "@/lib/toast";
import type { ApiErrorDetail, ApiResult } from "@/lib/http/client-error";

export type MutationStatus = "idle" | "loading" | "success" | "error";

export type UseApiMutationOptions<TData> = {
  /** HTTP method — defaults to POST. */
  method?: "POST" | "PUT" | "PATCH" | "DELETE";
  /** Toast message on success. Pass false to suppress. */
  successMessage?: string | false;
  /** Toast message on error. Pass false to suppress and handle manually. */
  errorMessage?: string | false;
  /**
   * React Hook Form `setError` — when provided, validation field errors
   * returned by the server are wired back to form fields automatically.
   * Pass `setError as UseFormSetError<FieldValues>` at the call site to
   * satisfy the widened type without losing field-name safety in the form.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setError?: UseFormSetError<any>;
  /** Called after a successful mutation. */
  onSuccess?: (data: TData, message: string) => void;
  /** Called after a failed mutation. */
  onError?: (error: ApiErrorDetail) => void;
};

export type UseApiMutationReturn<TData, TBody> = {
  mutate: (body: TBody) => Promise<ApiResult<TData>>;
  reset: () => void;
  status: MutationStatus;
  data: TData | undefined;
  error: ApiErrorDetail | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
};

/**
 * Generic mutation hook for POST/PUT/PATCH/DELETE API calls.
 *
 * @example — with React Hook Form field error wiring
 * const { mutate, isLoading } = useApiMutation<{ reference: string }, InitPayload>(
 *   "/api/payments/initialize",
 *   { successMessage: "Payment initialized!", setError },
 * );
 *
 * @example — plain button handler
 * const { mutate, isLoading, error } = useApiMutation<MyData, MyBody>("/api/my-route");
 */
export function useApiMutation<TData, TBody extends object | FormData = object>(
  url: string,
  options: UseApiMutationOptions<TData> = {},
): UseApiMutationReturn<TData, TBody> {
  const { method = "POST", successMessage, errorMessage, setError, onSuccess, onError } = options;
  const [status, setStatus] = useState<MutationStatus>("idle");
  const [data, setData] = useState<TData | undefined>(undefined);
  const [error, setErrorState] = useState<ApiErrorDetail | undefined>(undefined);

  // Keep options in a ref so the stable `mutate` callback always sees the latest values.
  const optsRef = useRef(options);
  optsRef.current = options;

  const mutate = useCallback(
    async (body: TBody): Promise<ApiResult<TData>> => {
      setStatus("loading");
      setErrorState(undefined);

      const init: RequestInit = { method };
      if (body instanceof FormData) {
        // Let the browser set multipart/form-data boundary automatically.
        init.body = body;
      } else {
        init.body = JSON.stringify(body);
      }

      const result = await apiFetch<TData>(url, init);

      if (result.ok) {
        setStatus("success");
        setData(result.data);
        if (optsRef.current.successMessage !== false) {
          toast.success(optsRef.current.successMessage ?? result.message);
        }
        optsRef.current.onSuccess?.(result.data, result.message);
      } else {
        setStatus("error");
        setErrorState(result.error);

        // Wire server-side field errors back to React Hook Form fields.
        if (optsRef.current.setError && result.error.fieldErrors) {
          for (const [field, messages] of Object.entries(result.error.fieldErrors)) {
            const msg = Array.isArray(messages) ? messages[0] : String(messages);
            optsRef.current.setError(field, { message: msg });
          }
        }

        if (optsRef.current.errorMessage !== false) {
          toast.error(optsRef.current.errorMessage ?? result.error.message);
        }
        optsRef.current.onError?.(result.error);
      }

      return result;
    },
    [url, method],
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setData(undefined);
    setErrorState(undefined);
  }, []);

  return {
    mutate,
    reset,
    status,
    data,
    error,
    isLoading: status === "loading",
    isSuccess: status === "success",
    isError: status === "error",
  };
}
