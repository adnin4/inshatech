# 05-database-inventory.md — Database Inventory & RLS Coverage

- **Engine:** PostgreSQL 17.6.1 (Supabase `inshatech-db`)
- **Total Tables:** 28 Core Tables (21 SQL Migrations)
- **RLS Enabled:** 28 / 28 Tables (100% Policy Enforcement)
- **Plan Subquery Caching:** Active on all `((SELECT auth.uid()) = user_id)` filters.
- **DDL Guard:** `ensure_rls` automated trigger blocks naked table creation.
