"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  BanknoteArrowDown,
  ChartNoAxesCombined,
  ChevronRight,
  Landmark,
  LayoutDashboard,
  Menu,
  ReceiptText,
  Settings,
  ShieldCheck,
  Store,
  TicketCheck,
  UserRoundCog,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/auth/permissions";

type PortalLink = readonly [href: string, label: string, icon: LucideIcon];

const customerLinks: readonly PortalLink[] = [
  ["/dashboard", "Overview", LayoutDashboard],
  ["/dashboard/investment", "Investments", ChartNoAxesCombined],
  ["/dashboard/withdrawals", "Withdrawals", BanknoteArrowDown],
  ["/dashboard/purchase", "Purchase coupon", ReceiptText],
  ["/dashboard/referral", "Referrals", UsersRound],
  ["/dashboard/settings", "Settings", Settings],
];

const vendorLinks: readonly PortalLink[] = [
  ["/vendor/dashboard", "Coupon table", LayoutDashboard],
  ["/vendor/acquire", "Acquire coupon", TicketCheck],
  ["/vendor/history", "Purchase history", ReceiptText],
  ["/vendor/kyc", "KYC verification", BadgeCheck],
  ["/vendor/settings", "Settings", Settings],
];

const adminLinks: readonly PortalLink[] = [
  ["/admin/dashboard", "Admin overview", LayoutDashboard],
  ["/admin/users", "User management", UserRoundCog],
  ["/admin/vendors", "Vendor management", Store],
  ["/admin/vendor_verification", "Vendor verification", BadgeCheck],
  ["/admin/verify_token", "Verify token purchase", TicketCheck],
  ["/admin/due_payout", "Due payouts", BanknoteArrowDown],
  ["/admin/approvals", "Approvals", ShieldCheck],
  ["/admin/settings", "System Settings", Settings],
];

const superAdminLinks: readonly PortalLink[] = [
  ...adminLinks,
  ["/admin/invite", "Invite Administrator", UserRoundCog],
];

function getLinks(role: Role) {
  if (role === "CUSTOMER") return customerLinks;
  if (role === "VENDOR") return vendorLinks;
  if (role === "SUPER_ADMIN") return superAdminLinks;
  return adminLinks;
}

function NavigationLinks({ links, onNavigate }: { links: readonly PortalLink[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  const activeHref = [...links]
    .sort(([a], [b]) => b.length - a.length)
    .find(([href]) => pathname === href || pathname.startsWith(`${href}/`))?.[0];

  return (
    <nav className="grid gap-1.5" aria-label="Workspace navigation">
      {links.map(([href, label, Icon]) => {
        const active = activeHref === href;
        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex min-h-11 items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition focus-visible:outline-white",
              active
                ? "bg-[var(--brand)] text-white shadow-md shadow-[var(--brand)]/20"
                : "text-white/70 hover:bg-white/10 hover:text-white",
            )}
            href={href}
            key={href}
            onClick={onNavigate}
          >
            <div className="flex items-center gap-3">
              <Icon aria-hidden="true" className={active ? "text-white" : "text-white/55 group-hover:text-white"} size={18} />
              <span>{label}</span>
            </div>
            {active && <ChevronRight size={14} className="text-white/80" />}
          </Link>
        );
      })}
    </nav>
  );
}

import { SovereignMark } from "@/components/brand/brand-logo";

export function PortalNavigation({ email, role }: { email: string; role: Role }) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const links = getLinks(role);
  const roleLabel = role.replace("_", " ");

  // Handle ESC key and scroll lock
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

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden h-screen min-h-0 flex-col bg-[var(--surface-inverse)] border-r border-[var(--line)] px-4 py-5 text-white lg:sticky lg:top-0 lg:flex">
        <Link className="flex items-center gap-3 rounded-xl px-2 py-2 font-bold" href={links[0][0]} aria-label="Great Finance workspace home">
          <SovereignMark size={36} />
          <div className="leading-tight">
            <span className="block text-base tracking-tight font-extrabold text-white">Great Finance</span>
            <span className="block text-[0.62rem] font-semibold uppercase tracking-wider text-white/50">Ledger Portal</span>
          </div>
        </Link>

        <p className="mb-3 mt-8 px-3 text-[.68rem] font-bold uppercase tracking-[.16em] text-white/40">Workspace Menu</p>
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <NavigationLinks links={links} />
        </div>

        <div className="mt-5 border-t border-[var(--line)] pt-4">
          <div className="rounded-xl bg-white/5 p-3 mb-2">
            <p className="truncate text-xs font-semibold text-white/90">{email}</p>
            <p className="mt-0.5 text-[0.65rem] font-bold uppercase tracking-[.12em] text-[var(--brand)]">{roleLabel}</p>
          </div>
          <SignOutButton tone="inverse" />
        </div>
      </aside>

      {/* Mobile Top Header (with Drawer Trigger) */}
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--surface-inverse)]/95 backdrop-blur-md text-white shadow-md lg:hidden">
        <div className="flex min-h-16 items-center justify-between gap-3 px-4 sm:px-6">
          <Link className="flex min-w-0 items-center gap-2.5 font-bold" href={links[0][0]} aria-label="Great Finance workspace home">
            <SovereignMark size={32} />
            <span className="truncate text-base font-extrabold">Great Finance</span>
          </Link>

          <button
            aria-controls="mobile-workspace-drawer"
            aria-expanded={mobileDrawerOpen}
            aria-label={mobileDrawerOpen ? "Close workspace drawer" : "Open workspace drawer"}
            className="grid size-10 place-items-center rounded-xl border border-[var(--line)] bg-white/5 text-white hover:bg-white/10 transition"
            onClick={() => setMobileDrawerOpen(true)}
            type="button"
          >
            <Menu aria-hidden="true" size={20} />
          </button>
        </div>
      </header>

      {/* Mobile Workspace Slide-Over Side Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" aria-modal="true" role="dialog" id="mobile-workspace-drawer">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col bg-[var(--paper)] border-l border-[var(--line)] text-white shadow-2xl transition ease-in-out duration-300 animate-in slide-in-from-right">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-lg bg-[var(--brand)] text-white">
                  <Landmark size={16} />
                </span>
                <div>
                  <p className="font-extrabold text-sm tracking-tight text-white">Great Finance</p>
                  <p className="text-[0.62rem] font-bold uppercase tracking-wider text-[var(--accent)]">{roleLabel} Portal</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="grid size-8 place-items-center rounded-lg border border-[var(--line)] text-white/70 hover:bg-white/10 hover:text-white"
                aria-label="Close workspace drawer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Profile Card in Drawer */}
            <div className="border-b border-[var(--line)] bg-[var(--surface)] px-5 py-3.5">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-[var(--brand)] text-xs font-bold text-white shadow-sm">
                  {email.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-white">{email}</p>
                  <span className="inline-block rounded-md bg-[var(--brand)]/20 px-1.5 py-0.5 text-[0.62rem] font-bold text-[var(--brand)] uppercase tracking-wider">
                    {roleLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Links in Drawer */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
              <p className="px-2 text-[0.65rem] font-bold uppercase tracking-wider text-white/40">
                Workspace Navigation
              </p>
              <NavigationLinks links={links} onNavigate={() => setMobileDrawerOpen(false)} />
            </div>

            {/* Drawer Bottom Actions */}
            <div className="border-t border-[var(--line)] bg-[var(--surface-inverse)] p-4 space-y-2">
              <SignOutButton tone="inverse" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
