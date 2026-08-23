# 🏛️ IINSHA AI-BOS — 10-LAYER PRODUCTION ARCHITECTURE AUDIT

**Audited Git SHA:** `8c0152b`  
**Target Repository:** `github.com/adnin4/inshatech` (Private, `master`)  
**Deployment Platform:** Cloudflare Pages Anycast Global Edge (`https://inshatech.pages.dev`)  
**Database Host:** Supabase PostgreSQL 17.6.1 (`inshatech-db`, `ap-southeast-1`)

---

## 1. 10-LAYER ENTERPRISE ARCHITECTURE TOPOLOGY

```text
┌─────────────────────────────────────────────────────────────┐
│                      IINSHA AI-BOS                          │
├─────────────────────────────────────────────────────────────┤
│  1. EXPERIENCE PLANE: index, store, marketplace, portal    │
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

## 2. CANONICAL SYSTEM INVARIANTS
1. **Authoritative FX:** `$1.00 USD = ৳122.50 BDT` locked across all catalog systems.
2. **Double-Entry Balance Invariant:** `Gross Revenue == Gateway Fee + Affiliate Commission + AI Cost + Net Margin`.
3. **Idempotency Rule:** All webhook and payment mutations require unique `idempotency_key` (Duplicate events return `DUPLICATE_IGNORED`).
4. **Zero-Trust Tool Boundary:** Level 4 tools (`drop_database`, `export_secrets`) permanently blocked with HTTP 403.
5. **No Blind Rewrites:** Stability > Features | Real Proof > Claims | Backward Compatibility > Rewrite.
