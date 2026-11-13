# IINSHA AI-BOS — V1600 SUPABASE RECOVERY & MIGRATION REPORT
**Generated At:** 2026-11-13T16:06:00+06:00 (Asia/Dhaka)  
**Configured Target:** Supabase Project `kitwadizsvjmuxkfewxj` (`inshatech-db`, region: `ap-southeast-1`)  
**Status:** `INACTIVE_AWAITING_OWNER_RESUME` | `PROBE_FAILS_CLOSED_HTTP_503` (Gate G3)

---

## 1. Current Supabase State & Telemetry

* **Canonical Project Ref:** `kitwadizsvjmuxkfewxj`
* **Project Name:** `inshatech-db`
* **PostgreSQL Version:** 17.6.1.155
* **Observed State in Supabase Console:** `INACTIVE` (Paused on Free Tier)
* **Probe Response:** `/api/health?type=readiness` returns HTTP 503 `DATABASE_UNAVAILABLE` / `INACTIVE`
* **Zero False-Green Law:** The system refuses to declare database health or production readiness while the database is dormant.

---

## 2. Recovery Protocol & Runbook (Owner Action G3)

Per official Supabase documentation, paused Free Plan projects can be restored directly via the Supabase Dashboard within 1 year of dormancy:

1. **Log in to Supabase Dashboard:**
   Navigate to [https://supabase.com/dashboard/project/kitwadizsvjmuxkfewxj](https://supabase.com/dashboard/project/kitwadizsvjmuxkfewxj).
2. **Resume Project:**
   Click **"Resume Project"** or **"Restore"** on the project overview banner. The instance will provision PostgreSQL 17 compute and re-attach storage within 2–5 minutes.
3. **Verify Connection & Secrets:**
   Obtain the latest API keys (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`) from **Settings -> API**.
4. **Inspect Migration Parity:**
   Once resumed, verify that local migrations in `supabase/migrations/` match remote applied migrations.
5. **Alternative Project Configuration:**
   If the owner elects to switch canonical identity to the active project `iuhtzahuszdkdarhxobx`, update:
   - `wrangler.toml` (`SUPABASE_URL` and `SUPABASE_RUNTIME_PROJECT_REF`)
   - `functions/_shared/release_manifest.js` (`canonical_db_ref = 'iuhtzahuszdkdarhxobx'`)
   - Re-deploy staging candidate to verify `db_parity: true`.

---

## 3. Database Invariants Enforced in Code

* Exact arithmetic and double-entry financial ledger invariants.
* Tenant isolation via PostgreSQL Row Level Security (RLS).
* Zero direct SQL truncation or dropping without explicit owner backup.
* Missing credentials fail closed with HTTP 503 instead of exposing mock data.
