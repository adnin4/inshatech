# IINSHA AI-BOS — V1720 External Owner Gates Runbook
**Audit Date:** 2026-11-14T02:52:00+06:00 (Asia/Dhaka)  
**Operating Workspace:** `C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase`  
**Candidate Release:** V1720  

---

## 1. External Owner Gates Overview

Under the zero-false-green engineering policy, Google Antigravity and autonomous engineering pipelines cannot forge external owner authorization, simulate private production API keys, or self-approve upstream GitHub actions.

The following 6 Owner Gates (G1–G6) must be executed by the repository owner (`adnin4` / `Adnin Sadat Mahin`) before the release can be transitioned from `READY_FOR_STAGING` to `PRODUCTION_SEALED`.

---

## 2. Gate-by-Gate Step-by-Step Runbook

### Gate G1: GitHub Upstream Workflow Approval & PR #72 Merge
- **Owner Action:**
  1. Open [https://github.com/adnin4/inshatech/pull/72](https://github.com/adnin4/inshatech/pull/72).
  2. Under the "Checks" tab, click "Approve and run" for the waiting GitHub Action workflows.
  3. Verify all checks complete green.
  4. Merge PR #72 into upstream `master` branch.
- **Verification Criterion:** Upstream PR #72 is merged and HEAD of `adnin4/inshatech:master` matches candidate SHA.

### Gate G2: Supabase Staging vs Production Migration Verification
- **Owner Action:**
  1. Verify canonical Supabase project `kitwadizsvjmuxkfewxj` status in the Supabase Dashboard.
  2. If applying candidate migrations to remote staging:
     ```bash
     npx supabase db push --project-ref kitwadizsvjmuxkfewxj
     ```
  3. Confirm that tables `public.ibos_orders`, `public.price_catalog`, `public.ibos_invoices`, and `public.ibos_ledger` reflect reconciled columns.
- **Verification Criterion:** Supabase reports migration status healthy and schema tables accessible with RLS active.

### Gate G3: Cloudflare Durable Object Workers Deployment
- **Owner Action:**
  1. Deploy the external security coordinator worker to staging and production:
     ```bash
     cd workers/security-coordinator
     npx wrangler deploy --env staging
     npx wrangler deploy --env production
     ```
  2. Confirm bindings in Cloudflare Pages Dashboard -> Settings -> Functions -> Durable Object Bindings:
     - `SECURITY_COORDINATOR` -> class `SecurityCoordinator`, script `iinsha-security-coordinator-staging`
- **Verification Criterion:** Workers active in Cloudflare dashboard and reachable from Pages Functions.

### Gate G4: Cloudflare Production Secret Provisioning
- **Owner Action:**
  1. Set the following environment variables in Cloudflare Pages dashboard for production:
     - `ADMIN_EMAIL`
     - `ADMIN_PASSWORD_HASH` (PBKDF2 600,000 iterations)
     - `JWT_SECRET` (minimum 32 cryptographic random characters)
     - `MFA_SECRET` (RFC 4648 valid Base32 secret for Google Authenticator)
     - `SUPABASE_URL`
     - `SUPABASE_SERVICE_ROLE_KEY`
- **Verification Criterion:** `/api/admin/integrations` confirms required production secrets configured.

### Gate G5: Authenticated Live Production UAT Walkthrough
- **Owner Action:**
  1. Navigate to `https://inshatech.pages.dev/admin.html`.
  2. Complete 2FA login with verified Google Authenticator OTP code.
  3. Confirm admin dashboard displays 0 partners in live mode.
  4. Confirm that setting `window.crmDemoMode = true` enables the demo banner and sandbox telemetry.
- **Verification Criterion:** 2FA authentication succeeds, HttpOnly cookie is set, and zero console errors.

### Gate G6: DNS Cutover & Production Sealing
- **Owner Action:**
  1. Route custom domain `iinsha.com` / `inshatech.com` to Cloudflare Pages production deployment.
  2. Verify SSL/TLS edge certificate issuance.
  3. Tag the verified commit:
     ```bash
     git tag -a v1720-production-sealed -m "IINSHA AI-BOS V1720 Production Sealed"
     git push origin v1720-production-sealed
     ```
- **Verification Criterion:** Canonical custom domain serves production release with valid edge TLS.
