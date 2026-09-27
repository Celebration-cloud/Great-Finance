import dotenv from "dotenv";
dotenv.config();
import pg from "pg";
const { Client } = pg;
const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
  await client.connect();
  console.log("Connected. Applying withdrawal migration...");
  await client.query(`
    DO $$ BEGIN
      CREATE TYPE "WithdrawalStatus" AS ENUM ('PENDING', 'APPROVED', 'PROCESSING', 'COMPLETED', 'REJECTED');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE TABLE IF NOT EXISTS "withdrawal_requests" (
      "id"             TEXT NOT NULL,
      "investment_id"  TEXT NOT NULL,
      "customer_id"    TEXT NOT NULL,
      "org_id"         TEXT NOT NULL,
      "amount_minor"   BIGINT NOT NULL,
      "currency"       CHAR(3) NOT NULL DEFAULT 'NGN',
      "bank_name"      TEXT NOT NULL,
      "account_number" TEXT NOT NULL,
      "account_name"   TEXT NOT NULL,
      "status"         "WithdrawalStatus" NOT NULL DEFAULT 'PENDING',
      "note"           TEXT,
      "reviewed_by"    TEXT,
      "reviewed_at"    TIMESTAMP(3),
      "processed_at"   TIMESTAMP(3),
      "transfer_code"  TEXT,
      "created_at"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "withdrawal_requests_pkey" PRIMARY KEY ("id")
    );

    CREATE INDEX IF NOT EXISTS "withdrawal_requests_customer_id_status_created_at_idx"
      ON "withdrawal_requests"("customer_id", "status", "created_at");
    CREATE INDEX IF NOT EXISTS "withdrawal_requests_org_id_created_at_idx"
      ON "withdrawal_requests"("org_id", "created_at");
    CREATE INDEX IF NOT EXISTS "withdrawal_requests_status_created_at_idx"
      ON "withdrawal_requests"("status", "created_at");

    DO $$ BEGIN
      ALTER TABLE "withdrawal_requests"
        ADD CONSTRAINT "withdrawal_requests_investment_id_fkey"
        FOREIGN KEY ("investment_id") REFERENCES "investments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `);
  console.log("✔ Withdrawal tables and indexes created successfully.");
  await client.end();
}
main().catch((e) => { console.error("Migration error:", e); process.exit(1); });
