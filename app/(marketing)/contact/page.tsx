import Link from "next/link";
import { Mail, MessageCircle, Store, Clock, ArrowRight, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Contact and Support | Great Finance",
  description:
    "Official communication channels for Great Finance. Reach our customer support desk and regional vendor dispatch via email and verified WhatsApp.",
};

export default function ContactPage() {
  return (
    <div className="space-y-24 py-8 sm:space-y-36 sm:py-14">
      {/* ========================================================================= */}
      {/* 01. HERO */}
      {/* ========================================================================= */}
      <section className="shell">
        <div className="max-w-3xl space-y-6">
          <div>
            <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-[var(--ink)] leading-[1.08]">
              We are here to assist your{" "}
              <span className="text-[var(--brand)]">financial journey</span>.
            </h1>
          </div>

          <p className="text-base sm:text-lg leading-relaxed text-[var(--muted)]">
            Whether you need assistance with customer registration, investment plan coupon redemption, or authorized vendor onboarding, our dedicated desks are available.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 02. CONTACT CHANNELS GRID */}
      {/* ========================================================================= */}
      <section className="shell">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Email Channel */}
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 sm:p-12 space-y-6 shadow-xl">
            <span className="grid size-12 place-items-center rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
              <Mail size={24} />
            </span>
            <div className="space-y-3">
              <span className="text-sm font-bold text-emerald-400">General enquiries</span>
              <h2 className="font-display text-2xl font-bold text-[var(--ink)]">
                Official Support Email
              </h2>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                For general customer inquiries, account verification, and technical support requests.
              </p>
              <a
                href="mailto:greatfinanceng@gmail.com"
                className="inline-block pt-2 font-mono text-lg font-bold text-emerald-400 hover:underline"
              >
                greatfinanceng@gmail.com
              </a>
            </div>
            <div className="border-t border-[var(--line)] pt-4 flex items-center gap-2 text-xs font-mono text-[var(--muted)]">
              <Clock size={14} className="text-emerald-400" />
              <span>Typical response SLA: Within 2 hours</span>
            </div>
          </div>

          {/* WhatsApp Channel */}
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-[var(--surface)] to-emerald-950/20 p-8 sm:p-12 space-y-6 shadow-xl">
            <span className="grid size-12 place-items-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
              <MessageCircle size={24} />
            </span>
            <div className="space-y-3">
              <span className="text-sm font-bold text-emerald-300">Vendor support</span>
              <h2 className="font-display text-2xl font-bold text-[var(--ink)]">
                Direct WhatsApp Desk
              </h2>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Instant messaging support for active vendors, urgent transaction checks, and bulk coupon allocations.
              </p>
              <a
                href="https://wa.me/2347031069524"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block pt-2 font-mono text-lg font-bold text-emerald-400 hover:underline"
              >
                07031069524 (+234 703 106 9524)
              </a>
            </div>
            <div className="border-t border-[var(--line)] pt-4 flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Clock size={14} />
              <span>Hours: Mon-Sat, 8:00 AM-8:00 PM WAT</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 03. VENDOR SUPPORT CALLOUT */}
      {/* ========================================================================= */}
      <section className="shell">
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-[var(--surface)] via-amber-950/10 to-[var(--surface)] p-8 sm:p-14 space-y-6 shadow-xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <span className="text-sm font-bold text-amber-400">Distributor operations</span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[var(--ink)]">
                Looking to Become an Authorized Regional Vendor?
              </h3>
              <p className="text-xs sm:text-sm text-[var(--muted)] max-w-xl">
                Our vendor operations desk reviews and verifies partner accounts daily. Start earning wholesale retail margins in your local community.
              </p>
            </div>
            <Link
              href="/vendor/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-7 py-4 text-xs font-mono font-black text-[var(--surface-inverse)] hover:bg-amber-300 transition shadow-xl shrink-0"
            >
              <Store size={16} />
              <span>Apply for Vendor Account</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
