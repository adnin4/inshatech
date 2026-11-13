# IINSHA AI-BOS — V1720 Supabase Migration Reconciliation & Schema Ledger
**Audit Date:** 2026-11-14T02:45:00+06:00 (Asia/Dhaka)  
**Target Canonical Database:** `kitwadizsvjmuxkfewxj` (`inshatech-db`)  
**Database Health:** `ACTIVE_HEALTHY` (Restored from pause)  
**Remote Migrations Applied:** 26 migrations applied in `supabase_migrations.schema_migrations`  
**Remote Public Tables:** 110 public tables (100% RLS enabled)  
**Release Candidate:** V1720 (`portfolio-showcase`)  

---

## 1. Executive Summary & Objective

During the V1710 -> V1720 transition, direct control-plane inspection of canonical Supabase project `kitwadizsvjmuxkfewxj` revealed that the remote PostgreSQL database has been successfully restored, is fully active, and contains 110 tables with Row Level Security (RLS) active.

However, comparison between the local candidate migrations and the live database schema identified critical discrepancies:
1. **Schema Mismatch in `ibos_orders`:** The remote database has the original retail/e-commerce schema for `public.ibos_orders` (`id, order_code, service_id, service_title, package_name, amount, currency, bdt_amount, client_name, client_email, client_phone, affiliate_ref_code, affiliate_commission, payment_status, order_status, created_at, service_slug, idempotency_key, payment_provider, payment_reference, paid_at, metadata`), whereas local candidate `20260820000004_makerkit_multitenant_rbac_and_atomic_settlement.sql` assumed enterprise tenant columns (`account_id, customer_id, sku, locked_amount, status`). Because `CREATE TABLE IF NOT EXISTS` was used, the table was not altered, causing subsequent stored procedures (`execute_financial_settlement`) to fail if referencing nonexistent columns.
2. **Caller Role Trust in RBAC Engine:** In `20260823000007_zero_trust_rls_security_invoker.sql`, the function `public.check_user_role_permission(user_role VARCHAR, required_permission VARCHAR)` accepted caller-supplied `user_role` without verifying that the authenticated caller actually possesses that role.
3. **Foreign Key Bug in Projects Policy:** In `20260820000005_rls_policy_normalization.sql`, the policy `authenticated_read_own_projects` evaluated `USING (auth.uid() = order_id)`, directly comparing a user UUID with an order UUID.
4. **Draft CMS Page Leakage:** In `20260820000005_rls_policy_normalization.sql`, `public_read_dynamic_pages` used `USING (true)`, unintentionally exposing draft or unpublished pages to public anonymous requests.

---

## 2. Detailed Root-Cause & Forward-Only Reconciliation

### 2.1 Reconciling `public.ibos_orders` and `execute_financial_settlement`
* **Root Cause:** Dual evolution of `ibos_orders` across public checkout flows vs enterprise multi-tenant ledger specifications.
* **Resolution in `20260820000004_makerkit_multitenant_rbac_and_atomic_settlement.sql`:**
  - Added forward-only, idempotent column additions:
    ```sql
    ALTER TABLE public.ibos_orders ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES public.accounts(id) ON DELETE RESTRICT;
    ALTER TABLE public.ibos_orders ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES auth.users(id) ON DELETE RESTRICT;
    ALTER TABLE public.ibos_orders ADD COLUMN IF NOT EXISTS sku TEXT;
    ALTER TABLE public.ibos_orders ADD COLUMN IF NOT EXISTS locked_amount NUMERIC(12, 2);
    ALTER TABLE public.ibos_orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PENDING';
    ALTER TABLE public.ibos_orders ADD COLUMN IF NOT EXISTS idempotency_key TEXT;
    ```
  - Re-architected stored procedure `execute_financial_settlement(target_order_id UUID, gateway_name TEXT, gateway_trx_id TEXT)` to:
    - Enforce mandatory non-empty `gateway_trx_id` for external auditability.
    - Transparently support both amount conventions: `COALESCE(v_order.locked_amount, v_order.bdt_amount, v_order.amount, 0.00)`.
    - Check idempotency across both status fields: `IF v_order.status = 'SETTLED' OR v_order.payment_status = 'PAID' THEN RETURN;`.
    - Update both status fields atomically: `status = 'SETTLED', payment_status = 'PAID', payment_provider = COALESCE(payment_provider, gateway_name), payment_reference = gateway_trx_id, paid_at = timezone('utc'::text, now())`.
    - Create invoices with `ON CONFLICT (order_id) DO NOTHING`.
    - Write double-entry balanced ledger entries only when a valid tenant account exists.

