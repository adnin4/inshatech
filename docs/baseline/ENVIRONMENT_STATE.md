# 🔐 ENVIRONMENT_STATE.md — Secret & Environment Variable Inventory

| Key Name | Scope | Role | Guard |
| :--- | :--- | :--- | :---: |
| `SUPABASE_URL` | Public | Database REST API Gateway | Anonymous read |
| `SUPABASE_ANON_KEY` | Public | Client token with RLS | RLS Enforced |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Only | Server database bypass | Zero client exposure |
| `JWT_SECRET` | Edge Only | Admin session HMAC token | Timing-safe checked |
| `MFA_SECRET` | Edge Only | Owner step-up authentication | Zero client exposure |
| `STRIPE_SECRET_KEY` | Edge Only | Payment Intent & Webhook | Sandbox Verified |
| `BKASH_APP_KEY` | Edge Only | bKash Tokenized Checkout | Sandbox Verified |
| `GEMINI_API_KEY` | Edge Only | Google GenAI Flash Inference | Edge binding only |
