import React from "react";
import { cn } from "@/lib/utils";

interface AminaVendorSceneProps {
  className?: string;
}

export function AminaVendorScene({ className }: AminaVendorSceneProps) {
  return (
    <div className={cn("relative select-none", className)}>
      <svg
        viewBox="0 0 640 680"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-2xl"
      >
        <defs>
          <linearGradient id="amina-blazer" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#064E3B" />
          </linearGradient>
          <linearGradient id="amina-gold-chip" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="amina-halo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(16, 185, 129, 0.15)" />
            <stop offset="100%" stopColor="rgba(8, 12, 14, 0)" />
          </linearGradient>
          <filter id="amina-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background Architectural Backing */}
        <polygon
          points="60,40 580,40 620,80 620,600 580,640 60,640 20,600 20,80"
          fill="#0E1418"
          stroke="#222C35"
          strokeWidth="2"
        />

        {/* Ambient Halo behind Character */}
        <circle cx="340" cy="280" r="210" fill="url(#amina-halo)" />

        {/* Micro-guilloche security grid behind */}
        <g opacity="0.15">
          <line x1="60" y1="140" x2="580" y2="140" stroke="#10B981" strokeWidth="1" strokeDasharray="6 4" />
          <line x1="60" y1="280" x2="580" y2="280" stroke="#10B981" strokeWidth="1" strokeDasharray="6 4" />
          <line x1="60" y1="420" x2="580" y2="420" stroke="#10B981" strokeWidth="1" strokeDasharray="6 4" />
          <line x1="200" y1="40" x2="200" y2="640" stroke="#10B981" strokeWidth="1" strokeDasharray="6 4" />
          <line x1="440" y1="40" x2="440" y2="640" stroke="#10B981" strokeWidth="1" strokeDasharray="6 4" />
        </g>

        {/* ================= CHARACTER: AMINA (REGIONAL VENDOR) ================= */}
        {/* Hair: Elegant high braided bun/updo */}
        <ellipse cx="320" cy="120" rx="46" ry="48" fill="#151D24" stroke="#080C0E" strokeWidth="2.5" />
        <circle cx="320" cy="85" r="32" fill="#1E293B" stroke="#080C0E" strokeWidth="2.5" />
        {/* Braided texture details */}
        <path d="M305 75 Q320 85 335 75 M302 90 Q320 100 338 90 M300 105 Q320 115 340 105" stroke="#334155" strokeWidth="2" fill="none" />

        {/* Head & Neck */}
        <rect x="310" y="160" width="20" height="32" rx="4" fill="#92400E" />
        <ellipse cx="320" cy="155" rx="34" ry="38" fill="#B45309" stroke="#080C0E" strokeWidth="2.5" />

        {/* Facial Features (Stylized & Confident) */}
        <ellipse cx="308" cy="150" rx="3.5" ry="4" fill="#080C0E" />
        <ellipse cx="332" cy="150" rx="3.5" ry="4" fill="#080C0E" />
        {/* Catchlight */}
        <circle cx="309" cy="148" r="1.2" fill="#FFFFFF" />
        <circle cx="333" cy="148" r="1.2" fill="#FFFFFF" />
        {/* Eyebrows */}
        <path d="M302 142 Q308 138 315 142" stroke="#080C0E" strokeWidth="2" fill="none" />
        <path d="M325 142 Q332 138 338 142" stroke="#080C0E" strokeWidth="2" fill="none" />
        {/* Smile */}
        <path d="M312 168 Q320 174 328 168" stroke="#080C0E" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Gold Hoop Earring */}
        <circle cx="286" cy="158" r="7" stroke="#F59E0B" strokeWidth="2.5" fill="none" />

        {/* Tailored Emerald Blazer & Inner Shirt */}
        <path d="M260 210 L310 190 L330 190 L380 210 L395 380 L245 380 Z" fill="url(#amina-blazer)" stroke="#080C0E" strokeWidth="2.5" />
        {/* Crisp White Inner Collar */}
        <polygon points="310,190 330,190 320,235" fill="#F8FAFC" stroke="#080C0E" strokeWidth="2" />
        {/* Blazer Lapels */}
        <path d="M280 215 L320 270 L285 340" stroke="#064E3B" strokeWidth="3" fill="none" />
        <path d="M360 215 L320 270 L355 340" stroke="#064E3B" strokeWidth="3" fill="none" />

        {/* Arms & Hands */}
        {/* Left Arm: Holding and gesturing towards UI */}
        <path d="M260 210 Q215 280 185 330" stroke="#064E3B" strokeWidth="24" strokeLinecap="round" />
        <circle cx="180" cy="336" r="14" fill="#B45309" stroke="#080C0E" strokeWidth="2" />

        {/* Right Arm: Holding the Holographic Ledger Tablet */}
        <path d="M380 210 Q425 270 410 335" stroke="#064E3B" strokeWidth="24" strokeLinecap="round" />
        <circle cx="410" cy="340" r="14" fill="#B45309" stroke="#080C0E" strokeWidth="2" />

        {/* ================= THE HOLOGRAPHIC LEDGER TABLET ================= */}
        <g transform="translate(350, 310) rotate(-6)">
          {/* Tablet Frame */}
          <rect x="0" y="0" width="160" height="210" rx="14" fill="#080C0E" stroke="#10B981" strokeWidth="3" />
          <rect x="6" y="6" width="148" height="198" rx="10" fill="#0E1418" />

          {/* Screen Content */}
          <rect x="16" y="18" width="80" height="8" rx="2" fill="#10B981" />
          <text x="16" y="44" fontFamily="monospace" fontSize="13" fontWeight="bold" fill="#F8FAFC">₦150,000</text>
          <text x="16" y="58" fontFamily="monospace" fontSize="8" fill="#10B981">+15% MARGIN</text>

          {/* Micro Bar Chart */}
          <rect x="16" y="110" width="14" height="40" rx="2" fill="#334155" />
          <rect x="36" y="95" width="14" height="55" rx="2" fill="#334155" />
          <rect x="56" y="80" width="14" height="70" rx="2" fill="#10B981" />
          <rect x="76" y="65" width="14" height="85" rx="2" fill="#F59E0B" />
          <rect x="96" y="50" width="14" height="100" rx="2" fill="#10B981" />

          {/* Verification Chip Button */}
          <rect x="16" y="165" width="128" height="26" rx="6" fill="#10B981" />
          <text x="33" y="182" fontFamily="system-ui" fontSize="9" fontWeight="bold" fill="#080C0E">COUPON INVENTORY</text>
        </g>

        {/* Projection Laser Guideline (linking Tablet to Base) */}
        <line x1="380" y1="520" x2="320" y2="620" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="500" y1="460" x2="540" y2="580" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="1.5" strokeDasharray="3 3" />
      </svg>
    </div>
  );
}
