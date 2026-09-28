import React from "react";
import { cn } from "@/lib/utils";

export function GuillochePattern({
  className,
  strokeColor = "rgba(16, 185, 129, 0.08)",
}: {
  className?: string;
  strokeColor?: string;
}) {
  return (
    <svg
      viewBox="0 0 1200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full pointer-events-none select-none", className)}
      preserveAspectRatio="none"
    >
      {/* Harmonic Curvature Wave 1 */}
      <path
        d="M0 60 C 150 10, 300 110, 450 60 C 600 10, 750 110, 900 60 C 1050 10, 1150 100, 1200 60"
        stroke={strokeColor}
        strokeWidth="1.2"
        fill="none"
      />
      {/* Harmonic Curvature Wave 2 */}
      <path
        d="M0 60 C 150 110, 300 10, 450 60 C 600 110, 750 10, 900 60 C 1050 110, 1150 20, 1200 60"
        stroke={strokeColor}
        strokeWidth="1.2"
        fill="none"
      />
      {/* Intersecting Guilloche Filigree 3 */}
      <path
        d="M0 40 C 200 80, 400 0, 600 40 C 800 80, 1000 0, 1200 40"
        stroke={strokeColor}
        strokeWidth="0.8"
        strokeDasharray="4 3"
        fill="none"
      />
      <path
        d="M0 80 C 200 0, 400 80, 600 80 C 800 0, 1000 80, 1200 80"
        stroke={strokeColor}
        strokeWidth="0.8"
        strokeDasharray="4 3"
        fill="none"
      />
      {/* Dual Center Rails */}
      <line x1="0" y1="58" x2="1200" y2="58" stroke={strokeColor} strokeWidth="0.75" />
      <line x1="0" y1="62" x2="1200" y2="62" stroke={strokeColor} strokeWidth="0.75" />
    </svg>
  );
}
