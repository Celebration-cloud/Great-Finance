"use client";

import { createClient } from "@neondatabase/neon-js";
import type { Database } from "@/types/neon-database";

function createNeonBrowserClient(databaseUrl: string) {
  return createClient<Database>(databaseUrl, {
    auth: { url: `${window.location.origin}/api/auth` },
  });
}

type NeonBrowserClient = ReturnType<typeof createNeonBrowserClient>;
let client: NeonBrowserClient | undefined;

export function getNeonClient(): NeonBrowserClient {
  if (client) return client;
  const databaseUrl = process.env.NEXT_PUBLIC_NEON_DATABASE_URL;
  if (!databaseUrl) throw new Error("NEXT_PUBLIC_NEON_DATABASE_URL is required for Neon Auth and Data API access.");
  const created = createNeonBrowserClient(databaseUrl);
  client = created;
  return created;
}
