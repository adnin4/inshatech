# 09_ENVIRONMENT_MATRIX.md — Environment Variable Fingerprints

| Variable Name | Environment Scope | Exposure Guard |
| :--- | :--- | :--- |
| `SUPABASE_URL` | Production / Preview | Publicly Accessible |
| `SUPABASE_ANON_KEY` | Production / Preview | Publicly Accessible (RLS Enforced) |
| `SUPABASE_SERVICE_ROLE_KEY`| Production Edge Only | Zero Client Leaks Verified |
| `STRIPE_SECRET_KEY` | Production Edge Only | Sandbox Mode Configured |
| `BKASH_APP_KEY` | Production Edge Only | Sandbox Mode Configured |
| `GEMINI_API_KEY` | Production Edge Only | Serverless Binding Only |
