"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeCheck,
  BanknoteArrowDown,
  ChartNoAxesCombined,
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
import { useState } from "react";
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

function getLinks(role: Role) {
  if (role === "CUSTOMER") return customerLinks;
  if (role === "VENDOR") return vendorLinks;
  return adminLinks;
}

function NavigationLinks({ links, onNavigate }: { links: readonly PortalLink[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  const activeHref = [...links]
    .sort(([a], [b]) => b.length - a.length)
    .find(([href]) => pathname === href || pathname.startsWith(`${href}/`))?.[0];

  return (
    <nav className="grid gap-1" aria-label="Workspace navigation">
      {links.map(([href, label, Icon]) => {
        const active = activeHref === href;
        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition focus-visible:outline-white",
              active
                ? "bg-white !text-[var(--ink)] shadow-[0_10px_30px_rgba(0,0,0,.16)]"
                : "text-white/70 hover:bg-white/10 hover:text-white",
            )}
            href={href}
            key={href}
            onClick={onNavigate}
          >
            <Icon aria-hidden="true" className={active ? "text-[var(--brand)]" : "text-white/55 group-hover:text-white"} size={18} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function PortalNavigation({ email, role }: { email: string; role: Role }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = getLinks(role);
  const roleLabel = role.replace("_", " ");

  return (
    <>
      <aside className="hidden h-screen min-h-0 flex-col bg-[var(--ink)] px-4 py-5 text-white lg:sticky lg:top-0 lg:flex">
        <Link className="flex items-center gap-3 rounded-xl px-2 py-2 font-bold" href={links[0][0]} aria-label="Great Finance workspace home">
          <span className="grid size-10 place-items-center rounded-xl bg-white/10 text-[var(--accent)]">
            <Landmark aria-hidden="true" size={20} />
          </span>
          <span>Great Finance</span>
        </Link>
        <p className="mb-3 mt-9 px-3 text-[.68rem] font-bold uppercase tracking-[.16em] text-white/40">Workspace</p>
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <NavigationLinks links={links} />
        </div>
        <div className="mt-5 border-t border-white/10 pt-4">
          <p className="truncate px-3 text-sm font-semibold">{email}</p>
          <p className="mt-1 px-3 text-xs font-bold uppercase tracking-[.12em] text-[var(--accent)]">{roleLabel}</p>
          <SignOutButton tone="inverse" />
        </div>
      </aside>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[var(--ink)] text-white shadow-[0_8px_30px_rgba(16,37,63,.16)] lg:hidden">
        <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6">
          <Link className="flex min-w-0 items-center gap-3 font-bold" href={links[0][0]} aria-label="Great Finance workspace home">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/10 text-[var(--accent)]">
              <Landmark aria-hidden="true" size={18} />
            </span>
            <span className="truncate">Great Finance</span>
          </Link>
          <button
            aria-controls="mobile-workspace-menu"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close workspace menu" : "Open workspace menu"}
            className="ml-auto grid size-11 place-items-center rounded-xl border border-white/15 bg-white/5 text-white hover:bg-white/10"
            onClick={() => setMobileOpen((open) => !open)}
            type="button"
          >
            {mobileOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
          </button>
        </div>
        {mobileOpen && (
          <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 px-4 py-4 sm:px-6" id="mobile-workspace-menu">
            <div className="mb-4 rounded-xl bg-white/5 px-3.5 py-3">
              <p className="truncate text-sm font-semibold">{email}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[.12em] text-[var(--accent)]">{roleLabel}</p>
            </div>
            <NavigationLinks links={links} onNavigate={() => setMobileOpen(false)} />
            <SignOutButton tone="inverse" />
          </div>
        )}
      </header>
    </>
  );
}
