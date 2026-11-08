# 02_SECRETS_AUDIT.md — Phase 19 Secrets & Credential Audit

| Secret Name | Scope | Location | Audit Result | Security Status |
| :--- | :--- | :--- | :---: | :---: |
| `SUPABASE_URL` | Public | Client & Server | Present & Valid | **CONFIGURED** |
| `SUPABASE_ANON_KEY` | Public (RLS bounded) | Client & Server | Present & Valid | **CONFIGURED** |
| `SUPABASE_SERVICE_ROLE_KEY` | Private (SuperAdmin) | Edge Functions only | 0 Leaks in `src/` | **CONFIGURED** |
| `STRIPE_SECRET_KEY` | Private | Edge Functions only | Sandbox Key Present | **SANDBOX_VERIFIED** |
| `BKASH_APP_KEY` | Private | Edge Functions only | Sandbox Key Present | **SANDBOX_VERIFIED** |
| `GEMINI_API_KEY` | Private | Edge Functions only | Present & Active | **LIVE_VERIFIED** |
