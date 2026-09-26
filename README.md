# Great Finance

Great Finance is a server-controlled financial platform built entirely with the Next.js App Router.

## Production architecture

- Next.js 16 App Router with Server Components by default
- Neon Auth proxy with server-side organization membership and RBAC
- Neon PostgreSQL with Prisma 7 and pooled runtime connections
- Immutable, balanced double-entry ledger with database triggers
- Paystack initialization, raw-body HMAC validation, verification and reconciliation
- Server-only FX provider access with a 15-minute database cache
- Maker-checker approvals, immutable audit records and transactional outbox events
- Zod contracts at every public mutation boundary

The combined four-page architecture model is available at `output/pdf/great-finance-production-architecture.pdf` and through `/api/architecture-pdf` while the app is running.

## Local setup

1. Copy `.env.example` to `.env.local` and enter real Neon, Neon Auth, Paystack and FX credentials.
2. Install dependencies with `npm install`.
3. Generate the client with `npm run db:generate`.
4. Apply the checked-in migration with `npm run db:deploy`.
5. Start the application with `npm run dev`.

The application deliberately fails closed when credentials are missing. `/setup` reports which integrations are connected without exposing their values.

## Product surface

The original customer, vendor and administrator route surface has been carried into the App Router. Marketing copy, plan data, registration fields, dashboard labels, referral tools, coupon acquisition, purchase history, KYC inputs and administrative queues are represented by reusable Next.js components.

Unsafe prototype behavior was intentionally not preserved: collection-wide browser subscriptions, plaintext passwords and bank account storage, fabricated dashboard rows, administrator impersonation, client-exposed FX credentials and manual wallet-address confirmation are replaced by scoped server queries, honest empty states or verified provider workflows. KYC file selection is visible, but submission remains fail-closed until secure object storage is configured.

## Verification

```bash
npm run db:validate
npm run typecheck
npm run lint
npm test
npm run build
npm audit
```

Live Neon Auth, database and Paystack flows require the credentials above and should be exercised in an isolated Neon branch with Paystack test keys before production deployment.

## Operational requirements

- Use `DATABASE_URL` for pooled application traffic and `DATABASE_URL_UNPOOLED` for migrations.
- Point Paystack webhooks to `/api/paystack/webhook`.
- Schedule `POST /api/jobs/reconcile-payments` with `Authorization: Bearer $CRON_SECRET`.
- Create organization and membership records after a Neon Auth user is provisioned; no authenticated user receives data access without an active membership.
- Run migrations against a Neon branch first, then promote after verification.
