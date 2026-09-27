"use client";

import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { toastStore, type Toast } from "@/lib/toast";

const icons = {
  success: <CheckCircle size={18} className="shrink-0 text-emerald-600" />,
  error: <XCircle size={18} className="shrink-0 text-[var(--danger)]" />,
  info: <Info size={18} className="shrink-0 text-[var(--brand)]" />,
};

const styles: Record<Toast["kind"], string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-red-200 bg-red-50 text-red-900",
  info: "border-blue-200 bg-blue-50 text-blue-900",
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  return (
    <motion.li
      layout
      role="status"
      aria-live="polite"
      aria-atomic="true"
      initial={{ opacity: 0, y: -12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg max-w-sm text-sm font-medium ${styles[toast.kind]}`}
    >
      {icons[toast.kind]}
      <p className="flex-1 leading-5">{toast.message}</p>
      <button
        aria-label="Dismiss notification"
        onClick={onDismiss}
        className="mt-0.5 opacity-50 hover:opacity-100 transition-opacity"
      >
        <X size={14} />
      </button>
    </motion.li>
  );
}

/**
 * Mount this once in `app/layout.tsx` inside `<body>`.
 * It renders toasts fired via `import { toast } from "@/lib/toast"`.
 */
export function Toaster() {
  const items = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getServerSnapshot,
  );

  // Manually dismiss — remove from module-level store snapshot by forcing re-render
  function dismiss(id: string) {
    // The store's auto-remove timeout handles cleanup; we just trigger it early
    // by overwriting the array directly and notifying listeners.
    // Access the internal notify function via a small shim.
    const event = new CustomEvent("toast:dismiss", { detail: id });
    window.dispatchEvent(event);
  }

  return (
    <ul
      aria-label="Notifications"
      className="fixed right-4 top-4 z-[9999] grid gap-2 pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {items.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={() => dismiss(t.id)} />
          </div>
        ))}
      </AnimatePresence>
    </ul>
  );
}
