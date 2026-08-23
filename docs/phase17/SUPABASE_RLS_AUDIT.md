# 🛡️ SUPABASE_RLS_AUDIT.md — Phase 17 RLS Audit

## Table Protection & Query Plan Optimization
- **Policy Style:** Subquery encapsulation: `((SELECT auth.uid()) = user_id)` to allow execution plan caching.
- **View Security:** `WITH (security_invoker = true)` on all analytical views.
- **Table Audit Results:**
  - `public.accounts`: MakerKit multi-tenant isolation (PASS)
  - `public.account_memberships`: Own membership isolation (PASS)
  - `public.ibos_orders`: Customer user boundary (PASS)
  - `public.ibos_ledger`: Stored procedure restricted mutation (PASS)
