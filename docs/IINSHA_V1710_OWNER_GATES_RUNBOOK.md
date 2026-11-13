# IINSHA AI-BOS — V1710 OWNER GATES & COMMISSIONING RUNBOOK
**Target Release:** V1710 Production Delivery  
**Target Environment:** Cloudflare Pages + Supabase Managed PostgreSQL + Cloudflare Durable Objects  
**Governing Authority:** Sovereign Owner Gate Protocol (G1–G6)  

---

## 1. Overview of Owner Gates

In strict adherence to the **Zero False-Green Policy**, autonomous agents cannot fabricate credentials, unpause external cloud databases, or bypass GitHub organizational approval barriers. The following 6 gates require manual owner execution.

```
+-----------+     +-----------+     +-----------+     +-----------+     +-----------+     +-----------+
|  Gate G1  | --> |  Gate G2  | --> |  Gate G3  | --> |  Gate G4  | --> |  Gate G5  | --> |  Gate G6  |
|  GitHub   |     | Supabase  |     | Cloudflare|     | Durable   |     | Live Owner|     | Production|
|  Approval |     | Recovery  |     |  Secrets  |     |  Objects  |     | Smoke Test|     |  Cutover  |
+-----------+     +-----------+     +-----------+     +-----------+     +-----------+     +-----------+
```

---

## 2. Step-by-Step Gate Instructions

### Gate G1: GitHub Actions Maintainer Workflow Run Approval
* **Objective:** Authorize pending candidate CI workflow runs on the upstream repository `adnin4/inshatech`.
* **Prerequisites:** Maintainer access to `https://github.com/adnin4/inshatech`.
* **Action Steps:**
  1. Navigate to `https://github.com/adnin4/inshatech/actions`.
  2. Locate pending workflow runs triggered by Pull Request #72.
  3. Click **"Review and approve"** -> **"Approve and run"**.
  4. Ensure all CI jobs execute to completion: `verify-and-stage-artifact`, `deploy-staging`, `verify-staging-edge`.

---

### Gate G2: Supabase Managed Database Recovery & Migrations
* **Objective:** Unpause project `kitwadizsvjmuxkfewxj` and verify migration application.
* **Prerequisites:** Access to Supabase Dashboard (`https://supabase.com/dashboard/project/kitwadizsvjmuxkfewxj`).
* **Action Steps:**
  1. If the project is in a paused state, click **"Restore project"** in the dashboard and wait for the status to show **"Active"**.
  2. Confirm project reference matches: `kitwadizsvjmuxkfewxj`.
  3. Apply pending migrations using Supabase CLI or the SQL Editor in sequential order:
     ```bash
     npx supabase link --project-ref kitwadizsvjmuxkfewxj
     npx supabase db push
     ```
  4. Authoritative Migration Order (29 Files, Zero Duplicate Prefixes):
     - `20260809000000_init_iinsha_os.sql`
     - `20260818000001_autonomous_company_os.sql` through `20260818000014_financial_ledger_and_state_machine.sql`
     - `20260819000001_security_hardening.sql`
     - `20260820000001_enterprise_profiles_and_leads_rls.sql`
     - `20260820000002_enterprise_architecture_leads_and_transactions.sql`
     - `20260820000003_deterministic_rls_and_bkash_orders.sql`
     - `20260820000004_makerkit_multitenant_rbac_and_atomic_settlement.sql`
     - `20260820000005_rls_policy_normalization.sql`
     - `20260823000001_autonomous_company_engine.sql` through `20260823000008_authoritative_coupon_redemption_system.sql`
     - `20261113000001_seed_premium_services_catalog.sql`
  5. Verify that `services`, `leads`, `orders`, `payment_transactions`, and `admin_audit_logs` exist and have RLS enabled.

---

