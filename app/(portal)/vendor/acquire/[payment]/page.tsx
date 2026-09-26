import Link from "next/link";
import { PageHeader } from "@/components/portal/page-header";
import { requireRole } from "@/lib/auth/access";

export const dynamic = "force-dynamic";
export default async function LegacyPaymentPage({ params }: { params: Promise<{ payment: string }> }) { await requireRole(["VENDOR"]); const { payment } = await params; return <section><PageHeader eyebrow="Coupon purchase" title="Payment instructions updated" description={`The legacy request referenced ${payment} USDT.`}/><div className="card mt-8 p-7"><h2 className="text-xl font-bold">Use verified checkout</h2><p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">The copied wallet-address flow has been retired. Start a new acquisition so Paystack can initialize, verify and reconcile the payment before coupon inventory is issued.</p><Link className="mt-6 inline-block rounded-xl bg-[var(--brand)] px-5 py-3 font-bold text-white" href="/vendor/acquire">Return to acquisition</Link></div></section>; }
