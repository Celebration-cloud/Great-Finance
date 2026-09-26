import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEON_AUTH_BASE_URL: z.string().url(),
  NEON_AUTH_COOKIE_SECRET: z.string().min(32),
  PAYSTACK_SECRET_KEY: z.string().startsWith("sk_"),
  APP_URL: z.string().url().default("http://localhost:3000"),
  CRON_SECRET: z.string().min(24),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function getServerEnv(): ServerEnv {
  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const fields = parsed.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new Error(`Server configuration is incomplete: ${fields}`);
  }
  return parsed.data;
}

export function hasDatabaseConfig() {
  return Boolean(process.env.DATABASE_URL);
}

export function hasAuthConfig() {
  return Boolean(process.env.NEON_AUTH_BASE_URL && process.env.NEON_AUTH_COOKIE_SECRET?.length && process.env.NEON_AUTH_COOKIE_SECRET.length >= 32);
}

export function hasDataApiConfig() {
  return Boolean(process.env.NEXT_PUBLIC_NEON_DATABASE_URL && process.env.NEON_DATA_API_URL);
}

export function hasStorageConfig() {
  return Boolean(process.env.NEON_STORAGE_BUCKET && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_ENDPOINT_URL_S3 && process.env.AWS_REGION);
}
