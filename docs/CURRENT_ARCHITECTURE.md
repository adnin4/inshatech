# 🏛️ IINSHA AI-BOS — CURRENT ARCHITECTURE (READ-ONLY AUDIT)

**Audited Git SHA:** `8c0152b`  
**Target Repository:** `github.com/adnin4/inshatech` (private, `master`)  
**Production Host:** Cloudflare Pages Anycast Edge (`https://inshatech.pages.dev`)  
**Database Host:** Supabase PostgreSQL 17.6.1 (`inshatech-db`, `ap-southeast-1`)

---

## 1. 9-PLANE SYSTEM ARCHITECTURE TOPOLOGY

```text
┌─────────────────────────────────────────────────────────────┐
│                      IINSHA AI-BOS                          │
├─────────────────────────────────────────────────────────────┤
│  1. EXPERIENCE LAYER: index, store, marketplace, portal     │
│  2. BUSINESS ENGINE: CRM, Checkout, Orders, Ledgers, Aff.  │
│  3. AI AGENT CONTROL PLANE: 13-Agent Swarm Registry (L0-L4) │
│  4. DOMAIN SERVICES: Fulfillment, Projects, SLA, Tickets    │
│  5. POLICY & PDP GATEWAY: RBAC, ABAC, Prompt Firewall, MFA │
│  6. TOOL GATEWAY: Bounded Tool Execution & MCP Connectors   │
│  7. DATA TIER: Supabase Postgres + 75 RLS Tenant Policies   │
│  8. OBSERVABILITY: W3C OpenTelemetry, TraceID, Latency Pings│
│  9. OWNER COMMAND CENTER: Kill-Switch, Approvals, Analytics │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. CANONICAL SYSTEM INVARIANTS
1. **Authoritative FX:** `$1.00 USD = ৳122.50 BDT` across all systems.
2. **Double-Entry Balance Invariant:** `Gross Revenue == Gateway Fee + Affiliate Commission + AI Cost + Net Margin`.
3. **Idempotency Rule:** All webhook and payment mutations require unique `idempotency_key` (Duplicate events return `DUPLICATE_IGNORED`).
4. **Zero-Trust Tool Boundary:** Level 4 tools (`drop_database`, `export_secrets`) permanently blocked with HTTP 403.
