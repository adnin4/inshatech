# IINSHA Engineering Operations — Always-On Rules

These rules apply whenever this plugin is active in the IINSHA workspace.

## Truth and evidence
- Live observations override all historical reports. Timestamp every external observation.
- Distinguish local, GitHub, staging, and production state. Never infer one from another.
- Use exact 40-character Git SHAs. CI success only certifies the exact SHA and event that actually ran.
- Never describe an unrun/skipped/blocked test as PASS. Record skipped jobs with reasons.
- Use only: `PASS`, `FAIL`, `BLOCKED_EXTERNAL`, `NOT_VERIFIED`, `EXPECTED_SECURITY_DENIAL`, `DEFERRED`.
- Do not claim `PRODUCTION_SEALED` while any required external gate is unresolved.

## Change safety
- Start with `git status --short`, branch, HEAD, remotes, and recent history.
- Never reset, force-push, clean untracked files, rewrite history, delete user work, or switch branches without inspection and approval.
- Preserve existing features, contracts, IDs, routes, package actions, service catalogue, forms, payment flows, and accessibility semantics.
- Prefer the smallest root-cause fix with a regression test. Do not create duplicate systems or duplicate migrations.
- Do not commit generated credentials, `.env` files, tokens, service-role keys, JWT secrets, or MFA secrets.

## Database safety
- Treat the canonical Supabase project ref as unknown until verified against owner intent, environment config, and active control-plane state.
- The previously observed `kitwadizsvjmuxkfewxj` project was INACTIVE. Never assume it is available or production-safe.
- Start with project-scoped read-only access. Never use `read_only=false` for discovery.
- Never run `db reset`, `db push`, migration repair, destructive DDL/DML, restore, or project pause/resume without owner approval and a verified backup.
- Migration history is not the schema. Compare both before changes.
- Test RLS with at least two distinct tenants and explicit negative cases.
- Never infer database health from a static environment variable or matching project IDs. Require a real authenticated read-only probe.

## Cloudflare and release safety
- Inspect Pages production branch, deployment authority, build output, environment bindings, secrets status, Durable Object bindings, and rollback target before proposing a release.
- Keep Cloudflare account-control MCP disabled until account permissions are reviewed.
- Never deploy production, change DNS, alter secrets, mutate Durable Objects, or delete resources just to make a status green.
- Preserve the legacy site until the replacement is verified and owner cutover is approved.

## Security and commerce
- All privileged actions require server-side authorization. Never trust client roles, localStorage, client-provided amounts, or UI-only gates.
- Never fabricate payment success, refunds, ledger entries, provider webhooks, customer records, AI executions, or service health.
- Live payments require sandbox tests, signature verification, replay protection, idempotency, and reconciliation evidence.
- MCP tools stay in Ask/approval mode. Never configure wildcard auto-approval for all MCP tools.

## Completion discipline
- Reproduce every reported defect, record file/line/root cause, fix it, add regression coverage, and rerun focused plus full relevant tests.
- Inspect the actual package scripts before running commands. Respect the package manager and lockfile.
- Do not stop after writing a plan or passing a build. Verify runtime and browser interactions separately.
- Final report must include changes, exact commands/results, failures, skipped tests, evidence references, and owner blockers.
