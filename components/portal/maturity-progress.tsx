"use client";

import { motion, useReducedMotion } from "framer-motion";

interface MaturityProgressProps {
  progress: number;
  unlockLabel: string;
}

/** Progress-card treatment adapted for this dashboard from the 21st.dev pattern. */
export function MaturityProgress({ progress, unlockLabel }: MaturityProgressProps) {
  const reduceMotion = useReducedMotion();
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="border-b border-[var(--line)] bg-[var(--surface)] px-5 py-4">
      <div className="mb-2 flex items-center justify-between gap-4 text-xs text-[var(--muted)]">
        <span>Plan progress</span>
        <span className="font-semibold text-[var(--ink)]">{Math.round(clampedProgress)}% complete</span>
      </div>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--surface-muted)]"
        role="progressbar"
        aria-label="Investment plan progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clampedProgress)}
      >
        <motion.div
          className="h-full w-full origin-left rounded-full bg-gradient-to-r from-[var(--brand-dark)] to-[var(--brand)]"
          initial={reduceMotion ? { scaleX: clampedProgress / 100 } : { scaleX: 0 }}
          whileInView={{ scaleX: clampedProgress / 100 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ type: "spring", stiffness: 95, damping: 20, mass: 0.8 }}
        />
      </div>
      <p className="mt-2 text-xs text-[var(--muted)]">Withdrawals unlock automatically on {unlockLabel}.</p>
    </div>
  );
}
