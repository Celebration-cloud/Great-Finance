import type { Metadata } from "next";
import Link from "next/link";
import { Landmark } from "lucide-react";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: { default: "Great Finance", template: "%s · Great Finance" },
  description: "Secure payments, approvals and accountable financial operations.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3" href="#main-content">Skip to content</a>
        <header className="border-b border-[var(--line)] bg-white/85 backdrop-blur">
          <div className="shell flex min-h-18 items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-3 font-bold" aria-label="Great Finance home">
              <span className="grid size-10 place-items-center rounded-xl bg-[var(--brand)] text-white"><Landmark size={20} /></span>
              <span>Great Finance</span>
            </Link>
            <div className="flex items-center gap-2">
              <nav aria-label="Primary" className="hidden items-center gap-1 text-sm font-semibold lg:flex">
                <Link className="rounded-lg px-3 py-2 hover:bg-[var(--surface-muted)]" href="/">Home</Link>
                <Link className="rounded-lg px-3 py-2 hover:bg-[var(--surface-muted)]" href="/#about">About</Link>
                <Link className="rounded-lg px-3 py-2 hover:bg-[var(--surface-muted)]" href="/signup">Register</Link>
                <Link className="rounded-lg px-3 py-2 hover:bg-[var(--surface-muted)]" href="/#contact">Contact</Link>
                <Link className="rounded-lg px-3 py-2 hover:bg-[var(--surface-muted)]" href="/#plans">Plans</Link>
              </nav>
              <Link className="rounded-lg bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-dark)]" href="/auth/sign-in">Sign in</Link>
            </div>
          </div>
        </header>
        <div id="main-content">{children}</div>
        <Analytics />
      </body>
    </html>
  );
}
