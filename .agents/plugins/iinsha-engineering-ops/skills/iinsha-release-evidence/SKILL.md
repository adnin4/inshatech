---
name: iinsha-release-evidence
description: Use when preparing a release readiness report, production certification, handoff, evidence ledger, or go/no-go decision for IINSHA.
---
# IINSHA Release Evidence Ledger

## Required classifications
`PASS`, `FAIL`, `BLOCKED_EXTERNAL`, `NOT_VERIFIED`, `EXPECTED_SECURITY_DENIAL`, `DEFERRED`.

## Evidence categories
1. Source: local HEAD, clean/dirty worktree, repository remote, canonical branch, candidate ancestry.
2. GitHub: current PR head/base/state, latest workflow run on the exact candidate SHA, every mandatory job and skipped reason.
3. Build: reproducible lockfile install, commands, exit codes, build artifacts and checksums.
4. Cloudflare: Pages project, production branch, deployment ID/SHA, environment, runtime `/api/version` and health endpoints.
5. Database: canonical project ref, active status, PostgreSQL version, backup status, migration head and actual schema/RLS parity.
6. Authentication: authenticated owner session, MFA enrollment, admin gate and authorization results.
7. Browser: real screenshots, six viewports, route/interaction tests, console/network logs.
8. Recovery: backup verification, restore rehearsal where possible, rollback deployment and post-deploy smoke test.

## Rules
- Never substitute a prior CI pass for the exact candidate SHA.
- Never classify a staging pass as production pass.
- A liveness 200 does not imply readiness; a readiness 503 is a blocker if the app requires the DB.
- Anonymous admin-gate 401/403 may be EXPECTED_SECURITY_DENIAL; configuration-error 503 is not authenticated health success.
- Include the captured timestamp, source, full SHA, exact endpoint and payload classification.
- Do not expose secret values, personal customer records, raw auth tokens or payment data.

## Final verdict
Production SEALED requires all required evidence and owner commissioning. Any required external blocker means NOT_SEALED. Do not change production merely to improve the report.
