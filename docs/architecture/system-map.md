# 🗺️ IINSHA AI-BOS — System Architecture Map (Baseline v1.0)

**Record Date**: 2026-08-19  
**System State**: FROZEN BASELINE / EXECUTION 2.0  
**Commit**: `379d9c6`  
**Deploy Target**: Cloudflare Pages Global Edge (`inshatech.pages.dev`) + Hostinger Docker VPS (`n8n` cluster) + Supabase PostgreSQL (RLS)

---

## 🏛️ Master System Topology

```text
👑 OWNER (Adnin Sadat Mahin)
  │
OWNER CONTROL PLANE ───────────────► AI EXECUTIVE LAYER
(Kill Switch, Autonomy, Budget)       (AI CEO, CTO, CFO, COO, CMO, CRO, CISO)
  │                                         │
Growth OS ────────── Revenue OS ────────── Delivery OS
(Marketing/SEO)      (Sales/Deals)         (Dev/QA/Deploy/SLA)
  │                       │                     │
  └───────────────────────┴─────────────────────┘
                          │
                  AI / AGENT GATEWAY
                          │
                 POLICY / RISK ENGINE
                          │
            TOOL GATEWAY & SECRET BROKER
                          │
            ┌─────────────┴─────────────┐
            ▼                           ▼
    Cloudflare Edge API           Queue / Workflow
    (Service Bindings)            (Durable Execution)
            │                           │
            └─────────────┬─────────────┘
                          ▼
                   DOMAIN SERVICES
      ┌────────┬────────┬────────┬────────┬────────┬─────────┐
      │ CRM    │ Orders │ Billing│Projects│ AI Lab │Affiliate│
      └────────┴────────┴────────┴────────┴────────┴─────────┘
                          │
            ┌─────────────┴─────────────┐
            ▼                           ▼
    Supabase PostgreSQL (RLS)     R2 Object Storage
    (Double-Entry Ledger)         (Assets & Evidence)
                          │
                          ▼
             OpenTelemetry Observability
             (Flight Recorder & Audit)
```

---

## 📄 10 Core Production User Surfaces

| Page | File | Size | Role / Scope |
| :--- | :--- | :---: | :--- |
| **Main Platform** | `index.html` | 151.6 KB | Homepage, Copilot 4.0, 10 Playbooks, Model Specs Modal, Dynamic Pricing |
| **Admin Cockpit** | `admin.html` | 133.5 KB | 19 Operational Tabs, 13 Swarms, Flight Recorder, Kill-Switch, CRM Kanban |
| **Affiliate Landing** | `affiliate.html` | 31.5 KB | 28-Pillar Affiliate Program pitch, Earnings Simulator, Tier Ladder |
| **Partner Login** | `affiliate-login.html` | 19.7 KB | Dedicated Sign In & 30-Second Register Gateway with 1-Click Demo Login |
| **Partner Cockpit** | `affiliate-dashboard.html` | 5.4 KB | Full Standalone Partner Workspace, AI Copywriter, Outreach CRM, Payouts |
| **Store** | `store.html` | 29.4 KB | Turnkey Solutions Catalog & Interactive Server-Authoritative Checkout |
| **Marketplace** | `marketplace.html` | 105.6 KB | AI Multi-Agent Marketplace with Filtering & Detail Modal |
| **Delivery Portal** | `portal.html` | 31.1 KB | Client Delivery Workspace, SLA Progress & Support Ticket Tracker |
| **Comparison Matrix** | `compare.html` | 28.2 KB | n8n + Swarms vs Zapier 90% Cost Savings Teardown |
| **Engineering Blog** | `blog.html` | 21.7 KB | Case Studies, Benchmark Reports & Architecture Deep Dives |

---

## 🔒 Immutability Rule
> **No feature, page, or API present in this baseline will be removed, renamed without alias, or silently degraded.**
