import { redirect } from "next/navigation";
import Link from "next/link";
import { BadgeCheck, BanknoteArrowDown, ChartNoAxesCombined, LayoutDashboard, ReceiptText, ShieldCheck, Store, TicketCheck, UserRoundCog, UsersRound } from "lucide-react";
import { hasAuthConfig, hasDatabaseConfig } from "@/lib/env/server";
import { requirePrincipal } from "@/lib/auth/principal";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  if (!hasAuthConfig() || !hasDatabaseConfig()) redirect("/setup");
  const principal = await requirePrincipal();
  const customerLinks = [["/dashboard", "Overview", LayoutDashboard], ["/dashboard/investment", "Investments", ChartNoAxesCombined], ["/dashboard/withdrawals", "Withdrawals", BanknoteArrowDown], ["/dashboard/purchase", "Purchase coupon", ReceiptText], ["/dashboard/referral", "Referrals", UsersRound]] as const;
  const vendorLinks = [["/vendor/dashboard", "Coupon table", LayoutDashboard], ["/vendor/acquire", "Acquire coupon", TicketCheck], ["/vendor/history", "Purchase history", ReceiptText], ["/vendor/kyc", "KYC verification", BadgeCheck]] as const;
  const adminLinks = [["/admin/dashboard", "Admin overview", LayoutDashboard], ["/admin/users", "User management", UserRoundCog], ["/admin/vendors", "Vendor management", Store], ["/admin/vendor_verification", "Vendor verification", BadgeCheck], ["/admin/verify_token", "Verify token purchase", TicketCheck], ["/admin/due_payout", "Due payouts", BanknoteArrowDown], ["/admin/approvals", "Approvals", ShieldCheck]] as const;
  const links = principal.role === "CUSTOMER" ? customerLinks : principal.role === "VENDOR" ? vendorLinks : adminLinks;
  return <div className="shell grid gap-8 py-8 lg:grid-cols-[240px_1fr]"><aside className="card h-fit p-3"><div className="px-3 py-4"><p className="truncate text-sm font-bold">{principal.email}</p><p className="mt-1 text-xs text-[var(--muted)]">{principal.role.replace("_", " ")}</p></div><nav className="grid gap-1" aria-label="Portal">{links.map(([href, label, Icon]) => <Link className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition hover:bg-[var(--surface-muted)] active:translate-y-px" href={href} key={href}><Icon size={18}/>{label}</Link>)}</nav><SignOutButton/></aside><main className="min-w-0">{children}</main></div>;
}
