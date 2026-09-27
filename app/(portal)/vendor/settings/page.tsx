import Link from "next/link";
import {
  BadgeAlert,
  BadgeCheck,
  Clock,
  ExternalLink,
  MessageCircle,
  Radio,
} from "lucide-react";
import { PageHeader } from "@/components/portal/page-header";
import { SettingsProfileForm } from "@/components/portal/settings-profile-form";
import { SettingsSecurityCard } from "@/components/portal/settings-security-card";
import { requireRole } from "@/lib/auth/access";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function VendorSettingsPage() {
  const principal = await requireRole(["VENDOR"]);
  const db = getPrisma();

  const [profile, kycApproval, kycSubmission, activeCouponsCount] = await Promise.all([
    db.profile.findUnique({ where: { authUserId: principal.userId } }),
    db.approvalRequest.findFirst({
      where: { resourceType: "vendor-kyc", requestedBy: principal.userId },
      orderBy: { createdAt: "desc" },
    }),
    db.vendorKycSubmission.findFirst({
      where: { authUserId: principal.userId },
      orderBy: { submittedAt: "desc" },
    }),
    db.coupon.count({
      where: { vendorOrgId: principal.organizationId, status: "ACTIVE" },
    }),
  ]);

  const kycStatus =
    kycApproval?.status === "APPROVED"
      ? "APPROVED"
      : kycApproval?.status === "PENDING" || Boolean(kycSubmission)
        ? "PENDING"
        : "NOT_SUBMITTED";

  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="Distributor Administration"
        title="Vendor Settings & Desk"
        description="Configure your official distribution identity, WhatsApp sales desk for incoming retail buyers, settlement bank accounts, and compliance credentials."
        action={
          <Link
            href="/vendors"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--line)] bg-white px-4 py-2 text-xs font-bold text-[var(--ink)] shadow-sm hover:bg-[var(--surface-muted)] transition"
          >
            <span>View Public Directory Listing</span>
            <ExternalLink size={13} />
          </Link>
        }
      />

      {/* KYC Accreditation Status Banner */}
      <div className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--line)] pb-4">
          <div className="flex items-center gap-2.5">
            <span
              className={`grid size-9 place-items-center rounded-xl ${
                kycStatus === "APPROVED"
                  ? "bg-emerald-100 text-emerald-700"
                  : kycStatus === "PENDING"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-amber-100 text-amber-700"
              }`}
            >
              {kycStatus === "APPROVED" ? (
                <BadgeCheck size={20} />
              ) : kycStatus === "PENDING" ? (
                <Clock size={20} />
              ) : (
                <BadgeAlert size={20} />
              )}
            </span>
            <div>
              <h3 className="text-base font-bold text-[var(--ink)]">
                Tier-1 Distributor Accreditation
              </h3>
              <p className="text-xs text-[var(--muted)]">
                {kycStatus === "APPROVED"
                  ? "Your organization is verified with Level-1 credentials and authorized to distribute coupon inventory."
                  : kycStatus === "PENDING"
                    ? "Compliance review is currently in progress. Document vault verification pending."
                    : "Action required: Complete KYC verification to unblock maximum wholesale inventory quotas."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                kycStatus === "APPROVED"
                  ? "bg-emerald-100 text-emerald-800"
                  : kycStatus === "PENDING"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-amber-100 text-amber-800"
              }`}
            >
              {kycStatus === "APPROVED"
                ? "Level 1 Verified"
                : kycStatus === "PENDING"
                  ? "Review In Progress"
                  : "Unverified"}
            </span>

            {kycStatus !== "APPROVED" && (
              <Link
                href="/vendor/kyc"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--brand)] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[var(--brand-dark)] transition"
              >
                <span>{kycStatus === "PENDING" ? "View Submission" : "Submit KYC"}</span>
              </Link>
            )}
          </div>
        </div>

        {/* Directory Card Live Preview */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-muted)]/30 p-4 space-y-2">
          <span className="text-[0.68rem] font-bold uppercase tracking-wider text-[var(--muted)] block">
            Public Directory Appearance (How buyers see your desk)
          </span>
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--line)] bg-white p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] font-bold text-sm">
                {(profile?.displayName || "Vendor").charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="font-bold text-sm text-[var(--ink)]">
                  {profile?.displayName || "Your Distributor Name"}
                </p>
                <p className="text-xs text-[var(--muted)]">
                  Authorized Great Finance Distributor •{" "}
                  <strong className="text-emerald-600 font-semibold">{activeCouponsCount} Active Coupons</strong> in stock
                </p>
              </div>
            </div>

            {profile?.whatsapp ? (
              <a
                href={`https://wa.me/${profile.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
              >
                <MessageCircle size={15} />
                <span>Chat on WhatsApp</span>
              </a>
            ) : (
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
                Set WhatsApp number below to activate direct button
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Profile & Settlement Form */}
      <SettingsProfileForm
        initialData={{
          displayName: profile?.displayName || "",
          phone: profile?.phone || null,
          whatsapp: profile?.whatsapp || null,
          bankName: profile?.bankName || null,
          accountNumberLast4: profile?.accountNumberLast4 || null,
          role: "VENDOR",
          vendorTier: profile?.vendorTier || null,
        }}
      />

      {/* Distributor Inventory & Operations Notification Policy */}
      <div className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm space-y-4">
        <div className="border-b border-[var(--line)] pb-4">
          <div className="flex items-center gap-2">
            <Radio size={18} className="text-[var(--brand)]" />
            <h3 className="text-base font-bold text-[var(--ink)]">Distributor Alerts & Low-Stock Trigger</h3>
          </div>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Automated operational notifications dispatched to your registered contact endpoints.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              title: "Low Inventory Warning",
              desc: "Get notified when unredeemed coupon inventory drops below 10 units so you can replenish batches.",
              active: true,
            },
            {
              title: "Customer Redemption Confirmation",
              desc: "Dispatches a notification whenever a customer redeems a coupon code originating from your inventory.",
              active: true,
            },
            {
              title: "Wholesale Payment Settlement Receipt",
              desc: "Immediate reconciliation report with Paystack transaction ID upon successful batch acquisition.",
              active: true,
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
                Enabled
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Security & Session */}
      <SettingsSecurityCard
        email={principal.email}
        role={principal.role}
        userId={principal.userId}
      />
    </section>
  );
}
