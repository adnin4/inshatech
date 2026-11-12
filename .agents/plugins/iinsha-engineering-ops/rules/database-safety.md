---
name: iinsha-database-safety
description: Enforce safe Supabase/PostgreSQL inspection, migration, backup, and RLS practices in IINSHA.
globs: supabase/**, **/*.sql, **/*database*, **/*supabase*, wrangler.toml
---
# Database Safety

- Read `skills/iinsha-supabase-safe-ops/SKILL.md` before database work.
- Start read-only and verify the target project is active and owner-confirmed.
- Never execute migration or write SQL against a project based on an old report.
- Backups must be verified and restorable before destructive operations.
- Check remote migration history and schema separately.
- Every exposed table needs appropriate RLS and grants; test cross-tenant denial.
