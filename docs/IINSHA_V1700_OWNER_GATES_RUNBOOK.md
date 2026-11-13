# IINSHA AI-BOS — V1700 OWNER GATES RUNBOOK (G1–G6)
**Baseline Timestamp:** 2026-11-13T17:42:00+06:00 (Asia/Dhaka)  
**Target Repository:** `adnin4/inshatech`  
**Purpose:** Clear, step-by-step external actions required by repository and cloud resource owners to authorize production sealing.

---

## Overview of Owner Gates

The Antigravity Zero False-Green Policy dictates that no automated tool can simulate external credentials, owner approvals, or cloud console actions. The following 6 gates must be executed by the authorized account holder:

```
+-----------------------------------------------------------------------------------+
|                        EXTERNAL OWNER COMMISSIONING GATES                         |
+-----------------------------------------------------------------------------------+
|  [GATE G1] Maintainer CI Approval: adnin4 must approve GitHub Actions run         |
|  [GATE G2] Pull Request Merge: adnin4 must merge PR #72 into master branch        |
|  [GATE G3] Supabase Project Unpause: Resume kitwadizsvjmuxkfewxj or switch ref   |
|  [GATE G4] Supabase Schema Migration: Execute SQL migration on active instance   |
|  [GATE G5] Cloudflare Pages Secrets: Provision production environment variables  |
|  [GATE G6] Production DNS Cutover: Point inshatech.com CNAME to inshatech.pages.dev|
+-----------------------------------------------------------------------------------+
```

---

### GATE G1: Maintainer GitHub Actions Approval
- **Account:** `adnin4` (Owner of upstream `adnin4/inshatech`)
- **Direct Link:** [GitHub Actions Workflow Runs](https://github.com/adnin4/inshatech/actions)
- **Action:** Open latest PR #72 workflow run (e.g., Run ID `43407018257`) and click **"Approve and run"**.
- **Impact:** Allows GitHub hosted runners to execute the verification pipeline and post green status checks on PR #72.

---

### GATE G2: Upstream Pull Request Merge
- **Account:** `adnin4`
- **Direct Link:** [Open PR #72](https://github.com/adnin4/inshatech/pull/72)
- **Action:**
  1. Review the commits and verification ledgers.
  2. Select **"Rebase and merge"** or **"Squash and merge"**.
- **Impact:** Advances upstream `master` to the candidate SHA, synchronizing upstream release authority.

---

### GATE G3: Supabase Database Restoration
- **Account:** Supabase Account Owner
- **Option A (Resume Canonical Database):**
  1. Navigate to `https://supabase.com/dashboard/project/kitwadizsvjmuxkfewxj`.
  2. Click **"Restore Project"** (currently paused).
- **Option B (Authorize New Project Ref):**
  If using an active alternative project (e.g. `iuhtzahuszdkdarhxobx`), update `CANONICAL_RELEASE.canonical_db_ref` in `functions/_shared/release_manifest.js`.

---

### GATE G4: Supabase Schema Migration
- **Account:** Supabase Project Admin
- **Action:**
  1. Navigate to the SQL Editor in Supabase Dashboard.
  2. Execute the migration script located at `supabase/migrations/20261111_auth_tables.sql` to ensure `services`, `payment_transactions`, and `admin_audit_logs` tables exist.
  3. Verify table existence:
     ```sql
     SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
     ```

---

### GATE G5: Cloudflare Pages Secrets Provisioning
- **Account:** Cloudflare Account Owner (`inshatech` Pages project)
- **Action:**
  1. Navigate to Cloudflare Dashboard > Workers & Pages > `inshatech` > Settings > Environment variables.
  2. Set the following Production and Staging variables:
     - `SUPABASE_URL`: `https://kitwadizsvjmuxkfewxj.supabase.co`
     - `SUPABASE_ANON_KEY`: `<your_anon_key>`
     - `SUPABASE_SERVICE_ROLE_KEY`: `<your_service_key>`
     - `ADMIN_EMAIL`: `admin@inshatech.com`
     - `ADMIN_PASSWORD_HASH`: `<pbkdf2_600k_hash>`
     - `JWT_SECRET`: `<64_character_hex_secret>`
     - `MFA_SECRET`: `<valid_base32_seed>`

---

### GATE G6: Production DNS Cutover
- **Account:** Registrar / Cloudflare DNS Manager
- **Action:**
  1. Verify custom domain DNS records for `inshatech.com` and `www.inshatech.com`.
  2. Ensure CNAME points to `inshatech.pages.dev`.
  3. Verify SSL certificate issuance (Universal SSL).
