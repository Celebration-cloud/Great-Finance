import "server-only";
import type { PrismaClient } from "@/generated/prisma/client";
import { validateBalancedPosting, type LedgerPosting } from "./domain";

type TransactionClient = Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0];

export async function postLedgerTransaction(db: TransactionClient, input: LedgerPosting) {
  const posting = validateBalancedPosting(input);
  return db.ledgerTransaction.create({
    data: {
      reference: posting.reference,
      idempotencyKey: posting.idempotencyKey,
      description: posting.description,
      occurredAt: posting.occurredAt,
      createdBy: posting.createdBy,
      entries: { create: posting.entries },
    },
    include: { entries: true },
  });
}
