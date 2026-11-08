# 🏢 IINSHA AI-BOS — Domain Architecture Map (Baseline v1.0)

**Record Date**: 2026-08-19  
**System State**: 21 Domain Separation Blueprint  

---

## 🧩 21 Business Domains & Responsibilities

```text
domains/
├── 1. identity         -> Authentication, MFA, WebAuthn, Sessions, Device Tokens
├── 2. organizations    -> Multi-Tenancy, Tenants, Workspaces, Teams, Settings
├── 3. customers        -> Customer Profiles, Customer 360, Activity Timeline, LTV
├── 4. crm              -> Leads, Qualification Scoring, 12-Stage Pipeline Kanban
├── 5. catalog          -> Turnkey Services, Micro-Services, Packages, Blueprints
├── 6. pricing          -> Server-Calculated Price Lookup, Currency Engine ($1 = ৳122.50)
├── 7. quotes           -> Instant Proposals, ROI Calculation, Price Negotiations
├── 8. orders           -> Order State Machine, Idempotent Order Creation, SLAs
├── 9. billing          -> Stripe, bKash, Nagad, Wise, Bank Wire, Webhook Ingestion
├── 10. ledger          -> Double-Entry Accounting, Net Profit Calculation, Audit
├── 11. projects        -> Project DAGs, Task Allocation, Milestones, Handover
├── 12. support         -> Support Tickets, SLA Monitoring, Automated Diagnostic
├── 13. affiliate       -> Partner Registry, Multi-Touch Attribution, Payout Desk
├── 14. marketplace     -> Agent Registry, Workflow Downloads, Reviews, Licensing
├── 15. ai              -> Multi-Turn Copilot 4.0, 7 Agent Modes, RAG Knowledge
├── 16. agents          -> 13-Agent Autonomous Swarm Mesh, Role Contracts, Budget
├── 17. missions        -> Mission Planner, DAG Orchestrator, HITL Approvals
├── 18. analytics       -> Real Telemetry, Traffic Attribution, Conversion EPC
├── 19. notifications   -> Omnichannel Alerts (Telegram, WhatsApp, Email, Toast)
├── 20. security        -> 7-Level Autonomy, Secret Broker, Prompt Sanitizer, DLQ
└── 21. content         -> CMS Engine, Engineering Blog, Markdown Docs, Meta Tags
```

---

## 🏛️ Domain Boundary Rule
1. Frontend components interact with domains **strictly via Edge API endpoints**.
2. Domains maintain independent schema definitions in `supabase/migrations/`.
3. Inter-domain data mutation enforces double-entry audit logging in `ibos_audit_logs`.
