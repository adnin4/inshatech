# 👑 IINSHA AI-BOS: SOVEREIGN MASTER ARCHITECTURAL & OPERATING SPECIFICATION

---

## 🏛️ 1. EXECUTIVE SUMMARY & SYSTEM OVERVIEW

**IINSHA AI-BOS** (`inshatech.pages.dev`) is an enterprise-grade, autonomous AI Business Operating System. It unifies:
1. **Dynamic Service Registry & Marketplace CMS:** Single source-of-truth Postgres/Supabase database.
2. **Affiliate Attribution & Fraud-Defense Engine:** 60-day cookie window, subID tracking, IP/device collision fraud radar.
3. **Multi-Agent AI Workforce (13 Agents):** Orchestrated under CEO Commander with 5-Level Tool Gateway and OWASP GenAI safeguards.
4. **Dual-Rail Global & Local Payment Infrastructure:** Lemon Squeezy (MoR Visa/Mastercard/Apple Pay) + Stripe Checkout + bKash / Nagad / City Bank PLC.
5. **Zero-Trust Security & Row-Level Security (RLS):** Every table guarded by Postgres RLS; 0 plaintext secrets in repo.
6. **Edge CDN Performance:** Cloudflare Pages with edge function routing (`_routes.json`) and sub-second global caching.

```text
================================================================================
                           IINSHA AI-BOS ARCHITECTURE
================================================================================
                                 [CLIENT]
                                    │
                    ┌───────────────┴───────────────┐
                    │     Cloudflare Edge CDN       │
                    │   (inshatech.pages.dev)       │
                    └───────────────┬───────────────┘
                                    │
     ┌──────────────────────────────┼──────────────────────────────┐
     │                              │                              │
[Dynamic Pages]             [Cloudflare Functions]          [AI Copilot 2.0]
• / (Home)                  • /api/payments/*               • 7 Specialized Modes
• /store                    • /api/affiliate/*              • Customer Memory
• /marketplace              • /api/admin/*                  • RAG Retrieval (pgvector)
• /portal                   • /api/tools/execute            • Banglish/EN Support
• /affiliate                • /api/ai/chat                  • 5-Level Tool Gateway
     │                              │                              │
     └──────────────────────────────┼──────────────────────────────┘
                                    │
     ┌──────────────────────────────┴──────────────────────────────┐
     │                 Supabase PostgreSQL (RLS)                    │
     │  • ibos_services            • ibos_orders                   │
     │  • ibos_affiliates          • ibos_revenue                  │
     │  • ibos_referral_clicks     • ibos_projects                 │
     │  • ibos_conversions         • ibos_audit_logs               │
     └─────────────────────────────────────────────────────────────┘
```

---

## 📊 2. SIX-PHASE IMPLEMENTATION AUDIT & STATUS

| Phase | Core Objective | Repository Assets | Real-World Status |
| :--- | :--- | :--- | :---: |
| **Phase 1: Audit & Hardening** | P0 Token Purge, Password Hashing, RLS Enforcement | `supabase_schema.sql`, `scripts/real_world_security_gate.mjs` | 🟢 **PASS (0 Leaks)** |
| **Phase 2: Dynamic CMS** | Unified Service Catalog, Admin CRUD, Real-Time Sync | `knowledge/services.json`, `functions/api/admin/*` | 🟢 **PASS** |
| **Phase 3: Affiliate Engine** | 60-Day Cookies, SubID, IP Collision Fraud Radar | `functions/api/affiliate/*`, `affiliate.html` | 🟢 **PASS** |
| **Phase 4: Payment Gateway** | Lemon Squeezy (Store 458722), Stripe, bKash, SSL | `functions/api/payments/*`, `app.js` | 🟢 **PASS (Surface & Logic)** |
| **Phase 5: Multi-Agent AI** | 13 Agents, Intent Pipeline, 5-Level Tool Gateway | `ai_brain/agents/*`, `ai_brain/tool_registry.js` | 🟢 **PASS** |
| **Phase 6: CI/CD & Operations**| Cloudflare Deployments, Clean Archive, Telemetry | `deploy_to_cloudflare_pages.py`, `_routes.json` | 🟢 **PASS** |

---

## 🔒 3. SECURITY & COMPLIANCE SEAL

* **Zero-Leak Guarantee:** `.env` is strictly excluded from all packaging and version control. Only `.env.example` template is archived.
* **OWASP GenAI Defenses:**
  * `LLM01 (Prompt Injection):` Input character limits, HTML sanitization, strict system prompt lock.
  * `LLM02 (Insecure Output):` Deterministic JSON schema validation.
  * `LLM08 (Excessive Autonomy):` 5-Level Tool Gateway (Level 3 requires owner approval, Level 4 restricted).
* **Payment Compliance:** Hosted Merchant-of-Record (Lemon Squeezy / Stripe) eliminates PCI-DSS compliance scope on the client side.

---

## 🏆 4. MASTER PRODUCTION ASSETS

* **Master Desktop Archive:** `C:\Users\mahin khan\OneDrive\Desktop\New folder\insha zip all documentes 1.zip`
* **Clean Cloudflare Bundle:** `cloudflare_pages_dist.zip` (370 Clean Files)
* **Founder WhatsApp Command:** `+8801629286887`
* **Lead Engineer:** Adnin Sadat Mahin (`adnansadatmahin4@gmail.com`)
