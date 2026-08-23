# 🗄️ IINSHA AI-BOS: Database Gap & Schema Normalization Report

## 1. Master Database Domain Map
- **Identity & RBAC:** `public.accounts`, `public.account_memberships`, `public.profiles`, `public.has_role_on_account()`.
- **Commerce & Price Lock:** `public.price_catalog`, `public.ibos_orders`, `public.ibos_invoices`, `public.ibos_ledger`, `public.ibos_revenue`.
- **Idempotent Webhooks:** `public.ibos_webhook_events` (Unique constraint on `event_id`, `DUPLICATE_IGNORED` handler).
- **Projects & Deliverables:** `public.projects`, `public.account_project_summaries` (`WITH (security_invoker = true)`).

## 2. Performance & Query Plan Caching
All RLS policies encapsulate authentication functions in subqueries:
```sql
((SELECT auth.uid()) = user_id)
```
This eliminates $O(N)$ row-evaluation overhead and enables Postgres execution plan caching.
