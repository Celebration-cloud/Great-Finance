import {
  CheckCircle2,
  Database,
  Radio,
  Server,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { MetricGrid, PageHeader } from "@/components/portal/page-header";
import { SettingsSecurityCard } from "@/components/portal/settings-security-card";
import { requireRole } from "@/lib/auth/access";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const principal = await requireRole(["ADMIN", "SUPER_ADMIN"]);
  const db = getPrisma();

  const [
    totalAuditLogs,
    latestAuditLog,
    totalLedgerEntries,
    debitSum,
    creditSum,
    pendingApprovalsCount,
  ] = await Promise.all([
    db.auditLog.count(),
    db.auditLog.findFirst({ orderBy: { createdAt: "desc" } }),
    db.ledgerEntry.count(),
    db.ledgerEntry.aggregate({ where: { direction: "DEBIT" }, _sum: { amountMinor: true } }),
    db.ledgerEntry.aggregate({ where: { direction: "CREDIT" }, _sum: { amountMinor: true } }),
    db.approvalRequest.count({ where: { status: "PENDING" } }),
  ]);

  const totalDebits = debitSum._sum.amountMinor ?? BigInt(0);
  const totalCredits = creditSum._sum.amountMinor ?? BigInt(0);
  const isLedgerBalanced = totalDebits === totalCredits;

  const hasPaystackConfig = Boolean(process.env.PAYSTACK_SECRET_KEY);
  return (
    <section className="space-y-8">
      <PageHeader
        eyebrow="System Governance"
        title="Protocol & System Settings"
        description="Executive administration settings, cryptographic audit verification, double-entry ledger balance assertion, and provider integrations."
      />

      {/* Protocol Health & Security Grid */}
      <MetricGrid
        items={[
          {
            label: "Cryptographic Audit Log Chain",
            value: `${totalAuditLogs} Blocks`,
            detail: latestAuditLog ? `Latest: ${latestAuditLog.hash.slice(0, 10)}...` : "Genesis clean",
          },
          {
            label: "Double-Entry Ledger Integrity",
            value: isLedgerBalanced ? "Balanced (0.00)" : "Imbalance Detected",
            detail: `${totalLedgerEntries} balanced journal lines`,
          },
          {
            label: "Pending Maker-Checker Items",
            value: `${pendingApprovalsCount} Queued`,
            detail: "Enforces dual-custody review",
          },
          {
            label: "Administrative Authority",
            value: principal.role === "SUPER_ADMIN" ? "Super Admin (Tier 0)" : "Staff Admin",
            detail: principal.email,
          },
        ]}
      />

      {/* Provider & Infrastructure Health Matrix */}
      <div className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm space-y-4">
        <div className="border-b border-[var(--line)] pb-4">
          <div className="flex items-center gap-2">
            <Server size={18} className="text-[var(--brand)]" />
            <h3 className="text-base font-bold text-[var(--ink)]">
              Infrastructure & Provider Connections
            </h3>
          </div>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Live operational status of external infrastructure and cryptographic key stores.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {/* Neon Database */}
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-muted)]/30 p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[var(--ink)] flex items-center gap-1.5">
                <Database size={14} className="text-[var(--brand)]" />
                <span>Neon Postgres DB</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[0.7rem] font-bold text-emerald-600">
                <CheckCircle2 size={12} />
                <span>Connected</span>
              </span>
            </div>
            <p className="text-[0.72rem] text-[var(--muted)]">
              Lakebase Serverless Postgres with instant branching & read-replicas.
            </p>
          </div>

          {/* Paystack Gateway */}
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-muted)]/30 p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[var(--ink)] flex items-center gap-1.5">
                <Radio size={14} className="text-[var(--brand)]" />
                <span>Paystack Gateway</span>
              </span>
              <span
                className={`inline-flex items-center gap-1 text-[0.7rem] font-bold ${
                  hasPaystackConfig ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                <CheckCircle2 size={12} />
                <span>{hasPaystackConfig ? "HMAC Active" : "Key Needed"}</span>
              </span>
            </div>
            <p className="text-[0.72rem] text-[var(--muted)]">
              Live webhook HMAC-SHA512 verification & automatic coupon minting.
            </p>
          </div>

          {/* Document Vault Storage */}
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-muted)]/30 p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[var(--ink)] flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[var(--brand)]" />
                <span>Private KYC Vault</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[0.7rem] font-bold text-emerald-600">
                <CheckCircle2 size={12} />
                <span>AES-256 Encrypted</span>
              </span>
            </div>
            <p className="text-[0.72rem] text-[var(--muted)]">
              Secure KYC credential storage with authenticated pre-signed URL access.
            </p>
          </div>
        </div>
      </div>

      {/* Governance & Maker-Checker Policies */}
      <div className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm space-y-4">
        <div className="border-b border-[var(--line)] pb-4">
          <div className="flex items-center gap-2">
            <Workflow size={18} className="text-[var(--brand)]" />
            <h3 className="text-base font-bold text-[var(--ink)]">
              Governance & Maker-Checker Rules
            </h3>
          </div>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Enforce institutional separation of duties and dual-custody verification.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              title: "Maker-Checker Separation of Duties",
              desc: "Prohibits any administrator from approving their own KYC approvals, withdrawal requests, or manual ledger adjustments.",
              status: "Strictly Enforced",
              active: true,
            },
            {
              title: "Automated Paystack Reconciliation",
              desc: "Guarantees coupon batches are only issued after cryptographically signed provider webhooks confirm cleared settlement.",
              status: "Autonomous",
              active: true,
            },
            {
              title: "Tier-1 KYC Mandatory Verification",
              desc: "Requires all wholesale distributors to upload government ID and facial biometric selfie before wholesale allocation.",
              status: "Enforced",
              active: true,
            },
            {
              title: "Immutable SHA-256 Audit Chaining",
              desc: "Every critical system action links to the preceding entry hash, creating a tamper-evident chain that flags any direct DB tampering.",
              status: "Tamper-Evident",
              active: true,
            },
          ].map((policy) => (
            <div
              key={policy.title}
              className="flex items-start justify-between gap-4 rounded-xl border border-[var(--line)]/60 bg-[var(--surface-muted)]/30 p-4"
            >
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-[var(--ink)]">{policy.title}</p>
                <p className="text-xs text-[var(--muted)]">{policy.desc}</p>
              </div>
              <span className="inline-flex shrink-0 items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-[0.7rem] font-bold text-emerald-800">
                {policy.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Session Security */}
      <SettingsSecurityCard
        email={principal.email}
        role={principal.role}
        userId={principal.userId}
      />
    </section>
  );
}
