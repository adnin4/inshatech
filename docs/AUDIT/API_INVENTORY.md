# 04_API_INVENTORY.md — Edge Function Endpoints Inventory

- `/api/health` — Live SRE Health, SLO (99.95%), and Parity SHA Metadata.
- `/api/auth/session` — Timing-Safe HMAC Session Gate with Rate Limiting (5 req/min).
- `/api/admin/gate` — Admin Session Validation and Step-Up MFA Authorization.
- `/api/payments/checkout` — Server-Authoritative Price Calculation & Intent Engine.
- `/api/stripe-webhook` — Stripe Signature HMAC Verification & Idempotency Check.
- `/api/webhook/bkash-sns-ipn` — AWS SNS x509 Signature & Duplicate Rejection.
- `/api/ai/chat` — Gemini 2.0 Flash Chat Stream with Prompt Injection Interceptor.
- `/api/ai/tool-broker` — 5-Tier Bounded Tool PDP Gateway (L0 to L4).
- `/api/affiliate/track` — Server-to-Server Referral Click Attribution.
- `/api/notifications/dispatch` — Multi-Channel Notification Router (Telegram/Email).
