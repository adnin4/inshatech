# 🗄️ IINSHA AI-BOS — CURRENT DATABASE & SCHEMA MAP

**Database Engine:** PostgreSQL 17.6.1 (Supabase `inshatech-db`)  
**Security Advisor Status:** 0 Lint Findings (100% Clean)  
**Total Migrations:** 16 structured migration files in `supabase/migrations/`

---

## CORE DOMAIN ENTITY TABLES

| Table Name | Primary Key | Key Foreign Keys | RLS Status |
| :--- | :--- | :--- | :--- |
| `ibos_organizations` | `id (UUID)` | — | **ENABLED (75 Policies)** |
| `ibos_users` | `id (UUID)` | `org_id` | **ENABLED** |
| `ibos_customer_contacts` | `id (UUID)` | `org_id` | **ENABLED** |
| `ibos_leads` | `id (UUID)` | `campaign_id` | **ENABLED** |
| `ibos_orders` | `id (UUID)` | `user_id`, `service_id` | **ENABLED** |
| `ibos_revenue` | `id (UUID)` | `order_id` | **ENABLED** |
| `ibos_commission_ledger` | `id (UUID)` | `affiliate_id`, `conversion_id` | **ENABLED** |
| `ibos_projects` | `id (UUID)` | `order_id` | **ENABLED** |
| `ibos_project_tasks` | `id (UUID)` | `project_id` | **ENABLED** |
| `ibos_support_tickets` | `id (UUID)` | `customer_id`, `project_id` | **ENABLED** |
| `ibos_agent_runs` | `id (UUID)` | `mission_id` | **ENABLED** |
| `ibos_tool_calls` | `id (UUID)` | `run_id` | **ENABLED** |
| `ibos_audit_logs` | `id (UUID)` | `user_id` | **ENABLED** |
| `ibos_incidents` | `id (UUID)` | — | **ENABLED** |
