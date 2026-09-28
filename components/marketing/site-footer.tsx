import Link from "next/link";
import { Mail, MessageCircle, ShieldCheck, Lock, Landmark } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { GuillochePattern } from "@/components/brand/illustrations/guilloche-pattern";

export function SiteFooter() {
  return (
    <footer className="bg-[var(--surface-inverse)] text-white border-t border-[var(--line)] relative overflow-hidden">
      {/* Banknote Guilloche Security Pattern Accent */}
      <div className="absolute top-0 left-0 right-0 h-16 opacity-30 pointer-events-none">
        <GuillochePattern />
      </div>

      {/* Top Banner / Trust Bar */}
      <div className="border-b border-white/10 bg-white/[0.02] relative z-10">
        <div className="shell grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/5 text-[var(--brand)] border border-white/10">
              <ShieldCheck size={20} />
            </span>
            <div>
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--brand)]">Double-Entry Ledger</p>
              <p className="text-xs text-white/70">Cryptographically verifiable balances</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/5 text-[var(--accent)] border border-white/10">
              <Lock size={20} />
            </span>
            <div>
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)]">Private Vault Storage</p>
              <p className="text-xs text-white/70">Encrypted identity & KYC storage</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/5 text-[var(--brand)] border border-white/10">
              <Mail size={20} />
            </span>
            <div>
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--brand)]">Official Desk</p>
              <a href="mailto:greatfinanceng@gmail.com" className="text-xs text-white/70 hover:text-white transition">greatfinanceng@gmail.com</a>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/5 text-emerald-400 border border-white/10">
              <MessageCircle size={20} />
            </span>
            <div>
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">Direct WhatsApp</p>
              <a href="https://wa.me/2347031069524" target="_blank" rel="noopener noreferrer" className="text-xs text-white/70 hover:text-white transition">07031069524</a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="shell grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-5 relative z-10">
        {/* Brand column */}
        <div className="lg:col-span-2 space-y-4">
          <BrandLogo variant="horizontal" size="lg" />
          <p className="max-w-sm text-sm leading-relaxed text-white/60">
            A secure financial operations platform providing verified yield plans, automated coupon reconciliation, and an authorized vendor distribution network across Nigeria.
          </p>
          <div className="flex flex-wrap gap-2 text-xs text-white/40 pt-2 font-mono">
            <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1">Neon Lakebase Postgres</span>
            <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1">Paystack Verified</span>
            <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1">Balanced Invariant</span>
          </div>
        </div>

        {/* Column 2: Platform */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">Platform</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            <li><Link href="/" className="hover:text-white transition">Home Overview</Link></li>
            <li><Link href="/about" className="hover:text-white transition">About Great Finance</Link></li>
            <li><Link href="/plans" className="hover:text-white transition">Investment Plans</Link></li>
            <li><Link href="/withdrawals" className="hover:text-white transition">Withdrawals & Payouts</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">Support & Contact</Link></li>
          </ul>
        </div>

        {/* Column 3: Vendor Program */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">Vendor Network</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            <li><Link href="/vendors" className="hover:text-white transition">Partner Program</Link></li>
            <li><Link href="/vendor/signup" className="text-[var(--accent)] font-semibold hover:underline transition">Register as Vendor</Link></li>
            <li><Link href="/vendor/login" className="hover:text-white transition">Vendor Portal Login</Link></li>
            <li><Link href="/vendors#faq" className="hover:text-white transition">Wholesale Margin FAQ</Link></li>
          </ul>
        </div>

        {/* Column 4: Client Portals */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">Portals & Access</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            <li><Link href="/login" className="hover:text-white transition">Customer Sign In</Link></li>
            <li><Link href="/signup" className="hover:text-white transition">Create Customer Account</Link></li>
            <li><Link href="/vendor/login" className="hover:text-white transition">Authorized Vendor Portal</Link></li>
            <li><Link href="/admin" className="hover:text-white transition text-white/40">Administration Gateway</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright & Disclaimer */}
      <div className="border-t border-white/10 py-8">
        <div className="shell flex flex-col gap-4 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Great Finance. All rights reserved. Registered financial operations & distribution network.</p>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-white transition">Terms & Architecture</Link>
            <Link href="/contact" className="hover:text-white transition">Security Policy</Link>
            <Link href="/vendors" className="hover:text-white transition">Vendor Charter</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
