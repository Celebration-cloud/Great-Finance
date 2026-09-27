"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, CheckCircle2, CreditCard, LoaderCircle, Phone, Save, User } from "lucide-react";
import { useApiMutation } from "@/hooks/use-api-mutation";

import { VENDOR_TIERS, parseVendorTier } from "@/lib/vendor/tiers";

interface ProfileInitialData {
  displayName: string;
  phone: string | null;
  whatsapp: string | null;
  bankName: string | null;
  accountNumberLast4: string | null;
  role: "CUSTOMER" | "VENDOR" | "ADMIN" | "SUPER_ADMIN" | "REVIEWER";
  vendorTier?: string | null;
}

export function SettingsProfileForm({ initialData }: { initialData: ProfileInitialData }) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initialData.displayName || "");
  const [phone, setPhone] = useState(initialData.phone || "");
  const [whatsapp, setWhatsapp] = useState(initialData.whatsapp || "");
  const [bankName, setBankName] = useState(initialData.bankName || "");
  const [accountNumber, setAccountNumber] = useState("");

  const tierKey = parseVendorTier(initialData.vendorTier);
  const tierConfig = VENDOR_TIERS[tierKey] ?? VENDOR_TIERS.TIER_1_STARTER;

  const { mutate, isLoading, error } = useApiMutation<
    { profile: unknown },
    { displayName: string; phone?: string; whatsapp?: string; bankName?: string; accountNumber?: string }
  >("/api/settings/profile", {
    method: "PATCH",
    successMessage: "Profile information updated successfully!",
    onSuccess: () => {
      setAccountNumber("");
      router.refresh();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    await mutate({
      displayName: displayName.trim(),
      phone: phone.trim() || undefined,
      whatsapp: whatsapp.trim() || undefined,
      bankName: bankName.trim() || undefined,
      accountNumber: accountNumber.trim() || undefined,
    });
  };

  const isVendor = initialData.role === "VENDOR";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm">
        <div className="border-b border-[var(--line)] pb-4 mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-[var(--ink)]">
              {isVendor ? "Distributor Profile & Public Contact" : "Personal Information"}
            </h3>
            <p className="mt-1 text-xs text-[var(--muted)]">
              {isVendor
                ? "Your WhatsApp contact is featured directly on the retail vendor directory so customers can reach you to purchase coupons."
                : "Update your basic account details and preferred contact channels."}
            </p>
          </div>
          {isVendor && (
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[var(--brand)]/10 px-3 py-1 text-xs font-bold text-[var(--brand)]">
                {tierConfig.badge}
              </span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                {tierConfig.marginLabel}
              </span>
            </div>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Display Name */}
          <div className="space-y-1.5">
            <label htmlFor="displayName" className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              {isVendor ? "Business / Distributor Name *" : "Full Legal / Display Name *"}
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[var(--muted)]">
                <User size={16} />
              </span>
              <input
                id="displayName"
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Adebayo Global Enterprises"
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-muted)]/30 py-2.5 pl-10 pr-3.5 text-sm font-semibold text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/15 transition"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              Phone Number
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[var(--muted)]">
                <Phone size={16} />
              </span>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +234 801 234 5678"
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-muted)]/30 py-2.5 pl-10 pr-3.5 text-sm font-semibold text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/15 transition"
              />
            </div>
          </div>

          {/* WhatsApp Desk */}
          <div className="space-y-1.5 sm:col-span-2">
            <div className="flex items-center justify-between">
              <label htmlFor="whatsapp" className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                WhatsApp Desk Number {isVendor ? "(Required for Directory Visibility)" : "(Optional)"}
              </label>
              {whatsapp && (
                <span className="inline-flex items-center gap-1 text-[0.7rem] font-bold text-emerald-600">
                  <CheckCircle2 size={12} />
                  <span>WhatsApp Enabled</span>
                </span>
              )}
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-emerald-600 font-bold text-xs">
                WA
              </span>
              <input
                id="whatsapp"
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="e.g. 2348012345678 (include country code without +)"
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-muted)]/30 py-2.5 pl-10 pr-3.5 text-sm font-semibold text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/15 transition"
              />
            </div>
            <p className="text-[0.72rem] text-[var(--muted)]">
              Format: Country code without spaces or symbols (e.g. 2348012345678). This generates your direct <code>wa.me</code> button for buyers.
            </p>
          </div>
        </div>
      </div>

      {/* Payout Bank Information */}
      <div className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm">
        <div className="border-b border-[var(--line)] pb-4 mb-5">
          <h3 className="text-base font-bold text-[var(--ink)]">Settlement & Bank Details</h3>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Designate the financial institution used for automated matured investment payouts and distributor commissions.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Bank Name */}
          <div className="space-y-1.5">
            <label htmlFor="bankName" className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              Financial Institution / Bank
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[var(--muted)]">
                <Building2 size={16} />
              </span>
              <input
                id="bankName"
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. First Bank of Nigeria / GTBank / Zenith"
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-muted)]/30 py-2.5 pl-10 pr-3.5 text-sm font-semibold text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/15 transition"
              />
            </div>
          </div>

          {/* Account Number */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="accountNumber" className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Account Number
              </label>
              {initialData.accountNumberLast4 && (
                <span className="text-[0.7rem] font-semibold text-[var(--muted)]">
                  Current on file: •••• {initialData.accountNumberLast4}
                </span>
              )}
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[var(--muted)]">
                <CreditCard size={16} />
              </span>
              <input
                id="accountNumber"
                type="text"
                maxLength={10}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder={initialData.accountNumberLast4 ? "Enter 10-digit number to update" : "e.g. 0123456789"}
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-muted)]/30 py-2.5 pl-10 pr-3.5 text-sm font-semibold text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/15 transition"
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700">
          {error.message}
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[var(--brand-dark)] transition disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <LoaderCircle size={16} className="animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
