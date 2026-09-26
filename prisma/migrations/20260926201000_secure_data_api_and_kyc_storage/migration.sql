-- Persist only object keys and verified metadata. File bytes remain in the
-- branch-matched private Neon Storage bucket.
CREATE TABLE "vendor_kyc_submissions" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "auth_user_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "state_of_origin" TEXT NOT NULL,
    "local_government" TEXT NOT NULL,
    "identity_object_key" TEXT NOT NULL,
    "identity_content_type" TEXT NOT NULL,
    "identity_size_bytes" INTEGER NOT NULL,
    "selfie_object_key" TEXT NOT NULL,
    "selfie_content_type" TEXT NOT NULL,
    "selfie_size_bytes" INTEGER NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "vendor_kyc_submissions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "vendor_kyc_identity_size" CHECK ("identity_size_bytes" > 0 AND "identity_size_bytes" <= 41943040),
    CONSTRAINT "vendor_kyc_selfie_size" CHECK ("selfie_size_bytes" > 0 AND "selfie_size_bytes" <= 41943040)
);

CREATE UNIQUE INDEX "vendor_kyc_submissions_identity_object_key_key" ON "vendor_kyc_submissions"("identity_object_key");
CREATE UNIQUE INDEX "vendor_kyc_submissions_selfie_object_key_key" ON "vendor_kyc_submissions"("selfie_object_key");
CREATE INDEX "vendor_kyc_submissions_organization_id_submitted_at_idx" ON "vendor_kyc_submissions"("organization_id", "submitted_at");
CREATE INDEX "vendor_kyc_submissions_auth_user_id_submitted_at_idx" ON "vendor_kyc_submissions"("auth_user_id", "submitted_at");

ALTER TABLE "vendor_kyc_submissions"
  ADD CONSTRAINT "vendor_kyc_submissions_organization_id_fkey"
  FOREIGN KEY ("organization_id") REFERENCES "organizations"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

-- The Data API is an authenticated read model. All business writes continue
-- through validated Next.js route handlers and Prisma transactions.
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM authenticated, anonymous;
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM authenticated, anonymous;
ALTER DEFAULT PRIVILEGES FOR ROLE neondb_owner IN SCHEMA public REVOKE ALL ON TABLES FROM authenticated, anonymous;
ALTER DEFAULT PRIVILEGES FOR ROLE neondb_owner IN SCHEMA public REVOKE ALL ON SEQUENCES FROM authenticated, anonymous;

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON TABLE
  "organizations",
  "profiles",
  "memberships",
  "ledger_accounts",
  "ledger_transactions",
  "ledger_entries",
  "payment_intents",
  "fx_rates",
  "approval_requests",
  "vendor_kyc_submissions"
TO authenticated;

CREATE SCHEMA IF NOT EXISTS app_private;
REVOKE ALL ON SCHEMA app_private FROM PUBLIC, anonymous;
GRANT USAGE ON SCHEMA app_private TO authenticated;

CREATE OR REPLACE FUNCTION app_private.has_active_membership(target_organization_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.memberships membership
    WHERE membership.organization_id = target_organization_id
      AND membership.auth_user_id = auth.user_id()
      AND membership.status = 'ACTIVE'
  );
$$;

CREATE OR REPLACE FUNCTION app_private.can_read_ledger_transaction(target_transaction_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.ledger_entries entry
    JOIN public.ledger_accounts account ON account.id = entry.account_id
    JOIN public.memberships membership ON membership.organization_id = account.organization_id
    WHERE entry.transaction_id = target_transaction_id
      AND membership.auth_user_id = auth.user_id()
      AND membership.status = 'ACTIVE'
  );
$$;

REVOKE ALL ON FUNCTION app_private.has_active_membership(text) FROM PUBLIC, anonymous;
REVOKE ALL ON FUNCTION app_private.can_read_ledger_transaction(text) FROM PUBLIC, anonymous;
GRANT EXECUTE ON FUNCTION app_private.has_active_membership(text) TO authenticated;
GRANT EXECUTE ON FUNCTION app_private.can_read_ledger_transaction(text) TO authenticated;

ALTER TABLE "organizations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "memberships" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ledger_accounts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ledger_transactions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ledger_entries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payment_intents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "fx_rates" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "approval_requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "vendor_kyc_submissions" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "organizations_member_read" ON "organizations"
  FOR SELECT TO authenticated
  USING (app_private.has_active_membership("id"));

CREATE POLICY "profiles_self_read" ON "profiles"
  FOR SELECT TO authenticated
  USING ("auth_user_id" = auth.user_id());

CREATE POLICY "memberships_self_read" ON "memberships"
  FOR SELECT TO authenticated
  USING ("auth_user_id" = auth.user_id());

CREATE POLICY "ledger_accounts_member_read" ON "ledger_accounts"
  FOR SELECT TO authenticated
  USING ("organization_id" IS NOT NULL AND app_private.has_active_membership("organization_id"));

CREATE POLICY "ledger_transactions_member_read" ON "ledger_transactions"
  FOR SELECT TO authenticated
  USING (app_private.can_read_ledger_transaction("id"));

CREATE POLICY "ledger_entries_member_read" ON "ledger_entries"
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM "ledger_accounts" account
    WHERE account."id" = "ledger_entries"."account_id"
      AND account."organization_id" IS NOT NULL
      AND app_private.has_active_membership(account."organization_id")
  ));

CREATE POLICY "payment_intents_member_read" ON "payment_intents"
  FOR SELECT TO authenticated
  USING (app_private.has_active_membership("organization_id"));

CREATE POLICY "fx_rates_authenticated_read" ON "fx_rates"
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "approval_requests_member_read" ON "approval_requests"
  FOR SELECT TO authenticated
  USING ("organization_id" IS NOT NULL AND app_private.has_active_membership("organization_id"));

CREATE POLICY "vendor_kyc_submissions_self_read" ON "vendor_kyc_submissions"
  FOR SELECT TO authenticated
  USING ("auth_user_id" = auth.user_id());
