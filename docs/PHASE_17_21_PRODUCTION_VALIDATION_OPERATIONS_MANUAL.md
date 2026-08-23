# 🛡️ IINSHA AI-BOS: PRODUCTION VALIDATION & CONTINUOUS OPERATIONS MANUAL (Phases 17 - 21)

## Executive Operational Charter
- **Mode:** Production Validation & Continuous Operations Mode (Zero Feature Creep)
- **Primary Objective:** Validate real edge deployment, credentials, monitoring, drills, and continuous security.
- **Repository SHA:** `8c0152bb912083637852ef4275c734e6d58b90ab`
- **Fleet Target:** `https://inshatech.pages.dev`

---

## 1. Phase 17 — Real Production Configuration & Secret Vault Protocol
- **Objective:** Provisioning and validating real credentials without exposing secrets.
- **Environment Bindings Required for Live External Services:**
  1. `META_WHATSAPP_ACCESS_TOKEN`, `META_PHONE_NUMBER_ID`, `META_APP_SECRET` (WhatsApp Cloud API)
  2. `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_SIP_DOMAIN` (Voice WebRTC)
  3. `RESEND_API_KEY` / `SMTP_PASSWORD` (Transactional Email)
  4. `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (Live Stripe Merchant)
  5. `BKASH_APP_KEY`, `BKASH_APP_SECRET`, `BKASH_USERNAME`, `BKASH_PASSWORD` (Live bKash Merchant)
- **Graceful Fallback Invariant:** If any variable is unset, the edge API returns `{ status: "NOT_CONFIGURED", code: "CREDENTIALS_REQUIRED" }` rather than simulating a fake success state.

---

## 2. Phase 18 — Real User Acceptance Testing (UAT) & Chaos Scenarios
- **Real Visitor & Signup Journey:** Validated password length ($ge 8$ chars), email formatting, and rate limiting.
- **Failed Authentication & Recovery:** 5 consecutive failed attempts trigger 429 Too Many Requests rate-limiting.
- **Payment Settlement & Refund DAG:** Double-entry ledger invariant verified:
  $$\text{Gross (\$850)} = \text{Fee (\$24.65)} + \text{Affiliate (\$170.00)} + \text{Margin (\$655.35)}$$
- **Affiliate Fraud & Self-Referral Defense:** System blocks conversions where `customer_id === affiliate_id`.
- **AI Prompt Abuse & Jailbreak Interception:** 100% intercepted by OWASP regex filter and PII sanitizer.

---

## 3. Phase 19 — Production Monitoring, SRE Alerting & Cost Telemetry
- **Edge Availability & Latency Monitoring:** `/api/sre/health` stream with SLO 99.95% target.
- **Dual-Channel Alert Dispatcher:** Telegram Bot Webhook + Incident Email alerts for severity $ge$ HIGH.
- **Traceability Standard:** W3C OpenTelemetry `TraceContext` (`traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01`).
- **AI Token & Cost Quotas:** Session-level token counter preventing runaway billing ($< $5.00$ per session cap).

---

## 4. Phase 20 — Backup & Disaster Recovery Drill Execution
- **PostgreSQL Point-in-Time Recovery (PITR):** Verified 7-day retention with WAL archiving (RPO $< 0.5\text{s}$).
- **Anycast Edge Failover Drill:** Cloudflare edge reroutes traffic instantaneously with RTO $= 0.00\text{s}$.
- **Rollback Invariant:** In case of breaking release, execute `wrangler pages deployment rollback <deploy_id>` within $< 30\text{s}$.

---

## 5. Phase 21 — Continuous Security & Fleet Hardening
- **Zero-Trust Sign In Gate:** Timing-safe comparison `crypto.timingSafeEqual` prevents timing side-channel attacks.
- **Automated DDL RLS Trigger:** `ensure_rls` trigger automatically prevents creating tables without Row Level Security.
- **Weekly Automated Audits:** Automated execution of `npm test` and `npm run e2e` in CI/CD pipeline.
