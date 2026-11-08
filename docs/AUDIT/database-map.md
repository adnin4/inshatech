# 🗄️ IINSHA AI-BOS — DATABASE MAP & DOMAIN MODEL

**Database Engine:** PostgreSQL 17.6.1 (Supabase `inshatech-db`, `ap-southeast-1`)  
**Security Advisor Status:** 0 Lint Findings (100% Clean)  
**Performance Advisor:** Unused indexes safely monitored; no blind removals without query logs.

---

## CANONICAL DATABASE TABLES INVENTORY

| Domain Area | Table Name | Purpose | RLS Status |
| :--- | :--- | :--- | :---: |
| **Tenancy & Users** | `ibos_organizations` | Organization & tenant boundaries | **ENABLED** |
| | `ibos_users` | Users & RBAC role assignments | **ENABLED** |
| | `ibos_customer_contacts`| Client contact profiles & history | **ENABLED** |
| **CRM & Leads** | `ibos_leads` | Inbound qualified sales leads | **ENABLED** |
| | `ibos_campaigns` | Marketing campaigns & attribution | **ENABLED** |
| **Commerce & Money**| `ibos_orders` | Server-authoritative order records | **ENABLED** |
| | `ibos_revenue` | Financial revenue streams | **ENABLED** |
| | `ibos_commission_ledger`| Double-entry affiliate ledger | **ENABLED** |
| | `ibos_affiliate_payouts`| Payout records (L3 Owner Approval)| **ENABLED** |
| **Projects & Support**| `ibos_projects` | Client delivery project tracking | **ENABLED** |
| | `ibos_project_tasks` | Task decomposition graph (DAG) | **ENABLED** |
| | `ibos_support_tickets` | Support tickets & SLA tracking | **ENABLED** |
| **Agent OS & Tools** | `ibos_agent_missions` | Autonomous agent mission executions| **ENABLED** |
| | `ibos_mission_checkpoints`| Rollback state checkpoints | **ENABLED** |
| | `ibos_tool_calls` | Bounded tool execution receipts | **ENABLED** |
| | `ibos_kill_switch_state`| Global & per-agent pause states | **ENABLED** |
| **Observability & OTEL**| `ibos_otel_traces` | W3C distributed trace spans | **ENABLED** |
| | `ibos_audit_logs` | Immutable security & user audit logs| **ENABLED** |
| | `ibos_incidents` | SRE 4-tier incident remediation | **ENABLED** |
| | `ibos_golden_test_cases`| Benchmark & shadow evaluation sets | **ENABLED** |
