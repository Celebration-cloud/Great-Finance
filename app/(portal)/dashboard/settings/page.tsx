import {
  Bell,
} from "lucide-react";
import { PageHeader } from "@/components/portal/page-header";
import { SettingsProfileForm } from "@/components/portal/settings-profile-form";
import { SettingsSecurityCard } from "@/components/portal/settings-security-card";
import { requireRole } from "@/lib/auth/access";
import { getPrisma } from "@/lib/db";
import { ReferralKit } from "@/components/portal/referral-kit";

export const dynamic = "force-dynamic";

export default async function CustomerSettingsPage() {
  const principal = await requireRole(["CUSTOMER"]);
  const db = getPrisma();

  const profile = await db.profile.findUnique({
    where: { authUserId: principal.userId },
  });

  const referralsCount = profile?.referralCode
    ? await db.profile.count({ where: { referredByCode: profile.referralCode } })
    : 0;

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Account preferences"
        title="Settings & Profile"
        description="Maintain your investor profile, configure settlement bank accounts for matured payouts, manage referral kits, and inspect session security."
      />

      {/* Referral Program Quick Kit */}
      {profile?.referralCode && (
        <ReferralKit referralCode={profile.referralCode} totalReferrals={referralsCount} />
      )}

      {/* Profile & Bank Information Form */}
      <SettingsProfileForm
        initialData={{
          displayName: profile?.displayName || "",
          phone: profile?.phone || null,
          whatsapp: profile?.whatsapp || null,
          bankName: profile?.bankName || null,
          accountNumberLast4: profile?.accountNumberLast4 || null,
          role: "CUSTOMER",
        }}
      />

      {/* Notification Preferences Card */}
      <div className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm space-y-4">
        <div className="border-b border-[var(--line)] pb-4">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-[var(--brand)]" />
            <h3 className="text-base font-bold text-[var(--ink)]">Notification Preferences</h3>
          </div>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Configure automated alerts dispatched to your registered email address.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              title: "Investment Maturity Alerts",
              desc: "Receive an email 24 hours prior to investment cycle completion and payout availability.",
              enabled: true,
            },
            {
              title: "Coupon Redemption Receipts",
              desc: "Instant confirmation email when an authorized coupon code is activated in your portfolio.",
              enabled: true,
            },
            {
              title: "Referral Commission Notices",
              desc: "Real-time notice whenever a referred peer activates their first investment cycle.",
              enabled: true,
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start justify-between gap-4 rounded-xl border border-[var(--line)]/60 bg-[var(--surface-muted)]/30 p-4"
            >
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-[var(--ink)]">{item.title}</p>
                <p className="text-xs text-[var(--muted)]">{item.desc}</p>
              </div>
              <span className="inline-flex shrink-0 items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-[0.7rem] font-bold text-emerald-800">
                Active
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Security & Active Session */}
      <SettingsSecurityCard
        email={principal.email}
        role={principal.role}
        userId={principal.userId}
      />
    </section>
  );
}
