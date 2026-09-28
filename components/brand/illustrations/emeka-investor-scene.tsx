import React from "react";
import { cn } from "@/lib/utils";

interface EmekaInvestorSceneProps {
  className?: string;
}

export function EmekaInvestorScene({ className }: EmekaInvestorSceneProps) {
  return (
    <div className={cn("relative select-none", className)}>
      <svg
        viewBox="0 0 640 680"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-2xl"
      >
        <defs>
          <linearGradient id="emeka-ochre" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id="emeka-emerald-halo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(16, 185, 129, 0.2)" />
            <stop offset="100%" stopColor="rgba(8, 12, 14, 0)" />
          </linearGradient>
        </defs>

        {/* Backing Chamfered Architectural Folio */}
        <polygon
          points="40,50 600,50 630,80 630,620 590,650 40,650 10,620 10,80"
          fill="#0E1418"
          stroke="#222C35"
          strokeWidth="2"
        />

        {/* Circular Ambient Glow */}
        <circle cx="300" cy="270" r="200" fill="url(#emeka-emerald-halo)" />

        {/* Banknote Micro-Line Filigree Background */}
        <g opacity="0.12">
          <circle cx="300" cy="270" r="160" stroke="#10B981" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="300" cy="270" r="120" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="20" y1="360" x2="620" y2="360" stroke="#10B981" strokeWidth="1" />
        </g>

        {/* ================= CHARACTER: EMEKA (INVESTOR) ================= */}
        {/* Modern clean fade hairstyle */}
        <ellipse cx="290" cy="140" rx="38" ry="40" fill="#151D24" stroke="#080C0E" strokeWidth="2.5" />
        <rect x="256" y="130" width="68" height="24" rx="8" fill="#151D24" />

        {/* Head & Neck */}
        <rect x="282" y="174" width="20" height="34" rx="4" fill="#78350F" />
        <ellipse cx="292" cy="168" rx="32" ry="36" fill="#92400E" stroke="#080C0E" strokeWidth="2.5" />

        {/* Facial Expression (Confident, satisfied) */}
        <ellipse cx="280" cy="164" rx="3.5" ry="4" fill="#080C0E" />
        <ellipse cx="304" cy="164" rx="3.5" ry="4" fill="#080C0E" />
        <circle cx="281" cy="162" r="1.2" fill="#FFFFFF" />
        <circle cx="305" cy="162" r="1.2" fill="#FFFFFF" />
        {/* Subtle Beard Trim */}
        <path d="M266 172 Q292 208 318 172" stroke="#151D24" strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* Smile */}
        <path d="M285 180 Q292 186 300 180" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Torso: Ochre Minimalist Sweater */}
        <path d="M235 220 L275 204 L315 204 L355 220 L370 410 L220 410 Z" fill="url(#emeka-ochre)" stroke="#080C0E" strokeWidth="2.5" />
        {/* Crew Neckline */}
        <path d="M276 205 Q295 218 314 205" stroke="#78350F" strokeWidth="3" fill="none" />

        {/* Left Arm: Holding Smartphone */}
        <path d="M235 220 Q195 290 220 360" stroke="#B45309" strokeWidth="22" strokeLinecap="round" />
        <circle cx="225" cy="365" r="13" fill="#78350F" stroke="#080C0E" strokeWidth="2" />

        {/* Smartphone displaying Bank Confirmation */}
        <g transform="translate(195, 330) rotate(-10)">
          <rect x="0" y="0" width="70" height="120" rx="10" fill="#080C0E" stroke="#10B981" strokeWidth="2.5" />
          <rect x="4" y="4" width="62" height="112" rx="8" fill="#0E1418" />
          <rect x="10" y="14" width="30" height="4" rx="2" fill="#10B981" />
          <text x="10" y="34" fontFamily="monospace" fontSize="8" fontWeight="bold" fill="#F8FAFC">₦70,000</text>
          <text x="10" y="44" fontFamily="monospace" fontSize="6" fill="#10B981">PAID IN FULL</text>
          <circle cx="35" cy="75" r="14" fill="rgba(16, 185, 129, 0.2)" />
          <path d="M29 75 L33 79 L41 71" stroke="#10B981" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>

        {/* Right Arm: Interacting with Floating Yield Node */}
        <path d="M355 220 Q410 270 400 340" stroke="#B45309" strokeWidth="22" strokeLinecap="round" />
        <circle cx="400" cy="345" r="13" fill="#78350F" stroke="#080C0E" strokeWidth="2" />

        {/* ================= FLOATING MATURED YIELD CARD ================= */}
        <g transform="translate(360, 240)">
          <polygon points="10,0 230,0 240,10 240,140 230,150 10,150 0,140 0,10" fill="#0E1418" stroke="#10B981" strokeWidth="2" />
          <rect x="14" y="14" width="100" height="8" rx="2" fill="#F59E0B" />
          <text x="14" y="38" fontFamily="system-ui" fontSize="10" fontWeight="bold" fill="#94A3B8">PLATINUM PLAN MATURITY</text>
          <text x="14" y="66" fontFamily="monospace" fontSize="22" fontWeight="900" fill="#10B981">₦70,000.00</text>
          <text x="14" y="86" fontFamily="system-ui" fontSize="9" fill="#F8FAFC">Principal: ₦50,000, ROI: +40%</text>

          {/* Double-entry status tag */}
          <rect x="14" y="104" width="130" height="24" rx="4" fill="rgba(16, 185, 129, 0.15)" stroke="#10B981" strokeWidth="1" />
          <text x="24" y="120" fontFamily="monospace" fontSize="8.5" fontWeight="bold" fill="#6EE7B7">DOUBLE-ENTRY BALANCED</text>
        </g>

        {/* ================= FLOATING DOUBLE-ENTRY SCALE ================= */}
        <g transform="translate(60, 180)">
          <rect x="0" y="0" width="170" height="70" rx="10" fill="#080C0E" stroke="#222C35" strokeWidth="1.5" />
          <text x="16" y="24" fontFamily="system-ui" fontSize="9" fontWeight="bold" fill="#94A3B8">LEDGER INVARIANT</text>
          <text x="16" y="44" fontFamily="monospace" fontSize="14" fontWeight="bold" fill="#F8FAFC">Assets ≡ Liabilities</text>
          <text x="16" y="58" fontFamily="monospace" fontSize="8" fill="#10B981">Zero Unbacked Risk</text>
        </g>
      </svg>
    </div>
  );
}
