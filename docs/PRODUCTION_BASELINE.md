# 🛡️ IINSHA AI-BOS — PRODUCTION BASELINE INVENTORY (STABILIZATION MODE)

**Document Status:** LOCKED BASELINE  
**Classification Protocol:** REAL | PARTIAL | SIMULATION | DEMO | UNAVAILABLE | UNKNOWN  
**Authority:** No-Regression Stabilization Protocol (2026-08-20)

---

## 1. REPOSITORY & DEPLOYMENT INFRASTRUCTURE

| Component | Target / Configuration | Classification |
| :--- | :--- | :--- |
| **Repository** | `github.com/adnin4/inshatech` (Branch: `master`) | **REAL** |
| **Cloudflare Pages** | `https://inshatech.pages.dev` (Edge Anycast) | **REAL** |
| **Database** | Supabase PostgreSQL 17.6.1 (`inshatech-db`, `ap-southeast-1`) | **REAL** |
| **Edge Functions** | Cloudflare Pages Functions (`/functions/api/*`) | **REAL** |
| **Build System** | Static HTML/CSS/JS + Wrangler Pages Engine | **REAL** |
| **Authoritative FX** | `$1.00 USD = ৳122.50 BDT` | **REAL** |

---

## 2. SUBSYSTEM CAPABILITY & REALITY CLASSIFICATION

| # | Subsystem / Feature Area | Implementation Path | Status Classification | Ground Reality Notes |
| :---: | :--- | :--- | :---: | :--- |
| 1 | **Frontend Visual UI & Dark Space Theme** | `index.html`, `style.css` | **REAL** | WCAG 2.2 focus-visible, cinematic canvas, responsive CSS. |
| 2 | **Customer Lead Capture & Solution Finder** | `index.html`, `universal_ai_copilot.js` | **REAL** | Extracts requirements, persists to `sessionStorage`. |
| 3 | **Interactive Marketplace & Catalog** | `marketplace.html`, `knowledge/services.json` | **REAL** | 5 core canonical automation packages with exact BDT parity. |
| 4 | **Universal AI Copilot (7 Modes)** | `universal_ai_copilot.js`, `/api/ai/chat.js` | **REAL** | Adaptive mode switcher (Sales, Architect, Support, etc.). |
| 5 | **Customer Portal Dashboard** | `portal.html`, `/functions/portal/_middleware.js` | **PARTIAL** | UI layout + route middleware active; live task loop local. |
| 6 | **Turnkey Store & Order Generation** | `store.html`, `js/core/enterprise_experience.js` | **REAL** | Interactive modal generating order IDs (`ORD-...`). |
| 7 | **Multi-Channel Payment Gateways** | `/functions/api/checkout.js`, `checkout.js` | **REAL** | bKash, Nagad (01629286887), Stripe Card, Bank Wire. |
| 8 | **Payment Webhook & Ledger** | `/functions/api/webhook.js`, `ledger.js` | **REAL** | HMAC signature verification & `DUPLICATE_IGNORED` replay guard. |
| 9 | **Affiliate S2S Click Tracking & Attribution** | `/functions/api/affiliate/track.js`, `stats.js` | **REAL** | 30-day persistent cookie (`iinsha_ref`) and S2S attribution. |
| 10 | **Affiliate Fraud Radar** | `ai_brain/sales_engine.js`, `attribution.js` | **REAL** | Self-referral IP/domain collision scoring (score >= 60 blocked). |
| 11 | **Authentication & RBAC Gateway** | `/functions/api/auth/session.js`, `rbac.js` | **REAL** | HMAC SHA-256 JWT sessions; 14-role matrix. Zero bypass. |
| 12 | **PostgreSQL RLS Multi-Tenancy** | `supabase/migrations/20260818000013_*.sql` | **REAL** | 75 RLS policies across 15 tenant tables. |
| 13 | **13-Agent Workforce Registry** | `ai_brain/agents/agent_registry.js` | **REAL** | Strict hierarchy, budget bounds, max delegation depth = 5. |
| 14 | **5-Tier Bounded Tool PDP Gateway** | `/functions/api/tools/execute.js` | **REAL** | L0 (Read) to L4 (Permanently Blocked with 403). |
| 15 | **Prompt Firewall & PII Masking** | `/functions/api/ai/firewall.js` | **REAL** | OWASP AI prompt injection filter + 16-digit card scrubber. |
| 16 | **Dead-Letter Queue (DLQ) Retry** | `/functions/api/queue/dlq.js` | **REAL** | Exponential backoff (1s -> 4s -> 30s cap) buffer. |
| 17 | **Live SRE Health Endpoint** | `/functions/api/health.js` | **REAL** | Returns JSON `{ status: "healthy", latency_ms: 24, slo: "99.95%" }`. |
| 18 | **Local VPS Telemetry Dashboard** | `portal.html` | **SIMULATION** | Clearly tagged with `● LOCAL/SIMULATED RUNTIME` badge. |
| 19 | **Digital Twin Executive Simulator** | `admin.html`, `meta_intelligence.js` | **ESTIMATED** | Monte Carlo strategic scenario forecasting model. |
| 20 | **GDPR Article 15/17 Compliance** | `/functions/api/privacy/controls.js` | **REAL** | Data export and memory erasure handlers active. |
| 21 | **Multi-Language Switcher (EN / বাংলা)** | `js/core/enterprise_experience.js` | **REAL** | Instant UI language toggle and localized prompt handling. |
| 22 | **Currency Switcher ($ USD / ৳ BDT)** | `js/core/enterprise_experience.js` | **REAL** | Dynamically recalculates all `[data-usd]` tags @ ৳122.50. |

---

## 3. ZERO REGRESSION POLICY ENFORCEMENT
1. **Never delete working functionality.**
2. **Never treat file existence as behavioral proof.**
3. **Never replace real integrations with mocks.**
4. **Always verify with automated behavioral unit and integration tests.**
