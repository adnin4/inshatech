# IINSHA AI-BOS — Release Authority Current State

Date: 2026-09-10

## Current ceiling

`READY_FOR_STAGING`

## Canonical source

- Repository: `adnin4/inshatech`
- Branch: `master`
- Current observed master before PR #67 merge: `45ee4c1f90f699686c71912a7f22598cbe3b0a74`
- Production URL: `https://inshatech.pages.dev`
- Canonical Supabase project ref: `kitwadizsvjmuxkfewxj`

## Current release work

PR #67: `fix(release): fail closed on missing release and database identity evidence`

Current branch head at handoff: `e1870ea8a807deff26fe77fae4bf97b4a66a76e1`

This branch:
- requires independently supplied release identity fields;
- rejects short SHA values for release authority;
- rejects non-canonical branch identity;
- prevents `/api/version` from self-verifying release identity from deployment SHA alone;
- requires independently supplied database identity and explicit healthy status before reporting `LIVE_VERIFIED`;
- converts stale production evidence files to evidence-bound source/test state.

## Gate 0 diagnostic finding

The first current PR #67 diagnostics failure was caused by evidence-directory lifecycle: the workflow created `ci-failure-evidence/` before `actions/checkout`, and checkout cleaned the workspace. As a result, capture and upload steps could not create files; `npm ci` itself completed successfully.

The workflow was corrected so checkout happens first and evidence storage is initialized afterward.

Latest diagnostics run after that correction: CI Evidence Diagnostics completed successfully.

## External truth boundary

A green GitHub workflow does not by itself certify Cloudflare production, Supabase production, payment provider execution, real customer delivery, finance reconciliation, or autonomous operation.

## Cloudflare

PR previews are successfully deploying through Cloudflare Pages Git integration. Production project/repository/branch/deployment/runtime parity still requires independent control-plane evidence.

A single production deployment authority must be selected. Do not operate Cloudflare Git production deployment and GitHub Actions + Wrangler as competing production authorities without an explicit, verified design.

## Supabase

Live control-plane refresh is unavailable in the current session. Runtime project identity, migration head, RLS/policy/grant state, function privileges, and live health remain `UNVERIFIED` until directly observed.

## Payments

Payment contracts, replay, concurrency, webhook hardening and reconciliation suites are source/test evidence. Live provider certification is still absent.

## Required next sequence

1. Verify the successful Gate 0 run artifact is retrievable.
2. Repeat the diagnostics run to detect transport flakiness.
3. Add regression coverage for `/api/version` requiring verified DB identity for `LIVE_VERIFIED`.
4. Merge PR #67 only after its actual required checks are green.
5. Resolve Cloudflare production deployment authority (Issue #68).
6. Rationalize duplicate/legacy workflows; preserve coverage while removing ambiguous control paths.
7. Define unique required GitHub checks, then enable branch protection/rulesets.
8. Verify Cloudflare production source/branch/deployment/runtime/API/browser parity.
9. Verify Supabase live project/migration/RLS/functions/advisors/tenant isolation.
10. Proceed to commerce, finance, agent control, mission kernel, project factory, QA, SRE/DR, Golden E2E, real pilot, revenue, and autonomy.
