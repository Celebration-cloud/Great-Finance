import "server-only";
import { createHash } from "node:crypto";
import { Prisma, type PrismaClient } from "@/generated/prisma/client";

type TransactionClient = Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0];

export async function appendAuditLog(db: TransactionClient, input: { actorId?: string; actorRole?: string; action: string; entityType: string; entityId: string; ipAddress?: string; userAgent?: string; metadata?: Prisma.InputJsonValue }) {
  const previous = await db.auditLog.findFirst({ orderBy: [{ createdAt: "desc" }, { id: "desc" }], select: { hash: true } });
  const recordedAt = new Date();
  const material = JSON.stringify({ previousHash: previous?.hash ?? null, ...input, recordedAt: recordedAt.toISOString() });
  const hash = createHash("sha256").update(material).digest("hex");
  return db.auditLog.create({ data: { ...input, previousHash: previous?.hash, hash, createdAt: recordedAt } });
}
