import Link from "next/link";
import { Clock, HelpCircle, Mail, MessageCircle, Phone, ShieldCheck, Store } from "lucide-react";

export const metadata = {
  title: "Contact & Institutional Support · Great Finance",
  description:
    "Official communication channels for Great Finance. Reach our customer support desk and regional vendor dispatch via email and verified WhatsApp.",
};

export default function ContactPage() {
  return (
    <div className="space-y-24 py-12 sm:space-y-32 sm:py-20">
      <section className="shell">
        <div className="max-w-3xl space-y-6">
          <p className="eyebrow">Support & Inquiries</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--ink)] sm:text-6xl">
            We are here to assist your financial journey.
          </h1>
          <p className="text-lg leading-relaxed text-[var(--muted)]">
            Whether you need assistance with customer registration, investment plan redemption, or authorized vendor onboarding, our dedicated desks are available.
          </p>
        </div>
      </section>

      {/* Contact Channels Grid */}
      <section className="shell">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Email */}
          <div className="card p-8 sm:p-10 space-y-6">
            <span className="grid size-12 place-items-center rounded-xl bg-[var(--brand)]/10 text-[var(--brand)]">
              <Mail size={24} />
            </span>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-[var(--ink)]">Official Support Email</h2>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                For general customer inquiries, account verification, and technical support requests.
              </p>
              <a
                href="mailto:greatfinanceng@gmail.com"
                className="inline-block pt-2 text-base font-bold text-[var(--brand)] hover:underline"
              >
                greatfinanceng@gmail.com
              </a>
            </div>
            <div className="border-t border-[var(--line)] pt-4 text-xs text-[var(--muted)]">
              <span>Typical response time: Within 2 hours</span>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="card border-2 border-emerald-500/20 bg-gradient-to-b from-white to-emerald-50/20 p-8 sm:p-10 space-y-6">
            <span className="grid size-12 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
              <MessageCircle size={24} />
            </span>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-[var(--ink)]">Direct WhatsApp Desk</h2>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Instant messaging support for active vendors, urgent transaction checks, and bulk coupon allocations.
              </p>
              <a
                href="https://wa.me/2347031069524"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block pt-2 text-base font-bold text-emerald-700 hover:underline"
              >
                07031069524 (+234 703 106 9524)
              </a>
            </div>
            <div className="border-t border-[var(--line)] pt-4 text-xs text-emerald-800">
              <span>Active hours: Monday – Saturday, 8:00 AM – 8:00 PM WAT</span>
            </div>
          </div>
        </div>
      </section>

      {/* Vendor Support Callout */}
      <section className="shell">
        <div className="rounded-2xl border border-[var(--line)] bg-white p-8 sm:p-12 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <span className="eyebrow">Distributor Support</span>
              <h3 className="text-2xl font-bold text-[var(--ink)]">Looking to Become a Regional Vendor?</h3>
              <p className="text-xs text-[var(--muted)]">Our vendor operations desk reviews and verifies partner accounts daily.</p>
            </div>
            <Link
              href="/vendor/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-6 py-3 text-xs font-bold text-white hover:bg-[var(--brand-dark)] transition"
            >
              <Store size={15} />
              <span>Apply for Vendor Account</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
