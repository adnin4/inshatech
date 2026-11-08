# 🔐 CONFIGURATION_MATRIX.md — Production Configuration Validation

| Component | Variable Name | Required | Status | Security Guard |
| :--- | :--- | :---: | :---: | :--- |
| **Supabase** | `SUPABASE_URL` | YES | **PRESENT** | Publicly accessible |
| **Supabase** | `SUPABASE_ANON_KEY` | YES | **PRESENT** | Client-safe, RLS bounded |
| **Supabase** | `SUPABASE_SERVICE_ROLE_KEY`| YES (Edge only)| **PRESENT** | Never exposed to client |
| **AI Engine** | `GEMINI_API_KEY` | YES (Edge only)| **PRESENT** | Serverless function binding |
| **Stripe** | `STRIPE_PUBLISHABLE_KEY` | YES | **PRESENT (TEST)** | Client-safe |
| **Stripe** | `STRIPE_SECRET_KEY` | YES | **PRESENT (TEST)** | Edge function only |
| **Stripe** | `STRIPE_WEBHOOK_SECRET` | YES | **PRESENT (TEST)** | Edge function only |
| **bKash** | `BKASH_APP_KEY` | YES | **PRESENT (TEST)** | Edge function only |
| **bKash** | `BKASH_APP_SECRET` | YES | **PRESENT (TEST)** | Edge function only |
| **WhatsApp** | `META_WHATSAPP_ACCESS_TOKEN`| OPTIONAL | **NOT_REQUIRED** | Disabled until pilot expansion |
| **Twilio** | `TWILIO_ACCOUNT_SID` | OPTIONAL | **NOT_REQUIRED** | Disabled until pilot expansion |
| **Email** | `RESEND_API_KEY` | OPTIONAL | **NOT_REQUIRED** | Internal queued fallback active |
| **Observability**| `SENTRY_DSN` | OPTIONAL | **NOT_REQUIRED** | Edge health logging active |
