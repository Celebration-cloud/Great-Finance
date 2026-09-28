import React from "react";
import { cn } from "@/lib/utils";

export function TundeAuditVault({ className }: { className?: string }) {
  return (
    <div className={cn("relative select-none", className)}>
      <svg
        viewBox="0 0 600 640"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-2xl"
      >
        <defs>
          <linearGradient id="tunde-suit" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="vault-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(16, 185, 129, 0.18)" />
            <stop offset="100%" stopColor="rgba(8, 12, 14, 0)" />
          </linearGradient>
        </defs>

        {/* Backing Vault Enclosure */}
        <polygon
          points="30,40 570,40 600,70 600,590 570,620 30,620 0,590 0,70"
          fill="#0E1418"
          stroke="#222C35"
          strokeWidth="2"
        />

        <circle cx="300" cy="260" r="190" fill="url(#vault-glow)" />

        {/* Circular Vault Combination Dial */}
        <circle cx="300" cy="260" r="160" stroke="#222C35" strokeWidth="6" />
        <circle cx="300" cy="260" r="130" stroke="#10B981" strokeWidth="2" strokeDasharray="6 8" />

        {/* ================= CHARACTER: TUNDE (SETTLEMENT AUDITOR) ================= */}
        {/* Short neat hair */}
        <ellipse cx="295" cy="135" rx="36" ry="38" fill="#080C0E" stroke="#080C0E" strokeWidth="2" />
        {/* Head & Neck */}
        <rect x="286" y="170" width="18" height="30" rx="4" fill="#78350F" />
        <ellipse cx="295" cy="160" rx="30" ry="34" fill="#92400E" stroke="#080C0E" strokeWidth="2.5" />

        {/* Stylized Glasses (Precision look) */}
        <rect x="274" y="152" width="18" height="14" rx="3" stroke="#F59E0B" strokeWidth="2" fill="rgba(245, 158, 11, 0.1)" />
        <rect x="298" y="152" width="18" height="14" rx="3" stroke="#F59E0B" strokeWidth="2" fill="rgba(245, 158, 11, 0.1)" />
        <line x1="292" y1="158" x2="298" y2="158" stroke="#F59E0B" strokeWidth="2" />

        {/* Confident Smile */}
        <path d="M288 178 Q295 184 302 178" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Tailored Dark Navy Suit & Emerald Tie */}
        <path d="M240 210 L280 196 L310 196 L350 210 L365 390 L225 390 Z" fill="url(#tunde-suit)" stroke="#080C0E" strokeWidth="2.5" />
        <polygon points="280,196 310,196 295,240" fill="#F8FAFC" />
        <polygon points="292,205 298,205 301,270 289,270" fill="#10B981" />

        {/* Arms Holding the Stamp of Approval */}
        <path d="M240 210 Q200 280 230 340" stroke="#0F172A" strokeWidth="22" strokeLinecap="round" />
        <circle cx="230" cy="345" r="13" fill="#78350F" stroke="#080C0E" strokeWidth="2" />

        <path d="M350 210 Q390 280 360 340" stroke="#0F172A" strokeWidth="22" strokeLinecap="round" />
        <circle cx="360" cy="345" r="13" fill="#78350F" stroke="#080C0E" strokeWidth="2" />

        {/* ================= VAULT SCREEN: RECONCILED PAYOUT ================= */}
        <g transform="translate(180, 310)">
          <rect x="0" y="0" width="240" height="150" rx="14" fill="#080C0E" stroke="#10B981" strokeWidth="2.5" />
          <rect x="8" y="8" width="224" height="134" rx="8" fill="#0E1418" />

          <text x="20" y="32" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#F59E0B">NUBAN BANK TRANSFER APPROVED</text>
          <text x="20" y="58" fontFamily="monospace" fontSize="20" fontWeight="900" fill="#10B981">₦150,000.00</text>
          <text x="20" y="78" fontFamily="system-ui" fontSize="9" fill="#94A3B8">GTBank account: 012****891</text>
          <text x="20" y="94" fontFamily="system-ui" fontSize="9" fill="#94A3B8">Hash: e3b0c44298fc1c149afbf4c8996fb924</text>

          {/* Verification Badge */}
          <rect x="20" y="108" width="100" height="22" rx="4" fill="rgba(16, 185, 129, 0.2)" stroke="#10B981" strokeWidth="1" />
          <text x="32" y="123" fontFamily="monospace" fontSize="8" fontWeight="bold" fill="#6EE7B7">DISPATCHED</text>
        </g>
      </svg>
    </div>
  );
}
