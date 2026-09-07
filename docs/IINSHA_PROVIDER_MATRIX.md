# 🏛️ IINSHA AI-BOS: PROVIDER CAPABILITY & REAL-WORLD EVIDENCE MATRIX

* **Date:** 2026-09-07
* **Standard:** Real Execution Proof Only | Fail-Closed Fallback

---

| Provider | Capability | Environment | Credentials Configured? | Connectivity | Adapter | Runtime Output | Cryptographic Evidence | Production Verification Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Gemini AI** | Model Inference (Flash/Pro) | Production | Dynamic (`GEMINI_API_KEY`) | PASS | `ai/chat.js` | Model Response / Fallback | SHA-256 Signature | 🟢 **ACTIVE_CONNECTED** |
| **Supabase** | CRM & Mission Persistence | Production | `kitwadizsvjmuxkfewxj` | Inactive | `crm_adapter.js` | `NOT_CONFIGURED` | Fail-Closed Boundary | 🟡 **FAIL_CLOSED_READY** |
| **Lemon Squeezy** | Store 458722 Checkout | Production | Store 458722 | Live Endpoint | `checkout.js` | Hosted Checkout URL | Store ID Verification | 🟢 **ACTIVE_CONNECTED** |
| **Stripe** | Credit/Debit Card Rail | Production | Dynamic (`STRIPE_SECRET_KEY`) | Config Dependent | `checkout.js` | Session / Config Required | Signature Verification | 🟡 **FAIL_CLOSED_READY** |
| **bKash / Nagad** | Bangladesh Mobile Banking | Production | Manual / Merchant (`01629286887`) | Live Direct | `checkout.js` | TrxID Settlement | Reference Tracking | 🟢 **ACTIVE_CONNECTED** |
| **Telegram Bot** | Real-Time Lead Alerts | Production | Dynamic (`TELEGRAM_BOT_TOKEN`) | Config Dependent | `notification_dispatcher.js` | `NOT_CONFIGURED` | Provider Receipt Required | 🟡 **FAIL_CLOSED_READY** |
| **Resend** | Transactional Emails | Production | Dynamic (`RESEND_API_KEY`) | Config Dependent | `notification_dispatcher.js` | `NOT_CONFIGURED` | Provider Receipt Required | 🟡 **FAIL_CLOSED_READY** |
| **Cloudflare Pages**| Edge Static & Functions | Production | `inshatech.pages.dev` | Live Edge | `version.js` | Dynamic SHA / Headers | Git SHA Parity | 🟢 **ACTIVE_CONNECTED** |

---
**GOVERNANCE SEAL: NO SYNTHETIC SUCCESS ALLOWED ACROSS ANY PROVIDER INTEGRATION.**
