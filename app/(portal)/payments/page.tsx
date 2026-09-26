import { requirePrincipal } from "@/lib/auth/principal";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  await requirePrincipal();
  return <section><p className="eyebrow">Collections</p><h1 className="mt-3 text-4xl font-semibold tracking-[-.035em]">Payments</h1><div className="card mt-8 p-7"><h2 className="text-xl font-bold">Provider-controlled checkout</h2><p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">Payment creation is exposed through the validated server endpoint. The next UI slice will connect customer invoices to that endpoint; no unverified browser response can post to the ledger.</p></div></section>;
}
