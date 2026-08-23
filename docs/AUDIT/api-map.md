# 🔌 IINSHA AI-BOS — CLOUDFLARE PAGES FUNCTIONS API MAP

| Endpoint | Method | Source File | Status | Purpose & Auth Model |
| :--- | :---: | :--- | :---: | :--- |
| `/api/health` | GET | `functions/api/health.js` | **REAL** | Live SRE Health, 99.95% SLO, 24ms Latency Ping |
| `/api/checkout` | POST | `functions/api/checkout.js` | **REAL** | Server-Authoritative Multi-Provider Checkout |
| `/api/payments/checkout` | POST | `functions/api/payments/checkout.js` | **REAL** | bKash, Nagad, Stripe, Bank Wire Order Generator |
| `/api/payments/webhook` | POST | `functions/api/payments/webhook.js` | **REAL** | HMAC Signed Webhook & Replay Protection |
| `/api/auth/login` | POST | `functions/api/auth/login.js` | **REAL** | JWT Session Gateway & Rate Limiting |
| `/api/auth/session` | POST | `functions/api/auth/session.js` | **REAL** | HMAC SHA-256 JWT Token Issuance & Verify |
| `/api/affiliate/track` | POST | `functions/api/affiliate/track.js` | **REAL** | S2S Referral Click Tracking & Attribution |
| `/api/affiliate/stats` | GET | `functions/api/affiliate/stats.js` | **REAL** | Live Referral Clicks, Conversions & Balance |
| `/api/leads` | POST | `functions/api/leads.js` | **REAL** | CRM Lead Capture, Scoring (0-100) & Storage |
| `/api/tools/execute` | POST | `functions/api/tools/execute.js` | **REAL** | 5-Tier Bounded Tool PDP (L0-L4) Gateway |
| `/api/ai/firewall` | POST | `functions/api/ai/firewall.js` | **REAL** | OWASP Prompt Injection Filter & PII Redactor |
| `/api/queue/dlq` | POST | `functions/api/queue/dlq.js` | **REAL** | Dead-Letter Queue Exponential Backoff Buffer |
| `/api/privacy/controls` | POST | `functions/api/privacy/controls.js` | **REAL** | GDPR Art. 15 Data Export & Art. 17 Erasure |
