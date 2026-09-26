import "dotenv/config";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const databaseUrl = process.env.DATABASE_URL_UNPOOLED;
if (!databaseUrl) throw new Error("DATABASE_URL_UNPOOLED is required to generate Data API types.");

const cli = fileURLToPath(new URL("../node_modules/@neondatabase/neon-js/dist/cli/index.mjs", import.meta.url));
const result = spawnSync(process.execPath, [cli, "gen-types", "--db-url", databaseUrl, "--schema", "public", "--output", "types/neon-database.ts"], {
  cwd: process.cwd(),
  stdio: "inherit",
});

if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
