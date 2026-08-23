# 📋 IINSHA AI-BOS: FEATURE_INVENTORY.md (Phase 2 - Feature Inventory)

| Feature Name | Location | Frontend | Backend | Database | API | Auth Req | Authz Req | Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Public Landing Page** | `index.html` | ✅ Yes | N/A | N/A | N/A | No | No | **VERIFIED_WORKING** |
| **Hero 3D Animation** | `index.html` | ✅ Yes | N/A | N/A | N/A | No | No | **VERIFIED_WORKING** |
| **AI Solution Finder** | `index.html` | ✅ Yes | ✅ Edge | N/A | `/api/solution-finder` | No | No | **VERIFIED_WORKING** |
| **Universal AI Copilot** | `public/universal_ai_copilot.js`| ✅ Yes | ✅ Edge | N/A | `/api/ai/chat` | No | No | **VERIFIED_WORKING** |
| **Dual-Currency Switcher**| `js/core/enterprise_experience.js`| ✅ Yes | N/A | N/A | N/A | No | No | **VERIFIED_WORKING** |
| **Service Storefront** | `store.html` | ✅ Yes | ✅ Edge | ✅ Postgres | `/api/create-checkout` | No | No | **VERIFIED_WORKING** |
| **Stripe Card Checkout** | `functions/api/create-checkout.js`| ✅ Yes | ✅ Edge | ✅ Postgres | `/api/create-checkout` | No | No | **SANDBOX_VERIFIED** |
| **Stripe Webhook HMAC** | `functions/api/stripe-webhook.js` | N/A | ✅ Edge | ✅ Postgres | `/api/stripe-webhook` | Yes | Secret | **VERIFIED_WORKING** |
| **bKash Tokenized PGW** | `functions/api/payments/bkash-tokenized.js`| ✅ Yes | ✅ Edge | ✅ Postgres | `/api/payments/bkash-tokenized`| No | No | **SANDBOX_VERIFIED** |
| **AWS SNS IPN Webhook** | `functions/api/webhook/bkash-sns-ipn.js`| N/A | ✅ Edge | ✅ Postgres | `/api/webhook/bkash-sns-ipn`| Yes | Secret | **VERIFIED_WORKING** |
| **Customer Portal** | `portal.html` | ✅ Yes | ✅ Edge | ✅ Postgres | `/api/auth/session` | Yes | Customer | **VERIFIED_WORKING** |
| **Project Milestone DAG**| `portal.html` | ✅ Yes | ✅ Edge | ✅ Postgres | `/api/portal/projects`| Yes | Customer | **VERIFIED_WORKING** |
| **Sovereign Admin Panel** | `admin.html` | ✅ Yes | ✅ Edge | ✅ Postgres | `/api/admin/gate` | Yes | SuperAdmin | **VERIFIED_WORKING** |
| **Swarm Kill-Switch** | `admin.html` | ✅ Yes | ✅ Edge | ✅ Postgres | `/api/ai/tool-broker` | Yes | SuperAdmin | **VERIFIED_WORKING** |
| **Affiliate 2.0 Tracking**| `src/js/affiliate.js` | ✅ Yes | ✅ Edge | ✅ Postgres | `/api/affiliate/*` | No | No | **VERIFIED_WORKING** |
| **SRE Telemetry Health** | `functions/api/sre/health.js` | ✅ Yes | ✅ Edge | N/A | `/api/sre/health` | No | No | **VERIFIED_WORKING** |
| **GDPR Cookie Banner** | `src/js/cookie-consent.js` | ✅ Yes | N/A | N/A | N/A | No | No | **VERIFIED_WORKING** |
| **Live WhatsApp Bot** | Live Meta WhatsApp Cloud API | ✅ UI | ⚠️ Edge | N/A | External API | No | No | **NOT_CONFIGURED** |
| **Production Twilio Voice**| Live Twilio SIP Trunking | ✅ UI | ⚠️ Edge | N/A | External API | No | No | **NOT_CONFIGURED** |
