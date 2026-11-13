---
name: iinsha-supabase-safe-ops
description: Use for every IINSHA Supabase/PostgreSQL task, including project identity, paused/inactive recovery, schema inspection, migrations, RLS, auth, storage, performance, or connection failures.
---
# IINSHA Supabase Safe Operations

## First establish authority
Inspect repository env/config, Cloudflare bindings, Supabase account project list, project status, region, API URL, and migration history. Historical refs seen in project reports include `kitwadizsvjmuxkfewxj`, `iuhtzahuszdkdarhxobx`, and `uulqaslcfjrvkvyegmvo`. Never assume those are interchangeable. The previously observed `kitwadizsvjmuxkfewxj` project was INACTIVE.

## Default mode
- Use the bundled `supabase-readonly` MCP only with an owner-confirmed canonical project ref.
- Keep `read_only=true` and the project scoped.
- Do not request all-account access for routine debugging.
- If project status is inactive, read-only probes fail, or migration listing times out, report the failure and stop database writes.

## Before any mutation
Require explicit owner approval and a verified, restorable backup. Read all migration files and current remote migration history. Compare migration history and live schema separately. Check extensions, schemas, constraints, indexes, triggers, functions, grants, RLS, storage policies, and Edge Functions. Understand the blast radius and rollback approach.

Never use remote `db reset`, destructive repair, `migration repair`, or `db push` to make the migration list appear green. Do not mark a migration as applied unless its SQL effects are independently verified.

## Security checks
- Enable RLS on every exposed table and create policies matching the actual access model.
- Never use user-editable `user_metadata` for authorization decisions.
- Keep service-role and secret keys server-side.
- Test with two different authenticated tenants: cross-tenant SELECT, INSERT, UPDATE, DELETE, RPC, and Storage access must be denied.
- Validate security-definer functions, search_path, grants and ownership.
- Require a real authenticated read-only DB probe for health. Static variables or project-ref equality are not database health.

## Completion evidence
Return active project status, owner-confirmed ref, database version, exact migration counts/diffs, schema parity, RLS test outcomes, query latency, and backup/restore evidence. Never include raw secrets or unnecessary customer data.
