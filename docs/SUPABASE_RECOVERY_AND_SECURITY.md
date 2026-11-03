# Supabase Database Recovery & Security Audit Protocol

**Target Project:** `kitwadizsvjmuxkfewxj` (`inshatech-db`)  
**Region:** `ap-southeast-1`  
**Engine:** PostgreSQL 17  
**Current State:** `INACTIVE` (Paused due to inactivity)

---

## 1. Owner Recovery Path & Boundaries

1. **Dashboard Restore Operation**:
   - Navigate to [Supabase Project Dashboard](https://supabase.com/dashboard/project/kitwadizsvjmuxkfewxj).
   - Click **"Restore / Unpause Project"**.
   - Under Supabase's official policy, paused projects maintain a restore window with data and configuration intact.
2. **Prohibited Actions**:
   - Never create a duplicate temporary project to fake a green report.
   - Never execute destructive `DROP TABLE` or cascading drops.
   - Never use `SUPABASE_RUNTIME_HEALTH = "HEALTHY"` as an environment variable to bypass live probe checks.

---

## 2. Server-Side Health Verification Protocol

Once unpaused, the live probe in `functions/_shared/database_probe.js` executes:
```javascript
const probe = await probeDatabaseHealth(env);
// Returns: ACTIVE_HEALTHY | INACTIVE | UNAVAILABLE | TIMEOUT | AUTHENTICATION_FAILED | IDENTITY_MISMATCH
```
Criteria for `ACTIVE_HEALTHY`:
- Authenticated HTTP GET to `${SUPABASE_URL}/rest/v1/` succeeds with HTTP 200/206.
- Observed project ref matches canonical `kitwadizsvjmuxkfewxj`.
- Query response time within 3000ms.

---

## 3. Post-Recovery Schema & RLS Audit Checklist

Once database access is restored, run the following verification queries before opening public traffic:
1. **RLS Policy Audit**:
   ```sql
   SELECT schemaname, tablename, rowsecurity
   FROM pg_tables
   WHERE schemaname = 'public';
   -- Every single tenant table MUST return rowsecurity = true
   ```
2. **Exposed Grants Audit**:
   ```sql
   SELECT grantee, table_schema, table_name, privilege_type
   FROM information_schema.role_table_grants
   WHERE grantee IN ('anon', 'authenticated') AND table_schema = 'public';
   -- Ensure anon role has NO insert/update/delete permissions on administrative tables
   ```
3. **Multi-Tenant Isolation Positive & Negative Verification**:
   - Execute `scripts/test_tenant_rls_isolation.mjs`.
   - Assert Tenant A cannot read Tenant B records under any circumstances.
