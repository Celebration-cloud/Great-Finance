import dotenv from "dotenv";
dotenv.config();
import pg from "pg";
const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  await client.connect();
  console.log("Connected to Neon DB. Applying coupon migration...");

  const sql = `
    DO $$ BEGIN
        CREATE TYPE "CouponStatus" AS ENUM ('ACTIVE', 'REDEEMED', 'EXPIRED', 'VOIDED');
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
        CREATE TYPE "InvestmentStatus" AS ENUM ('ACTIVE', 'MATURED', 'SETTLED', 'CANCELLED');
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$;

    CREATE TABLE IF NOT EXISTS "coupons" (
        "id" TEXT NOT NULL,
        "code" TEXT NOT NULL,
        "plan_name" TEXT NOT NULL,
        "plan_amount" INTEGER NOT NULL,
        "return_amount" INTEGER NOT NULL,
        "duration_days" INTEGER NOT NULL,
        "vendor_org_id" TEXT NOT NULL,
        "purchase_ref" TEXT NOT NULL,
        "status" "CouponStatus" NOT NULL DEFAULT 'ACTIVE',
        "redeemed_by" TEXT,
        "redeemed_at" TIMESTAMP(3),
        "expires_at" TIMESTAMP(3),
        "issued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
    );

    CREATE TABLE IF NOT EXISTS "investments" (
        "id" TEXT NOT NULL,
        "coupon_id" TEXT NOT NULL,
        "customer_id" TEXT NOT NULL,
        "org_id" TEXT NOT NULL,
        "plan_name" TEXT NOT NULL,
        "plan_amount" INTEGER NOT NULL,
        "return_amount" INTEGER NOT NULL,
        "duration_days" INTEGER NOT NULL,
        "mature_at" TIMESTAMP(3) NOT NULL,
        "status" "InvestmentStatus" NOT NULL DEFAULT 'ACTIVE',
        "settled_at" TIMESTAMP(3),
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "investments_pkey" PRIMARY KEY ("id")
    );

    CREATE UNIQUE INDEX IF NOT EXISTS "coupons_code_key" ON "coupons"("code");
    CREATE INDEX IF NOT EXISTS "coupons_vendor_org_id_status_issued_at_idx" ON "coupons"("vendor_org_id", "status", "issued_at");
    CREATE INDEX IF NOT EXISTS "coupons_code_idx" ON "coupons"("code");
    CREATE INDEX IF NOT EXISTS "coupons_redeemed_by_idx" ON "coupons"("redeemed_by");

    CREATE UNIQUE INDEX IF NOT EXISTS "investments_coupon_id_key" ON "investments"("coupon_id");
    CREATE INDEX IF NOT EXISTS "investments_customer_id_status_mature_at_idx" ON "investments"("customer_id", "status", "mature_at");
    CREATE INDEX IF NOT EXISTS "investments_org_id_created_at_idx" ON "investments"("org_id", "created_at");
    CREATE INDEX IF NOT EXISTS "investments_status_mature_at_idx" ON "investments"("status", "mature_at");

    DO $$ BEGIN
        ALTER TABLE "investments" ADD CONSTRAINT "investments_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$;
  `;

  await client.query(sql);
  console.log("Migration executed successfully! Tables 'coupons' and 'investments' are created and indexed.");
  await client.end();
}

main().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