### Gate G3: Cloudflare Pages Secrets Injection
* **Objective:** Securely inject required environment secrets into Cloudflare Pages settings.
* **Prerequisites:** Cloudflare Dashboard access for project `inshatech`.
* **Action Steps:**
  1. Navigate to **Cloudflare Dashboard** -> **Workers & Pages** -> **inshatech** -> **Settings** -> **Environment variables**.
  2. Add the following encrypted environment secrets for both **Production** and **Preview**:
     | Secret Name | Value Description | Mandatory |
     |---|---|---|
     | `ADMIN_EMAIL` | Master owner email address (e.g., `admin@inshatech.com`) | YES |
     | `ADMIN_PASSWORD_HASH` | Salted PBKDF2 hash (600,000 iterations: `pbkdf2:600000:<salt>:<hash>`) | YES |
     | `JWT_SECRET` | Cryptographically random string (min 32 chars) for HMAC-SHA256 signing | YES |
     | `MFA_SECRET` | RFC 4648 Base32-encoded 20-byte seed for Google Authenticator TOTP | YES |
     | `SUPABASE_URL` | `https://kitwadizsvjmuxkfewxj.supabase.co` | YES |
     | `SUPABASE_ANON_KEY` | Supabase project anonymous public API key | YES |
     | `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role secret key (kept strictly confidential) | YES |
     | `SOURCE_RELEASE_SHA` | Exact full 40-character Git commit SHA of the deployed release | RECOMMENDED |
     | `BUILD_RELEASE_SHA` | Exact full 40-character Git commit SHA of the artifact build | RECOMMENDED |
     | `BUILD_TIMESTAMP` | ISO 8601 UTC timestamp of build completion | RECOMMENDED |

---

### Gate G4: External Durable Object Provisioning
* **Objective:** Deploy and bind the `SecurityCoordinator` Worker for strongly consistent anti-replay and token revocation.
* **Prerequisites:** Cloudflare Workers permissions on the account.
* **Action Steps:**
  1. Deploy the staging coordinator:
     ```bash
     cd workers/security-coordinator
     npx wrangler deploy --env staging
     ```
  2. Deploy the production coordinator:
     ```bash
     npx wrangler deploy --env production
     ```
  3. Ensure Pages project `inshatech` has the external binding configured:
     - Variable Name: `SECURITY_COORDINATOR`
     - Class Name: `SecurityCoordinator`
     - Script Name: `iinsha-security-coordinator-staging` (Preview) / `iinsha-security-coordinator-production` (Production)

---

### Gate G5: Live Authenticated Owner Smoke Test
* **Objective:** Verify end-to-end authentication, cookie security, and services persistence in a real browser.
* **Action Steps:**
  1. Open an incognito browser window and visit `https://inshatech-b6b.pages.dev/admin.html`.
  2. Confirm the accessible login dialog is displayed and background content is inert.
  3. Enter the configured `ADMIN_EMAIL` and password.
  4. Enter the current 6-digit TOTP code from Google Authenticator.
  5. Inspect the Network tab in DevTools:
     - Verify `/api/auth/session` response returns HTTP 200.
     - Verify response payload contains `{ "status": "AUTHENTICATED", "authenticated": true }` with **NO `session_token`** property.
     - Verify `Set-Cookie` header sets `__Host-iinsha_admin_session=...; Path=/; Secure; HttpOnly; SameSite=Strict`.
     - Verify `/api/admin/gate` returns HTTP 200 `AUTHORIZED`.
  6. Navigate to the Services Studio in `admin.html`:
     - Edit a service tier price or description and click Save.
     - Refresh the page and confirm the update persists.
  7. Click **"Lock / Logout"**:
     - Verify `/api/auth/logout` is called.
     - Verify cookie is cleared (`Max-Age=0`).
     - Confirm admin UI locks cleanly.

---

### Gate G6: Production Domain Cutover & Promotion
* **Objective:** Promote verified candidate to production domain `https://inshatech.com`.
* **Action Steps:**
  1. On `adnin4/inshatech`, navigate to **Actions** -> **Release Direct Upload (Zero Git Drift)**.
  2. Click **"Run workflow"**:
     - Select branch: `main` or `master`.
     - Target Environment: `production`.
  3. Confirm production deployment finishes with HTTP 200 on all endpoints.
  4. Verify production version endpoint:
     ```bash
     curl -fsSL https://inshatech.com/api/version
     ```
  5. Ensure payload reflects `status: "LIVE_VERIFIED"`, `full_production_parity: true`, and `production_ready: true`.
