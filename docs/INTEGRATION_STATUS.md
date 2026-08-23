# 🔌 IINSHA AI-BOS: INTEGRATION_STATUS.md (Phase 17 - Live Integration Status)

## External Provider Ground-Truth Ledger
| External Provider | Purpose & Rail | Actual Evidence State | Notes & Requirements |
| :--- | :--- | :---: | :--- |
| **Cloudflare Pages** | Edge CDN & Serverless Functions | **LIVE_VERIFIED** | Active on `https://inshatech.pages.dev` with Anycast routing. |
| **Supabase PostgreSQL**| Multi-Tenant Database & RLS | **LIVE_VERIFIED** | PostgreSQL 17.6.1 active with DDL event triggers. |
| **Gemini AI Edge** | Solution Finder & Proposal AI | **LIVE_VERIFIED** | Cloudflare Edge Function bridge connected to Gemini API. |
| **bKash PGW (Tokenized)**| Mobile Financial Service Rail | **SANDBOX_VERIFIED**| bKash Sandbox PGW with OAuth grant & `mode: "0011"` tested. |
| **Stripe Card Rail** | Global Credit/Debit Checkout | **SANDBOX_VERIFIED**| Stripe Test Keys configured; Server-authoritative checkout tested. |
| **AWS SNS IPN Webhook** | bKash Async Payment Webhook | **TEST_VERIFIED** | x509 cert validation & timing-safe HMAC tested in E2E harness. |
| **n8n Automation Engine** | Enterprise Workflow Hub | **CODE_VERIFIED** | Docker cluster blueprints and webhook receivers ready. |
| **Meta WhatsApp API** | 24/7 E-Commerce Sales Bot | **NOT_CONFIGURED** | Requires production Meta App Access Token & Phone Number ID. |
| **Twilio Voice SIP** | Gemini WebRTC AI Receptionist | **NOT_CONFIGURED** | Requires production Twilio Account SID & Auth Token. |
| **Resend / SMTP Email** | Transactional Mail Dispatch | **NOT_CONFIGURED** | Requires live production SMTP credentials. |
