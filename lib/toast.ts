/**
 * Lightweight toast store — no external library required.
 * Uses the standard `useSyncExternalStore` React API so it is fully
 * compatible with Concurrent Mode and Server Components (the store itself
 * is module-level; it only runs in the browser).
 */

export type ToastKind = "success" | "error" | "info";

export type Toast = {
  id: string;
  kind: ToastKind;
  message: string;
};

type Listener = () => void;

const EMPTY_TOASTS: readonly Toast[] = Object.freeze([]);

let toasts: readonly Toast[] = EMPTY_TOASTS;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l());
}

function addToast(kind: ToastKind, message: string, durationMs = 4000) {
  const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  toasts = [...toasts, { id, kind, message }];
  notify();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  }, durationMs);
}

export const toast = {
  success: (message: string, durationMs?: number) => addToast("success", message, durationMs),
  error: (message: string, durationMs?: number) => addToast("error", message, durationMs),
  info: (message: string, durationMs?: number) => addToast("info", message, durationMs),
};

// Allow the Toaster UI to eagerly dismiss a specific toast by ID.
if (typeof window !== "undefined") {
  window.addEventListener("toast:dismiss", (e) => {
    const id = (e as CustomEvent<string>).detail;
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  });
}

export const toastStore = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  },
  getSnapshot(): readonly Toast[] {
    return toasts;
  },
  getServerSnapshot(): readonly Toast[] {
    return EMPTY_TOASTS;
  },
};
