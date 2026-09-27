"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronRight,
  Landmark,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Menu,
  Store,
  X,
} from "lucide-react";
import { getNeonClient } from "@/lib/neon/client";
import { cn } from "@/lib/utils";
import type { Principal } from "@/lib/auth/principal";

const primaryNavItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/plans", label: "Plans" },
  { href: "/withdrawals", label: "Withdrawals" },
  { href: "/vendors", label: "Vendor Network" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader({ principal }: { principal?: Principal | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileDrawerOpen(false);
    };
    if (mobileDrawerOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileDrawerOpen]);

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
      setMobileDrawerOpen(false);
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
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--paper)]/95 backdrop-blur-md transition-all">
        <div className="shell flex min-h-16 items-center justify-between gap-4 py-2.5">
          {/* Brand Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 font-bold text-[var(--ink)] transition"
            aria-label="Great Finance home"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-dark)] text-white shadow-md shadow-[var(--brand)]/20 transition group-hover:scale-105">
              <Landmark size={18} />
            </span>
            <div className="leading-none">
              <span className="block text-base tracking-tight font-extrabold text-[var(--ink)]">Great Finance</span>
              <span className="block text-[0.62rem] font-semibold uppercase tracking-wider text-[var(--muted)]">Institutional Ledger</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Primary navigation" className="hidden items-center gap-1 text-sm font-medium lg:flex">
            {primaryNavItems.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-1.5 transition-colors",
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
              <div className="flex items-center gap-2">
                <Link
                  href={workspaceHref}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--surface-muted)] px-3 py-1.5 text-xs font-bold text-[var(--ink)] border border-[var(--line)] hover:bg-[var(--line)] transition"
                >
                  <span className="grid size-5 place-items-center rounded-md bg-[var(--brand)] text-[0.65rem] font-bold text-white">
                    {principal.email.charAt(0).toUpperCase()}
                  </span>
                  <span>{roleLabel || "Workspace"}</span>
                </Link>

                <Link
                  href={workspaceHref}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--brand)] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[var(--brand-dark)] transition"
                >
                  <LayoutDashboard size={13} />
                  <span>Dashboard</span>
                </Link>

                <button
                  type="button"
                  disabled={signingOut}
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1 rounded-xl p-1.5 text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--ink)] transition disabled:opacity-50"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  {signingOut ? (
                    <LoaderCircle size={15} className="animate-spin text-[var(--brand)]" />
                  ) : (
                    <LogOut size={15} />
                  )}
                </button>
              </div>
            ) : (
              /* Logged Out View */
              <div className="flex items-center gap-2">
                <Link
                  href="/vendor/signup"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-3 py-1.5 text-xs font-bold text-[var(--accent-dark)] transition hover:bg-[var(--accent)]/20"
                >
                  <Store size={13} />
                  <span>Vendor Portal</span>
                </Link>

                <Link
                  href="/login"
                  className="rounded-xl px-3 py-1.5 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--surface-muted)] transition"
                >
                  Sign in
                </Link>

                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--brand)] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[var(--brand-dark)] transition"
                >
                  <span>Get Started</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger & Quick Status */}
          <div className="flex items-center gap-2 lg:hidden">
            {principal ? (
              <Link
                href={workspaceHref}
                className="inline-flex items-center gap-1 rounded-lg bg-[var(--brand)] px-2.5 py-1.5 text-xs font-bold text-white"
              >
                <LayoutDashboard size={13} />
                <span>Dashboard</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center rounded-lg border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-bold text-[var(--ink)] sm:hidden"
              >
                Sign In
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="grid size-9 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] transition hover:bg-[var(--surface-muted)]"
              aria-label="Open mobile navigation drawer"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Modern Slide-Over Mobile Side Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" aria-modal="true" role="dialog">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col bg-[var(--surface)] border-l border-[var(--line)] shadow-2xl transition ease-in-out duration-300 animate-in slide-in-from-right">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
              <Link
                href="/"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-2 font-bold text-[var(--ink)]"
              >
                <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-[var(--brand)] to-[var(--brand-dark)] text-white">
                  <Landmark size={16} />
                </span>
                <span className="font-extrabold text-sm tracking-tight text-[var(--ink)]">Great Finance</span>
              </Link>

              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="grid size-8 place-items-center rounded-lg border border-[var(--line)] text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--ink)]"
                aria-label="Close navigation drawer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Profile Bar if Logged In */}
            {principal && (
              <div className="border-b border-[var(--line)] bg-[var(--surface-muted)]/60 px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-[var(--brand)] text-xs font-bold text-white shadow-sm">
                    {principal.email.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-[var(--ink)]">{principal.email}</p>
                    <span className="inline-block rounded-md bg-[var(--brand)]/10 px-1.5 py-0.5 text-[0.62rem] font-bold text-[var(--brand)] uppercase tracking-wider">
                      {roleLabel}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Drawer Scrollable Navigation */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
              <div>
                <p className="px-2 mb-2 text-[0.65rem] font-bold uppercase tracking-wider text-[var(--muted)]">
                  Navigation
                </p>
                <nav className="flex flex-col gap-1" aria-label="Mobile side navigation">
                  {primaryNavItems.map((item) => {
                    const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={cn(
                          "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                          isActive
                            ? "bg-[var(--brand)] text-white shadow-sm"
                            : "text-[var(--ink)] hover:bg-[var(--surface-muted)]"
                        )}
                      >
                        <span>{item.label}</span>
                        <ChevronRight size={14} className={isActive ? "text-white" : "text-[var(--muted)]"} />
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Vendor Partner Highlight Card */}
              <div className="rounded-2xl border border-[var(--accent)]/30 bg-gradient-to-br from-[var(--accent)]/10 to-amber-50/50 p-4">
                <div className="flex items-center gap-2">
                  <Store size={16} className="text-[var(--accent-dark)]" />
                  <span className="text-xs font-bold text-[var(--accent-dark)]">Authorized Vendors</span>
                </div>
                <p className="mt-1.5 text-xs text-[var(--ink)]/80 leading-relaxed">
                  Earn up to 15% wholesale margins on coupon distribution with instant settlements.
                </p>
                <Link
                  href="/vendor/signup"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--accent-dark)] py-2 text-xs font-bold text-white shadow-sm"
                >
                  <span>Register as Vendor</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="border-t border-[var(--line)] bg-[var(--surface-muted)]/30 p-4 space-y-2">
              {principal ? (
                <>
                  <Link
                    href={workspaceHref}
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand)] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[var(--brand-dark)] transition"
                  >
                    <LayoutDashboard size={14} />
                    <span>Open {roleLabel} Workspace</span>
                  </Link>

                  <button
                    type="button"
                    disabled={signingOut}
                    onClick={handleSignOut}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] py-2 text-xs font-bold text-red-400 hover:bg-red-950/30 transition"
                  >
                    {signingOut ? <LoaderCircle size={14} className="animate-spin" /> : <LogOut size={14} />}
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface)] py-2.5 text-xs font-bold text-[var(--ink)] shadow-sm hover:bg-[var(--surface-muted)] transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center justify-center rounded-xl bg-[var(--brand)] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[var(--brand-dark)] transition"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
