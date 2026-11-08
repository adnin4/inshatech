# 🔌 IINSHA AI-BOS — CLOUDFLARE PAGES EDGE FUNCTIONS API MAP

| Endpoint | Method | Path Location | Purpose |
| :--- | :---: | :--- | :--- |
| `/api/health` | GET | `functions/api/health.js` | Live SRE Health, 99.95% SLO, & Latency Ping |
| `/api/checkout` | POST | `functions/api/checkout.js` | Multi-Provider Server-Authoritative Checkout |
| `/api/payments/checkout` | POST | `functions/api/payments/checkout.js` | bKash, Nagad, Stripe, Bank Wire Order Generator |
| `/api/payments/webhook` | POST | `functions/api/payments/webhook.js` | HMAC Signed Webhook Handler & Replay Defense |
| `/api/auth/login` | POST | `functions/api/auth/login.js` | Full-Stack JWT OAuth & Session Login Handler |
| `/api/auth/session` | POST | `functions/api/auth/session.js` | ASVS 5.0 HMAC SHA-256 JWT Issuance & Token Verify |
| `/api/affiliate/track` | POST | `functions/api/affiliate/track.js` | Server-Side S2S Referral Click Tracking |
| `/api/affiliate/stats` | GET | `functions/api/affiliate/stats.js` | Real-time Clicks, Conversions, & Balance API |
| `/api/leads` | POST | `functions/api/leads.js` | CRM Lead Capture, Scoring (0-100), & Validation |
| `/api/tools/execute` | POST | `functions/api/tools/execute.js` | 5-Tier Bounded Tool PDP Gateway |
| `/api/ai/firewall` | POST | `functions/api/ai/firewall.js` | OWASP AI Prompt Injection Filter & PII Redactor |
| `/api/queue/dlq` | POST | `functions/api/queue/dlq.js` | Dead-Letter Queue Exponential Backoff (1s-30s) |
| `/api/soc/telemetry` | GET | `functions/api/soc/telemetry.js` | OpenTelemetry Threat Level & Query Latencies |
| `/api/privacy/controls` | POST | `functions/api/privacy/controls.js` | GDPR Art. 15 Export & Art. 17 Erasure Engine |
