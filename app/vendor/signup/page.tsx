import Link from "next/link";
import { RegistrationForm } from "@/components/auth/registration-form";
import { hasAuthConfig, hasDatabaseConfig } from "@/lib/env/server";
import { parseVendorTier, VENDOR_TIERS } from "@/lib/vendor/tiers";
import { AuthPageReveal } from "@/components/auth/auth-page-reveal";

export default async function VendorSignupPage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string }>;
}) {
  const params = await searchParams;
  const initialTier = parseVendorTier(params.tier);
  const selectedTierConfig = VENDOR_TIERS[initialTier];

  return (
    <main className="shell grid place-items-center py-12">
      <AuthPageReveal className="w-full max-w-xl">
      <section className="card w-full p-7 sm:p-9">
        <div className="flex items-center justify-between">
          <p className="eyebrow">Vendor account</p>
          <span className="rounded-full bg-[var(--brand)]/10 px-3 py-1 text-xs font-bold text-[var(--brand)]">
            {selectedTierConfig.marginLabel}
          </span>
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-.03em]">Vendor registration</h1>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Join the authorized distributor network at your selected partner tier. Wholesale discounts and benefits will be synchronized directly to your dashboard.
        </p>

        <RegistrationForm
          accountType="VENDOR"
          configured={hasAuthConfig() && hasDatabaseConfig()}
          initialTier={initialTier}
        />

        <p className="mt-5 text-center text-sm text-[var(--muted)]">
          Already have an account?{" "}
          <Link className="font-bold text-[var(--brand)]" href="/vendor/login">
            Login
          </Link>
        </p>
      </section>
      </AuthPageReveal>
    </main>
  );
}
