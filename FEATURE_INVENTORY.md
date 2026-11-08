# 📋 IINSHA AI-BOS: FEATURE_INVENTORY.md

| Feature Name | Location | Working Status | Dependencies | Security Concerns | Recommended Action |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **Landing Hero 3D** | `index.html` | ✅ Working | WebGL / Three.js | None (Runs in sandbox) | Keep as-is |
| **AI Solution Finder** | `index.html` / `functions/api/solution-finder.js` | ✅ Working | Gemini Edge API | Input sanitization enforced | Keep & Monitor |
| **Universal AI Copilot**| `public/universal_ai_copilot.js` | ✅ Working | Session Storage | Prompt injection firewall active | Keep & Maintain |
| **Service Storefront** | `store.html` | ✅ Working | Server Catalog | Price tampering prevented | Keep as-is |
| **Multi-Provider Checkout**| `store.html` / `functions/api/create-checkout.js` | ✅ Working | Stripe / bKash | Server price validation locked | Keep & Maintain |
| **bKash Tokenized PGW** | `functions/api/payments/bkash-tokenized.js` | ✅ Working | bKash Sandbox PGW | Secret token isolation enforced | Keep & Monitor |
| **AWS SNS IPN Webhook** | `functions/api/webhook/bkash-sns-ipn.js` | ✅ Working | AWS SNS / x509 Cert | Timing-safe HMAC & Idempotency | Keep & Maintain |
| **Digital Marketplace** | `marketplace.html` | ✅ Working | Digital Licensing | Entitlement check required | Keep as-is |
| **Customer Portal** | `portal.html` | ✅ Working | Supabase Auth | Tenant boundary isolation | Keep & Maintain |
| **Sovereign Admin Cockpit**| `admin.html` | ✅ Working | MFA Session Gate | Session revocation active | Keep & Maintain |
| **Swarm Kill-Switch** | `admin.html` / `functions/api/ai/tool-broker.js` | ✅ Working | PDP Tool Broker | Emergency stop verified | Keep & Maintain |
| **Affiliate 2.0 Network**| `affiliate.html` / `src/js/affiliate.js` | ✅ Working | 30-Day TTL Cookie | Anti-fraud velocity radar | Keep & Maintain |
| **SRE Telemetry Live Modal**| `index.html` / `functions/api/sre/health.js` | ✅ Working | Edge Telemetry | Truthful latency metric | Keep as-is |
| **GDPR Cookie Consent** | `src/js/cookie-consent.js` | ✅ Working | Local Storage | GDPR Art. 15/17 compliance | Keep as-is |
