# IINSHA AI-BOS — V1720 Root-Cause Remediation Ledger
**Audit Date:** 2026-11-14T02:49:00+06:00 (Asia/Dhaka)  
**Operating Workspace:** `C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase`  
**Candidate Release:** V1720  

---

## 1. Defect & Remediation Index

This ledger maps each defect identified during the V1710/V1720 live audit to its verified root cause, surgical fix, and empirical test proof.

---

### DEFECT-01: Quality Guard Workflow False Failure on Output Directory
- **Classification:** CI/CD Architecture Defect
- **File Affected:** `.github/workflows/quality_guard.yml`
- **Root Cause:** An inline Python string assertion checked `pages_build_output_dir = "."`, but canonical `wrangler.toml` properly specifies `dist-pages` for staged artifact distribution.
- **Surgical Fix:** Created `scripts/validate_wrangler_config.py` using Python `tomllib` to parse structured TOML, allow `dist-pages` or `.`, and validate absence of Worker keys. Updated `quality_guard.yml` to call this script.
- **Verification Evidence:** `python scripts/validate_wrangler_config.py` exits with code 0 (`Wrangler config valid for Cloudflare Pages!`).

---

### DEFECT-02: Release Direct Upload Workflow Failing on Fork Repositories
- **Classification:** CI/CD Secrets Dependency Defect
- **File Affected:** `.github/workflows/release-direct-upload.yml`
- **Root Cause:** The `deploy-staging` job attempted to invoke `cloudflare/pages-action` on fork push events where `CLOUDFLARE_API_TOKEN` is not present, failing the pipeline.
- **Surgical Fix:** Added repository gating `if: github.repository == 'adnin4/inshatech'` to `deploy-staging`. On forks, `verify-and-stage-artifact` runs full verification and cleanly skips deploy.
- **Verification Evidence:** Verified workflow YAML syntax; local artifact staging runs with exit code 0.

---

### DEFECT-03: Deploy Workflow 10-Minute Timeout on Fork Pushes
- **Classification:** CI/CD Pipeline Bottleneck
- **File Affected:** `.github/workflows/deploy.yml`
- **Root Cause:** The `runtime-evidence` job executed on fork push events and polled `https://inshatech-b6b.pages.dev/api/version` waiting for the fork's commit SHA for 10 minutes (60 retries), timing out.
- **Surgical Fix:** Added `if: github.repository == 'adnin4/inshatech' && github.event_name == 'push' && (github.ref == 'refs/heads/master' || github.ref == 'refs/heads/main')`.
- **Verification Evidence:** Eliminated fork-time edge polling loop.

---

### DEFECT-04: Admin Auth Token Exposure via Spoofed Header
- **Classification:** Application Security / Session Hardening
- **File Affected:** `functions/api/auth/session.js`
- **Root Cause:** `if (!isBrowserSession || ... || request.headers.get('X-Client-Type') === 'cli')` allowed browser requests sending `X-Client-Type: cli` to receive `session_token` in JSON, compromising pure cookie-only architecture.
- **Surgical Fix:** Changed condition to `if (!isBrowserSession && (env.ENVIRONMENT === 'test' || request.headers.get('X-Client-Type') === 'cli'))`. Browser requests **NEVER** receive `session_token` in JSON under any circumstance.
- **Verification Evidence:** `scripts/test_admin_auth_security.mjs` Test 14C passes: spoofed header is authenticated with HTTP 200 but strictly denied JSON token (`session_token === undefined`).

---

### DEFECT-05: Non-Canonical Base32 Secret Fallback in Production TOTP
- **Classification:** Cryptographic Boundary Defect
- **File Affected:** `functions/api/auth/session.js`
- **Root Cause:** `computeTotp()` silently fell back to raw UTF-8 string encoding when Base32 decoding failed, allowing weak non-RFC 4648 secrets in production.
- **Surgical Fix:** Hardened `computeTotp()` to throw `INVALID_BASE32_SECRET` on invalid Base32 unless `options.allowLegacyUtf8 === true`. Disallowed `allowLegacy` in production/staging environments.
- **Verification Evidence:** All 115 security assertions in `scripts/test_admin_auth_security.mjs` pass cleanly using RFC 4648 test vectors.

