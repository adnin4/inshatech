# IINSHA AI-BOS — Next Conversation Handoff

Date: 2026-09-10

## Current truth

- Canonical repository: `adnin4/inshatech`
- Canonical branch: `master`
- Last directly observed master before release work: `45ee4c1f90f699686c71912a7f22598cbe3b0a74`
- Current production URL: `https://inshatech.pages.dev`
- Canonical Supabase ref: `kitwadizsvjmuxkfewxj`
- Current certification ceiling: `READY_FOR_STAGING`

## Gate 0

Root cause was proven: evidence storage was initialized before `actions/checkout`, and checkout removed it. The corrected workflow performs checkout first, then initializes evidence storage.

Run `34451671912` and a rerun both completed successfully. Artifacts were retrievable. The diagnostics runner reported 24 suites with 24 pass and 0 fail.

The human-readable report has a 24-versus-23 wording defect to correct.

## Release identity

GitHub pull-request workflow `GITHUB_SHA` can represent the synthetic merge ref. The evidence must separately record:

- `workflow_sha`
- `pr_head_sha`
- `checked_out_sha`
- `base_sha`
- `workflow_ref`
- `pr_ref`

Do not treat workflow merge SHA as the source release SHA unless explicitly designated.

## PR #67

Open, unmerged, non-draft, mergeable.

Current head: `1c89cbb36af767e0244e86854892e12b3d341f43`

Purpose: fail-closed release identity, independent database identity, conservative `/api/version`, stale production evidence cleanup, evidence schema.

Remaining code debt: `scripts/ci_evidence_runner.mjs` still has a developer-machine Windows GitHub Desktop fallback. Remove it before merge.

## Cloudflare

PR preview deployments are successful. Production source/deployment/runtime parity is still unverified.

Issue #68 tracks possible dual production authorities: Cloudflare Git integration and GitHub Actions + Wrangler. Select exactly one production deployment authority; preserve PR previews.

## Supabase

Live control-plane state remains unverified because the Supabase management connector was unavailable in this session. Do not infer live health, migration head, RLS, policies, grants, functions, or tenant isolation from source code alone.

## Repository security

GitHub currently reports the canonical repository as public. A current-tree scan found no direct matches for `SUPABASE_SERVICE_ROLE_KEY`, `service_role`, `CF_API_TOKEN`, `api_key`, or `.env` through GitHub code search, but that does not certify history or artifacts. Perform a history/deleted-file/workflow-artifact secret audit and rotate any credential ever exposed.

## Next order

1. Remove developer-machine fallback.
2. Separate workflow/source/check-out SHA fields.
3. Fix diagnostics count wording.
4. Re-run PR #67 checks.
5. Merge PR #67 only when evidence lineage is clean.
6. Reconcile old governance PR/documentation as needed.
7. Resolve Cloudflare deployment authority.
8. Rationalize legacy workflows and freeze canonical required checks.
9. Add GitHub ruleset/branch protection after a stable green baseline.
10. Independently certify Cloudflare production.
11. Independently certify Supabase.
12. Build commerce authority, coupon atomicity, idempotency, payment FSM, webhook/reconciliation.
13. Build immutable finance ledger.
14. Harden RLS/SECURITY DEFINER/tenant isolation.
15. Build agent control plane, mission kernel, evidence graph, memory, learning, self-healing.
16. Build project factory, independent QA, SRE/DR.
17. Run Golden E2E and real pilot.
18. Only then certify `REVENUE_OPERATIONAL`.
19. Only after controlled autonomous pilot and policy/approval/kill-switch validation certify `AUTONOMOUS_OPERATIONAL`.

## Non-negotiables

No fake PASS, customers, revenue, payment, uptime, testimonials, or certification. No browser payment/price authority. No unrestricted agent authority. No destructive DB reset. No CI bypass or weakened assertions. No production certification without independent external evidence. Preserve current UI/UX except for surgical truth/safety corrections.
