# 👑 IINSHA AI-BOS — GOLDEN BASELINE & FREEZE MANIFEST (v2026.08)

**Canonical Git SHA:** `8c0152bb912083637852ef4275c734e6d58b90ab`  
**Target Repository:** `github.com/adnin4/inshatech` (Private, `master`)  
**Production Authority:** Cloudflare Pages Anycast Global Edge (`https://inshatech.pages.dev`)  
**Database Host:** Supabase PostgreSQL 17.6.1 (`inshatech-db`, `ap-southeast-1`)  
**Security Advisor:** 0 Security Lint Findings (100% Clean)  
**Performance Advisor:** Monitored Unused Indexes (No destructive drops without query logs)

---

## 1. 10-PLANE STABILIZED SYSTEM TOPOLOGY

```text
┌─────────────────────────────────────────────────────────────┐
│                      IINSHA AI-BOS                          │
├─────────────────────────────────────────────────────────────┤
│  1. EXPERIENCE PLANE: index, store, marketplace, portal     │
│  2. OWNER CONTROL PLANE: Cockpit, Kill Switch, Approvals   │
│  3. BUSINESS DOMAIN: CRM, Orders, Commerce, Fulfillment     │
│  4. AGENT CONTROL PLANE: Planner, Risk Engine, Policy Check │
│  5. POLICY & PDP GATEWAY: ASVS 5.0, RBAC, Prompt Firewall  │
│  6. TOOL GATEWAY: Bounded PDP (L0-L4), Receipts & MCP      │
│  7. EVIDENCE & AUDIT PLANE: Receipts, Trace Logs, Ledgers   │
│  8. OBSERVABILITY PLANE: W3C OpenTelemetry, SLO Telemetry  │
│  9. DATA PLANE: Supabase Postgres 17 + 75 RLS Policies     │
│ 10. EDGE EXECUTION: Cloudflare Pages Serverless Functions  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. CANONICAL AI RUNTIME SINGLE SOURCE OF TRUTH
- **Primary Serverless Shared Runtime:** `functions/_shared/ai_brain/`
- **Development & Client Bridge:** `ai_brain/`
- **Rule:** Both runtimes are byte-for-byte synchronized with identical deterministic agent contracts, bounded tools, and L0-L4 permission matrices.

---

## 3. MASTER NO-DOWNGRADE EXECUTION GATE
```text
BEFORE CHANGE -> Automated Tests -> Small Safe Diff -> Automated Tests -> COMPARE ->
  IF SCORE_NEW < SCORE_PREV -> AUTOMATIC BUILD BLOCK (Exit Code 1)
  IF PASS -> Certified & Locked
```
