import "server-only";
import { randomUUID } from "node:crypto";
import { getPrisma } from "@/lib/db";
import { postLedgerTransaction } from "@/features/ledger/service";
import { initializePaystackTransaction } from "./paystack";

export async function initializePayment(input: { organizationId: string; email: string; amountMinor: number; currency: string; idempotencyKey: string; actorId: string }, config: { secret: string; appUrl: string }) {
  const db = getPrisma();
  const existing = await db.paymentIntent.findUnique({ where: { idempotencyKey: input.idempotencyKey } });
  if (existing?.authorizationUrl) return existing;
  const reference = `GF-${Date.now()}-${randomUUID().slice(0, 8)}`;
  const intent = existing ?? await db.paymentIntent.create({ data: { organizationId: input.organizationId, customerEmail: input.email, amountMinor: input.amountMinor, currency: input.currency, reference, idempotencyKey: input.idempotencyKey } });
  const provider = await initializePaystackTransaction({ email: input.email, amountMinor: input.amountMinor, currency: input.currency, reference: intent.reference, callbackUrl: `${config.appUrl}/payments/callback` }, config.secret);
  if (!provider.status) throw new Error("Paystack declined payment initialization.");
  return db.paymentIntent.update({ where: { id: intent.id }, data: { status: "PROCESSING", providerReference: provider.data.reference, authorizationUrl: provider.data.authorization_url, accessCode: provider.data.access_code } });
}

export async function settleVerifiedPayment(reference: string, verified: { amount: number; currency: string; status: string; paid_at?: string | null }) {
  const db = getPrisma();
  return db.$transaction(async (tx) => {
    const payment = await tx.paymentIntent.findUnique({ where: { reference } });
    if (!payment) throw new Error("Payment intent was not found.");
    if (payment.status === "SUCCEEDED") return payment;
    if (verified.status !== "success" || BigInt(verified.amount) !== payment.amountMinor || verified.currency !== payment.currency) throw new Error("Provider verification does not match the payment intent.");
    const clearing = await tx.ledgerAccount.upsert({ where: { organizationId_code_currency: { organizationId: payment.organizationId, code: "PAYSTACK_CLEARING", currency: payment.currency } }, create: { organizationId: payment.organizationId, code: "PAYSTACK_CLEARING", name: "Paystack clearing", type: "ASSET", currency: payment.currency }, update: {} });
    const revenue = await tx.ledgerAccount.upsert({ where: { organizationId_code_currency: { organizationId: payment.organizationId, code: "COLLECTION_REVENUE", currency: payment.currency } }, create: { organizationId: payment.organizationId, code: "COLLECTION_REVENUE", name: "Collection revenue", type: "REVENUE", currency: payment.currency }, update: {} });
    await postLedgerTransaction(tx, { reference: `PAYMENT-${payment.reference}`, idempotencyKey: `paystack:settle:${payment.reference}`, description: `Paystack collection ${payment.reference}`, occurredAt: verified.paid_at ? new Date(verified.paid_at) : new Date(), createdBy: "paystack:webhook", entries: [{ accountId: clearing.id, direction: "DEBIT", amountMinor: payment.amountMinor, currency: payment.currency }, { accountId: revenue.id, direction: "CREDIT", amountMinor: payment.amountMinor, currency: payment.currency }] });
    await tx.outboxEvent.create({ data: { aggregateType: "payment", aggregateId: payment.id, eventType: "payment.succeeded", payload: { reference: payment.reference, organizationId: payment.organizationId } } });
    return tx.paymentIntent.update({ where: { id: payment.id }, data: { status: "SUCCEEDED", verifiedAt: new Date() } });
  });
}