---

### DEFECT-06: Fabricated Affiliate Partner Records in Admin UI
- **Classification:** Business Logic / Data Truthfulness
- **File Affected:** `admin.html`
- **Root Cause:** Hardcoded partner records (`mahin10`, `apex_agency`, phone numbers, emails, fake bKash accounts, and fake $2,620 unpaid balances) were returned as default registry data. A duplicate `adminTriggerBatchPayout` at line 3132 also hardcoded "$2,450.00 USD across verified partner tiers".
- **Surgical Fix:**
  - Removed all hardcoded partner records from default registry.
  - Default registry returns `{}` (truthful 0 registered partners).
  - Isolated mock partner data into `DEMO_AFFILIATE_PARTNERS`, accessible only when `window.crmDemoMode === true` with a prominent yellow warning banner.
  - Unified `window.adminTriggerBatchPayout()` to disburse only real unpaid balances, displaying an informative notification when unpaid total is $0.00.
  - Fixed syntax bug on partner modal creation (`modal.style.cssText`).
- **Verification Evidence:** `Select-String -Pattern "mahin10|apex_agency"` returns 0 occurrences across `admin.html`.

---

### DEFECT-07: Schema Mismatch in `ibos_orders` Migration
- **Classification:** Database Schema Parity
- **File Affected:** `supabase/migrations/20260820000004_makerkit_multitenant_rbac_and_atomic_settlement.sql`
- **Root Cause:** The remote `public.ibos_orders` table already exists with e-commerce columns, while local candidate migration assumed tenant columns (`account_id, locked_amount, status`). Since `CREATE TABLE IF NOT EXISTS` was used, the table was not altered and stored procedures failed.
- **Surgical Fix:** Added forward-only idempotent `ALTER TABLE public.ibos_orders ADD COLUMN IF NOT EXISTS ...` declarations. Reconciled `execute_financial_settlement` to support both `locked_amount` and `bdt_amount`/`amount`, and both `status` and `payment_status`. Enforced mandatory non-empty `gateway_trx_id`.
- **Verification Evidence:** `node scripts/test_tenant_rls_isolation.mjs` passes 16/16 tests.

---

### DEFECT-08: Caller Role Trust in RBAC Engine
- **Classification:** Authorization / Privilege Escalation
- **File Affected:** `supabase/migrations/20260823000007_zero_trust_rls_security_invoker.sql`
- **Root Cause:** `check_user_role_permission(user_role, required_permission)` trusted the caller-supplied `user_role` argument, allowing unprivileged users to claim `super_admin`.
- **Surgical Fix:** Added 1-arg overload `check_user_role_permission(required_permission)` deriving role securely from `public.ibos_users WHERE id = auth.uid()` or JWT claims. Hardened the 2-arg signature to verify caller role against database records unless called in `service_role` context.
- **Verification Evidence:** RLS test suite passes with exit code 0.

---

### DEFECT-09: Foreign Key Logic Error in Projects Policy
- **Classification:** Row Level Security (RLS) Policy Bug
- **File Affected:** `supabase/migrations/20260820000005_rls_policy_normalization.sql`
- **Root Cause:** Policy `authenticated_read_own_projects` evaluated `USING (auth.uid() = order_id)`, comparing a user UUID to an order UUID.
- **Surgical Fix:** Updated policy to resolve customer ownership via the related order (`o.client_email = auth.user email` or `o.metadata->>'customer_id' = auth.uid()`), with administrator bypass.
- **Verification Evidence:** Validated in `test_tenant_rls_isolation.mjs`.

---

### DEFECT-10: Draft Dynamic CMS Pages Exposed Publicly
- **Classification:** Data Privacy / RLS Scope Leak
- **File Affected:** `supabase/migrations/20260820000005_rls_policy_normalization.sql`
- **Root Cause:** Policy `public_read_dynamic_pages` used `USING (true)`, exposing unpublished CMS drafts to anonymous requests.
- **Surgical Fix:** Scoped public read policy to `USING (is_published = true)` and added an authenticated administrator policy for draft management.
- **Verification Evidence:** Validated in `test_tenant_rls_isolation.mjs`.
