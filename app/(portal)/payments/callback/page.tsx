import Link from "next/link";
import { PageHeader } from "@/components/portal/page-header";
import { requirePrincipal } from "@/lib/auth/principal";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export default async function PaymentCallbackPage({ searchParams }: { searchParams: Promise<{ reference?: string; trxref?: string }> }) { const principal = await requirePrincipal(); const query = await searchParams; const reference = query.reference ?? query.trxref; const payment = reference ? await getPrisma().paymentIntent.findFirst({ where: { reference, organizationId: principal.organizationId } }) : null; return <section><PageHeader eyebrow="Payment return" title={payment?.status === "SUCCEEDED" ? "Payment verified" : "Payment received"} description={payment ? `Reference ${payment.reference} is currently ${payment.status.toLowerCase()}.` : "We could not match this return to your organization."}/><div className="card mt-8 p-7"><p className="leading-7 text-[var(--muted)]">Provider verification happens on the server. If the webhook is delayed, the reconciliation job will check the transaction without relying on this browser return.</p><Link className="mt-6 inline-block rounded-xl bg-[var(--ink)] px-5 py-3 font-bold text-white" href={principal.role === "VENDOR" ? "/vendor/history" : "/payments"}>View payment history</Link></div></section>; }
