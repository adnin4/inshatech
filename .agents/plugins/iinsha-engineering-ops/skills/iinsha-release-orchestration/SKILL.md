---
name: iinsha-release-orchestration
description: Use when coordinating a multi-step IINSHA engineering task, production recovery, V7 release audit, or work spanning GitHub, Supabase, Cloudflare, browser QA, and security.
metadata:
  author: IINSHA Engineering
  version: "1.0.0"
---
# IINSHA Release Orchestration

## Objective
Finish the real IINSHA codebase with evidence, not a simulated green report.

## Mandatory sequence
1. Read `rules/AGENTS.md` and `references/iinsha-known-state.md`.
2. Run read-only discovery first: Git status, current branch, exact HEAD, remotes, branch heads, recent commits, open PRs, latest CI for the exact candidate, staging/production version endpoints, Supabase project state and migration history.
3. Delegate independent read-only work to repository, database, Cloudflare, and security subagents.
4. Compare their evidence. Resolve contradictions; do not select a Git SHA or database project by guess.
5. Classify findings as P0/P1/P2 and PASS/FAIL/BLOCKED_EXTERNAL/NOT_VERIFIED/EXPECTED_SECURITY_DENIAL/DEFERRED.
6. Implement local, reversible fixes only after the root cause is established. Make small batches and add regression coverage.
7. Run focused tests after each fix, then the relevant full suite, build, and browser checks.
8. Keep external writes behind explicit approval: Git pushes/merges, Supabase writes/migrations, Cloudflare deploys/bindings/secrets/DNS, payment transactions, or owner MFA.
9. Continue independent work when an external gate is blocked.
10. Produce a final report with exact SHA, commands, exit codes, results, skipped jobs, changed files, evidence, and owner actions.

## V7-specific reconciliation
The prior report claimed local candidate `4081e12d81300fcd39e8b5357d2a8f9a0efe269b`; the GitHub API lookup previously returned no commit for that SHA. Treat it as unverified until found locally and compared to remotes. Historical remote master was `b3de7650b65e388514ca82674654c92241ea8811`. PR #67 was open/unmerged and PR #71 was draft/stacked on #67 in the last observed public state. Re-query all of these before decisions.

## Do not
- Recreate the project or redesign completed screens unnecessarily.
- Claim production-ready from local tests, source assertions, or a staging deployment.
- Hide failed or skipped tests.
- bypass a failing CI check, migration, security gate, or owner approval.
