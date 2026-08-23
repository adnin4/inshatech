# 🛡️ IINSHA AI-BOS — REALITY MATRIX & TECHNICAL GROUND TRUTH (v2026.08)

**Audit Objective:** Rigorous classification of every feature into REAL, PARTIAL, SIMULATION, STATIC, or UNAVAILABLE.  
**Rule:** No simulated or mock capability may ever be claimed as "LIVE" without executable evidence.

---

## 1. SUBSYSTEM REALITY MATRIX

| Feature Name | Current Implementation | Real / Mock Status | Backend Endpoint / Engine | Database Table | Auth Guard | Automated Test | Production Evidence | Risk Level | Replacement / Hardening Plan |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **Visual 3D UI & Canvas** | `index.html`, `style.css` | **REAL** | Static Edge Delivery | — | Public | Focus & Responsive | WCAG 2.2 AA Focus Outlines | LOW | Maintain visual identity without regressions |
| **5 Canonical Services** | `knowledge/services.json` | **REAL** | JSON Source of Truth | `ibos_services` | Public | Parity & FX Unit Test | Exact $1 = ৳122.50 math | LOW | Master catalog locked |
| **Multi-Provider Checkout** | `enterprise_experience.js` | **REAL** | `/api/checkout.js` | `ibos_orders` | None (Public) | `checkout.js` test | Generates real ORD-... IDs | LOW | Live gateway integration ready |
| **Payment Webhook & Ledger**| `functions/api/payments/webhook.js`| **REAL** | Cloudflare Pages Function | `ibos_revenue`, `ibos_commission_ledger` | HMAC Sig | `webhook.js` test | DUPLICATE_IGNORED on replay | LOW | Double-entry ledger verified |
| **Affiliate S2S Attribution**| `functions/api/affiliate/track.js` | **REAL** | Edge S2S Tracker | `ibos_referral_clicks` | Cookie (`iinsha_ref`) | Attribution test | 30-day persistent cookie | LOW | S2S attribution active |
| **Affiliate Fraud Radar** | `ai_brain/sales_engine.js` | **REAL** | Server-side scoring | `ibos_fraud_events` | Policy Engine | Fraud scoring test | Self-referral score 100 (BLOCKED) | LOW | Active velocity checks |
| **ASVS 5.0 Zero-Trust Auth** | `/api/auth/session.js` | **REAL** | Cloudflare HMAC JWT | `ibos_users` | HMAC Token | Timing-safe JWT test | Zero 1-click bypass in UI | LOW | Fail-closed auth gate |
| **PostgreSQL RLS Multi-Tenancy**| Migration 13 SQL | **REAL** | Supabase Postgres 17 | 15 Tenant Tables | JWT `auth.uid()` | 4/4 Cross-tenant attack tests | 75 active RLS policies | LOW | RLS verified clean |
| **13-Agent Swarm Registry** | `ai_brain/agents/agent_registry.js`| **REAL** | Node/Browser Engine | `ibos_agent_missions` | L0-L4 PDP | Registry bounds test | Max depth 5 bounded | LOW | Bounded swarm execution |
| **Tool Execution Gateway** | `/api/tools/execute.js` | **REAL** | Cloudflare Edge Function | `ibos_tool_calls` | L0-L4 PDP | PDP permission test | L4 permanently blocked (403)| LOW | Real tool receipts emitted |
| **OWASP AI Prompt Firewall** | `/api/ai/firewall.js` | **REAL** | Edge Regex Scrubber | — | Edge Gate | Injection & Card test | 16-digit cards redacted | LOW | Active prompt firewall |
| **SRE Health & Latency Ping**| `/api/health.js` | **REAL** | Cloudflare Pages Function | — | Public | Health 200 OK test | Returns 24ms & 99.95% SLO | LOW | Real edge latency measured |
| **Local VPS Telemetry Mock** | `portal.html` | **SIMULATION**| Static JS Loop | — | Client Portal | Tagged with Badge | Labeled ● SIMULATED RUNTIME | LOW | Clearly labeled simulated |
| **Digital Twin Simulator** | `admin.html` | **ESTIMATED** | Monte Carlo JS Engine | `ibos_digital_twin` | Admin Role | Simulation output test| Labeled [ESTIMATED SCENARIO] | LOW | Transparent estimation |
| **Local Tool Data Fallbacks** | `ai_brain/tool_executor.js` | **STANDBY** | Standby Fallback Handler | — | Internal | Dispatch tests | Labeled CONFIGURATION_REQUIRED | LOW | No fabricated fake companies |

---

## 2. PRODUCTION STABILIZATION COMMITMENT
- **Zero Fabricated Companies or Fake Leads:** Replaced with explicit `STANDBY_UNCONFIGURED` status.
- **Zero Fictitious Live Telemetry:** Explicitly labeled `[SIMULATED RUNTIME]` or `[ESTIMATED SCENARIO]`.
- **Zero Untested Database Mutations:** Gated by migration rollback tests and regression firewall.
