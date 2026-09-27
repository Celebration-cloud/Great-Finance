import dotenv from "dotenv";
dotenv.config();
import pg from "pg";
const { Client } = pg;
const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
  await client.connect();
  console.log("Connected to database. Applying vendor_tier migration...");
  await client.query(`
    ALTER TABLE "profiles"
    ADD COLUMN IF NOT EXISTS "vendor_tier" TEXT DEFAULT 'TIER_1_STARTER';
  `);
  console.log("✔ Added vendor_tier column to profiles successfully.");
  await client.end();
}
main().catch((e) => {
  console.error("Migration error:", e);
  process.exit(1);
});
