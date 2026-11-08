# 12-env-map.md — Environment Variable & Secret Binding Map

- **Client Safe:** `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- **Server Confidential:** `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, `MFA_SECRET`, `STRIPE_SECRET_KEY`, `BKASH_APP_KEY`, `GEMINI_API_KEY`
- **Client Leakage Scan:** **0 Plaintext Secrets in Client Bundles**
