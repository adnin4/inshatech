# IINSHA AI-BOS — V1600 OWNER COMMISSIONING GATES RUNBOOK (G1–G6)
**Generated At:** 2026-11-13T16:06:00+06:00 (Asia/Dhaka)  
**Classification:** `ACTIONABLE_OWNER_GATES`  
**Current Release Ceiling:** `READY_FOR_STAGING`

---

## Gate G1: GitHub Actions Maintainer Workflow Approval & Merge
* **Current Status:** `BLOCKED_EXTERNAL`
* **Why Blocked:** Candidate PR #72 (`release/iinsha-ai-bos-verified-20261112` -> `adnin4/inshatech:master`) contains 14 workflow runs in `action_required` status because GitHub requires maintainer approval for PRs originating from forks.
* **Owner Action:**
  1. Open [https://github.com/adnin4/inshatech/actions](https://github.com/adnin4/inshatech/actions).
  2. For workflow run #1009 (`43403055213`) or PR #72 checks, click **"Approve and run"**.
  3. Once checks complete green, review and merge PR #72 into `master`.

---

## Gate G2: Cloudflare Pages Durable Object Binding
* **Current Status:** `BLOCKED_EXTERNAL`
* **Why Blocked:** Cloudflare Pages Functions cannot communicate with the `SecurityCoordinator` Durable Object without the dashboard namespace binding.
* **Owner Action:**
  1. Go to Cloudflare Dashboard -> **Workers & Pages** -> **`inshatech`** -> **Settings** -> **Functions**.
  2. Under **Durable Object bindings**, add `SECURITY_COORDINATOR` pointing to `SecurityCoordinator` namespace.
  3. Add environment secrets: `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `MFA_SECRET`.

---

## Gate G3: Supabase Database Resume & Migration Alignment
* **Current Status:** `BLOCKED_EXTERNAL`
* **Why Blocked:** Canonical project `kitwadizsvjmuxkfewxj` (`inshatech-db`) is currently paused in the Supabase control plane.
* **Owner Action:**
  1. Go to [https://supabase.com/dashboard/project/kitwadizsvjmuxkfewxj](https://supabase.com/dashboard/project/kitwadizsvjmuxkfewxj).
  2. Click **"Resume Project"**.
  3. Verify API keys in **Settings** -> **API**, and configure `SUPABASE_URL` + `SUPABASE_ANON_KEY` in Cloudflare Pages.
  4. Alternatively, authorize switching canonical reference to active project `iuhtzahuszdkdarhxobx`.

---

## Gate G4: Payment Gateway Sandbox Credentials
* **Current Status:** `BLOCKED_EXTERNAL`
* **Why Blocked:** Live or sandbox credentials for SSLCommerz / Stripe are not populated in the staging environment.
* **Owner Action:**
  1. Provide merchant test credentials (`SSLCOMMERZ_STORE_ID`, `SSLCOMMERZ_STORE_PASSWORD`) in Cloudflare Pages dashboard secrets.
  2. Execute a single non-destructive test transaction to verify IPN and double-entry balance.

---

## Gate G5: Owner Authenticator MFA Enrollment
* **Current Status:** `BLOCKED_EXTERNAL`
* **Why Blocked:** Production owner has not yet scanned the Base32 QR code into their physical device.
* **Owner Action:**
  1. Generate an RFC 4648 Base32 secret (e.g. `JBSWY3DPEHPK3PXP...`).
  2. Store it as `MFA_SECRET` in Cloudflare Pages secrets.
  3. Scan or enter into Google Authenticator / 1Password.
  4. Perform test login on `/admin` to verify 2-step TOTP unlocking.

---

## Gate G6: Custom Apex Domain Cutover & Production Seal
* **Current Status:** `BLOCKED_EXTERNAL`
* **Why Blocked:** Custom domains `inshatech.com` and `www.inshatech.com` currently resolve to legacy site until production seal is commissioned.
* **Owner Action:**
  1. Verify Gates G1–G5 pass cleanly.
  2. Promote Pages deployment to production branch.
  3. Confirm TLS certificate and apex DNS cutover in Cloudflare Dashboard.
