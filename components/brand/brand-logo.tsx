import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  variant?: "horizontal" | "stacked" | "symbol";
  size?: "sm" | "md" | "lg";
  className?: string;
  withLink?: boolean;
}

export function SovereignMark({ className, size = 36 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 transition-transform duration-300", className)}
      aria-label="Great Finance logo"
    >
      <defs>
        <linearGradient id="gf-emerald-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="gf-ochre-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>

      {/* Outer Folio Shield with 45-degree chamfers */}
      <polygon
        points="14,0 86,0 100,14 100,86 86,100 14,100 0,86 0,14"
        fill="#0E1418"
        stroke="#222C35"
        strokeWidth="2"
      />

      {/* Secondary Internal Guideline Rail */}
      <polygon
        points="18,7 82,7 93,18 93,82 82,93 18,93 7,82 7,18"
        fill="none"
        stroke="rgba(16, 185, 129, 0.25)"
        strokeWidth="1.5"
        strokeDasharray="4 2"
      />

      {/* Upper Credit Arm (F-Vector in Emerald) */}
      <path
        d="M26 24 H74 V36 H42 V44 H66 V56 H42 V76 H26 V24 Z"
        fill="url(#gf-emerald-grad)"
      />

      {/* Interlocking Debit Geometry (G-Bar in Ochre) */}
      <path
        d="M74 48 H58 V60 H62 V64 H44 V74 H74 V48 Z"
        fill="url(#gf-ochre-grad)"
      />

      {/* Central Diamond Verification Notch Aperture */}
      <polygon
        points="50,42 58,50 50,58 42,50"
        fill="#080C0E"
        stroke="#10B981"
        strokeWidth="2"
      />

      {/* Micro Ledger Node Dot */}
      <circle cx="50" cy="50" r="2.5" fill="#FBBF24" />
    </svg>
  );
}

export function BrandLogo({
  variant = "horizontal",
  size = "md",
  className,
  withLink = true,
}: BrandLogoProps) {
  const pixelSizes = {
    sm: 28,
    md: 38,
    lg: 48,
  };

  const textStyles = {
    sm: "text-sm",
    md: "text-base tracking-tight",
    lg: "text-xl tracking-tight",
  };

  const content = (
    <div
      className={cn(
        "group inline-flex items-center gap-3 transition-opacity hover:opacity-95 select-none",
        variant === "stacked" ? "flex-col items-start gap-2" : "flex-row",
        className
      )}
    >
      <div className="relative">
        <SovereignMark
          size={pixelSizes[size]}
          className="shadow-lg shadow-emerald-950/40 group-hover:scale-105"
        />
      </div>

      {variant !== "symbol" && (
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "font-display font-extrabold uppercase text-[var(--ink)]",
                textStyles[size]
              )}
            >
              Great<span className="text-[var(--brand)] font-black">Finance</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );

  if (withLink) {
    return (
      <Link href="/" aria-label="Great Finance Home">
        {content}
      </Link>
    );
  }

  return content;
}
