"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  Landmark,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Menu,
  ShieldCheck,
  Sparkles,
  Store,
  User,
  X,
} from "lucide-react";
import { getNeonClient } from "@/lib/neon/client";
import { cn } from "@/lib/utils";
import type { Principal } from "@/lib/auth/principal";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/plans", label: "Plans" },
  { href: "/vendors", label: "Vendor Network" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader({ principal }: { principal?: Principal | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await getNeonClient().auth.signOut();
      router.push("/");
      router.refresh();
    } catch {
      router.push("/");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  };

  const workspaceHref =
    principal?.role === "VENDOR"
      ? "/vendor/dashboard"
      : principal?.role === "ADMIN" || principal?.role === "SUPER_ADMIN"
        ? "/admin/dashboard"
        : "/dashboard";

  const roleLabel = principal?.role.replace("_", " ") ?? "";

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-white/90 backdrop-blur-md transition-all" data-site-header>
      <div className="shell flex min-h-18 items-center justify-between gap-4 py-3">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 font-bold text-[var(--ink)] transition"
          aria-label="Great Finance home"
        >
          <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-dark)] text-white shadow-md shadow-[var(--brand)]/20 transition group-hover:scale-105">
            <Landmark size={20} />
          </span>
          <div className="leading-tight">
            <span className="block text-base tracking-tight font-extrabold text-[var(--ink)]">Great Finance</span>
            <span className="block text-[0.68rem] font-semibold uppercase tracking-wider text-[var(--muted)]">Institutional Ledger</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav aria-label="Primary navigation" className="hidden items-center gap-1 text-sm font-medium lg:flex">
          {navItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3.5 py-2 transition-colors",
                  isActive
                    ? "bg-[var(--surface-muted)] font-bold text-[var(--brand)]"
                    : "text-[var(--ink)]/80 hover:bg-[var(--surface-muted)] hover:text-[var(--ink)]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Header Actions */}
        <div className="hidden items-center gap-2.5 sm:flex">
          {principal ? (
            /* Logged In View */
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface-muted)]/60 px-3 py-1.5">
                <span className="grid size-7 place-items-center rounded-lg bg-[var(--brand)] text-xs font-bold text-white">
                  {principal.email.charAt(0).toUpperCase()}
                </span>
                <div className="leading-tight text-left">
                  <p className="max-w-[140px] truncate text-xs font-semibold text-[var(--ink)]">
                    {principal.email}
                  </p>
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--brand)]">
                    {roleLabel}
                  </span>
                </div>
              </div>

              <Link
                href={workspaceHref}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--brand)] px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[var(--brand-dark)] transition"
              >
                <LayoutDashboard size={14} />
                <span>Workspace</span>
              </Link>

              <button
                type="button"
                disabled={signingOut}
                onClick={handleSignOut}
                className="inline-flex items-center gap-1 rounded-xl border border-[var(--line)] px-2.5 py-2 text-xs font-semibold text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--ink)] transition disabled:opacity-50"
                title="Sign out of your account"
              >
                {signingOut ? (
                  <LoaderCircle size={14} className="animate-spin text-[var(--brand)]" />
                ) : (
                  <LogOut size={14} />
                )}
                <span>{signingOut ? "..." : "Sign out"}</span>
              </button>
            </div>
          ) : (
            /* Logged Out View */
            <>
              {/* Register as Vendor Button */}
              <Link
                href="/vendor/signup"
                className="group inline-flex items-center gap-1.5 rounded-xl border border-[var(--accent)]/40 bg-gradient-to-r from-[var(--accent)]/15 to-[var(--accent)]/5 px-3.5 py-2 text-xs font-bold text-[var(--accent-dark)] shadow-sm transition hover:border-[var(--accent)] hover:bg-[var(--accent)]/20 hover:shadow"
                title="Become an authorized distribution vendor"
              >
                <Store size={14} className="text-[var(--accent-dark)] transition group-hover:scale-110" />
                <span>Register as Vendor</span>
              </Link>

              <Link
                href="/login"
                className="rounded-xl px-3.5 py-2 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--surface-muted)] transition"
              >
                Sign in
              </Link>

              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--brand)] px-4 py-2 text-xs font-bold text-white shadow-sm shadow-[var(--brand)]/25 transition hover:bg-[var(--brand-dark)] hover:shadow-md"
              >
                <Sparkles size={13} />
                <span>Get Started</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          {principal ? (
            <Link
              href={workspaceHref}
              className="inline-flex items-center gap-1 rounded-lg bg-[var(--brand)] px-2.5 py-1.5 text-xs font-bold text-white"
            >
              <LayoutDashboard size={13} />
              <span>Workspace</span>
            </Link>
          ) : (
            <Link
              href="/vendor/signup"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--accent)]/50 bg-[var(--accent)]/10 px-2.5 py-1.5 text-xs font-bold text-[var(--accent-dark)] sm:hidden"
            >
              <Store size={13} />
              <span>Vendor</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="grid size-10 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] transition hover:bg-[var(--surface-muted)]"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-[var(--line)] bg-white px-4 py-5 shadow-xl lg:hidden animate-in fade-in slide-in-from-top-2">
          {/* Mobile Profile Notice if Logged In */}
          {principal && (
            <div className="mb-4 flex items-center justify-between rounded-xl bg-[var(--surface-muted)] p-3">
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-lg bg-[var(--brand)] text-xs font-bold text-white">
                  {principal.email.charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="max-w-[180px] truncate text-xs font-bold text-[var(--ink)]">{principal.email}</p>
                  <p className="text-[0.65rem] font-bold uppercase text-[var(--brand)]">{roleLabel}</p>
                </div>
              </div>
              <button
                type="button"
                disabled={signingOut}
                onClick={handleSignOut}
                className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:underline"
              >
                {signingOut ? <LoaderCircle size={12} className="animate-spin" /> : <LogOut size={12} />}
                <span>Sign out</span>
              </button>
            </div>
          )}

          <nav className="flex flex-col gap-1.5 text-sm font-semibold" aria-label="Mobile navigation">
            {navItems.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-4 py-3 transition",
                    isActive
                      ? "bg-[var(--brand)]/10 text-[var(--brand)] font-bold"
                      : "text-[var(--ink)] hover:bg-[var(--surface-muted)]"
                  )}
                >
                  <span>{item.label}</span>
                  {item.href === "/vendors" && (
                    <span className="rounded-md bg-[var(--accent)]/20 px-2 py-0.5 text-[0.65rem] font-bold text-[var(--accent-dark)] uppercase tracking-wider">
                      Partner
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 flex flex-col gap-2.5 border-t border-[var(--line)] pt-4">
            {principal ? (
              <Link
                href={workspaceHref}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-[var(--brand)] py-3 text-center text-sm font-bold text-white shadow-sm"
              >
                <LayoutDashboard size={16} />
                <span>Open {roleLabel} Workspace</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/vendor/signup"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[var(--accent)] bg-[var(--accent)]/15 px-4 py-3 text-sm font-bold text-[var(--accent-dark)] shadow-sm"
                >
                  <Store size={16} />
                  <span>Register as Vendor Partner</span>
                </Link>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface)] py-3 text-center text-sm font-bold text-[var(--ink)]"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center rounded-xl bg-[var(--brand)] py-3 text-center text-sm font-bold text-white shadow-sm"
                  >
                    Get Started
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
