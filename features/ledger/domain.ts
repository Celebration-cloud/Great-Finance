import { z } from "zod";
import { errors } from "../../lib/errors/app-error.ts";

export const ledgerEntrySchema = z.object({
  accountId: z.string().min(1),
  direction: z.enum(["DEBIT", "CREDIT"]),
  amountMinor: z.bigint().positive(),
  currency: z.string().length(3).transform((value) => value.toUpperCase()),
});

export const ledgerPostingSchema = z.object({
  reference: z.string().min(6).max(100),
  idempotencyKey: z.string().min(8).max(150),
  description: z.string().min(3).max(240),
  occurredAt: z.date(),
  createdBy: z.string().min(1),
  entries: z.array(ledgerEntrySchema).min(2),
});

export type LedgerPosting = z.infer<typeof ledgerPostingSchema>;

export function validateBalancedPosting(input: LedgerPosting) {
  const posting = ledgerPostingSchema.parse(input);
  const currencies = new Set(posting.entries.map((entry) => entry.currency));
  if (currencies.size !== 1) throw errors.invariant("A ledger transaction must use one currency.");
  const debit = posting.entries.filter((entry) => entry.direction === "DEBIT").reduce((sum, entry) => sum + entry.amountMinor, 0n);
  const credit = posting.entries.filter((entry) => entry.direction === "CREDIT").reduce((sum, entry) => sum + entry.amountMinor, 0n);
  if (debit !== credit) throw errors.invariant("Ledger transaction is not balanced.");
  return posting;
}
