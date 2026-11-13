# IINSHA TECH — SUPABASE RECOVERY & MIGRATION RUNBOOK (V1000)
**Project Ref:** `kitwadizsvjmuxkfewxj`  
**Project Name:** `inshatech-db`  
**Region:** `ap-southeast-1` (Singapore)  
**Current Status:** `INACTIVE` (`BLOCKED_EXTERNAL`)  
**Document Purpose:** Owner instructions for safely unpausing, restoring, and applying migrations without data loss or false-green declarations.

---

## 1. Current State Truth

- The Supabase project `kitwadizsvjmuxkfewxj` is in an `INACTIVE` state on the Supabase cloud platform due to platform inactivity limits.
- Remote API listing and remote migration checks return connection timeouts or empty tables from this environment.
- In accordance with the **Zero False-Green Policy**, all remote database queries and live RLS tests against this instance are classified as `BLOCKED_EXTERNAL`.
- The application currently fails-soft: all public catalog views, static pricing tiers, and client-side calculators remain operational using local caching.

---

## 2. Restore Eligibility (Supabase Documentation Policy)

Current official Supabase policy:
- Free tier projects that enter the paused state remain restorable from the project dashboard for **up to 1 year** from the pause date (updating the older 90-day assumption).
- Pro/Team projects remain restorable indefinitely with Point-in-Time Recovery (PITR) options.

---

## 3. Step-by-Step Owner Recovery Procedure

1. **Log in to Supabase Studio:**
   - Visit: [https://supabase.com/dashboard/project/kitwadizsvjmuxkfewxj](https://supabase.com/dashboard/project/kitwadizsvjmuxkfewxj)
2. **Unpause / Restore Project:**
   - In the project status banner, click **"Restore Project"** or **"Unpause Project"**.
   - Wait 2–5 minutes while Supabase provisions the compute and attaches the storage volume.
3. **Verify Database Connectivity:**
   - In Supabase Studio, check **Table Editor** to confirm existing tables (`ibos_orders`, `ibos_services`, `ibos_profiles`, `ibos_referral_clicks`) are intact.
4. **Take an Immediate Backup:**
   - In Supabase Studio > **Database** > **Backups**, generate a fresh manual backup before applying any schema updates.
5. **Verify Migrations Locally Before Production:**
   - Run the local migration validation suite:
     ```bash
     node scripts/test_tenant_rls.mjs
     ```
6. **Apply Schema Migrations (Only After Backup):**
   - Execute the forward-only migration pipeline from your authorized local terminal:
     ```bash
     npx supabase db push
     ```
7. **Verify Row Level Security (RLS):**
   - Confirm RLS is enabled on all tables:
     ```sql
     SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
     ```
   - Ensure both `USING` and `WITH CHECK` clauses are defined for `UPDATE` operations.