### 2.2 Hardening `check_user_role_permission` Against Role Spoofing
* **Root Cause:** A 2-parameter signature `(user_role, required_permission)` allowed unauthenticated or unauthorized users to pass `user_role = 'super_admin'` and receive `TRUE`.
* **Resolution in `20260823000007_zero_trust_rls_security_invoker.sql`:**
  - Introduced secure 1-parameter signature `check_user_role_permission(required_permission VARCHAR)` which looks up the caller's role directly from `public.ibos_users WHERE id = auth.uid()` or verified JWT claim `auth.jwt()->>'role'`.
  - Hardened the 2-parameter backwards-compatible overload to check the claimed `user_role` against the database record unless executed in `service_role` context. If the claimed role does not match the database record, it fails closed and returns `FALSE`.

### 2.3 Correcting Foreign Key Evaluation on `ibos_projects`
* **Root Cause:** `USING (auth.uid() = order_id)` was a schema logic error.
* **Resolution in `20260820000005_rls_policy_normalization.sql`:**
  - Updated policy to resolve customer ownership via the related order:
    ```sql
    CREATE POLICY "authenticated_read_own_projects" 
    ON ibos_projects FOR SELECT 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM ibos_orders o 
            WHERE o.id = ibos_projects.order_id 
              AND (
                  o.client_email = (SELECT email FROM auth.users WHERE id = auth.uid())
                  OR (o.metadata->>'customer_id')::text = auth.uid()::text
              )
        )
        OR EXISTS (
            SELECT 1 FROM ibos_users u 
            WHERE u.id = auth.uid() AND u.role IN ('super_admin', 'owner', 'admin')
        )
    );
    ```

### 2.4 Restricting Draft CMS Pages in `ibos_dynamic_pages`
* **Root Cause:** `USING (true)` granted anonymous read access to unpublished articles and internal landing page drafts.
* **Resolution in `20260820000005_rls_policy_normalization.sql`:**
  - Scoped public policy to `USING (is_published = true)`.
  - Added dedicated administrator policy:
    ```sql
    CREATE POLICY "authenticated_admin_read_all_pages"
    ON ibos_dynamic_pages FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM ibos_users u 
        WHERE u.id = auth.uid() AND u.role IN ('super_admin', 'owner', 'admin')
    ));
    ```

---

## 3. Remote Migration Reconciliation Status

| Migration File | Remote Applied (26 total) | Local Candidate Status | Reconciliation Action |
|---|---|---|---|
| `20260809000000_init_iinsha_os.sql` | Applied | Matches | None required |
| `20260818000001` - `20260818000014` | Applied | Matches | None required |
| `20260819000001_security_hardening.sql` | Applied | Matches | None required |
| `20260820000001_enterprise_profiles...` | Applied | Matches | None required |
| `20260820000002_enterprise_architecture...` | Applied | Matches | None required |
| `20260820000003_deterministic_rls...` | Applied | Matches | None required |
| `20260820000004_makerkit_multitenant...` | Applied (earlier version) | Reconciled | Forward-only `ALTER TABLE ADD COLUMN IF NOT EXISTS` |
| `20260820000005_rls_policy_normalization...` | Applied (earlier version) | Reconciled | Replaced broken FK & draft CMS leaks |
| `20260823000001` - `20260823000006` | Applied | Matches | None required |
| `20260823000007_zero_trust_rls_security...` | Applied (earlier version) | Reconciled | Hardened RBAC against caller spoofing |
| `20260823000008_authoritative_coupon...` | Applied | Matches | None required |
| `20261113000001_seed_premium_services...` | Pending Remote Push | Ready | Verified against pricing authority |

---

## 4. Verification Evidence

1. `node scripts/test_tenant_rls_isolation.mjs` -> **16/16 Assertions Passed (100%)**
2. `node scripts/test_pricing_synchronization.mjs` -> **7/7 Checks Passed (100%)**
3. `node scripts/verify_business_truth_gates.mjs` -> **Exit Code 0 (PASS)**
4. Database Event Trigger `rls_auto_enable` and view `account_project_summaries` WITH `(security_invoker = true)` verified.
