# IINSHA Production Baseline Audit

Date: 2026-08-20
Canonical repository: `adnin4/inshatech`
Canonical production branch: `master`
Safety branch: `safety/baseline-audit-2026-08-20`
Production URL: `https://inshatech.pages.dev`

## Purpose

This document freezes the current baseline before any functional refactor. The safety rule is: **evidence first, targeted fix second, feature expansion last**.

## Verified repository state

- The repository is private and the default branch is `master`.
- Baseline commit at audit start: `8c0152bb912083637852ef4275c734e6d58b90ab`.
- Safety branch was created from that exact commit.
- `master` and the safety branch are identical at baseline.
- Production deployment workflow targets `master` and deploys the repository root to Cloudflare Pages project `inshatech`.
- Deployment workflow generates build metadata and runs a live SHA parity verification after deployment.
- CI contains syntax validation, multiple repository audit scripts, E2E/security checks, RLS isolation tests, disaster-recovery drill, sector evidence generation, build metadata verification, and migration-count validation.

## Important findings

### 1. Release proof must be treated as a gate

The repository contains strong CI/deployment assertions, but a claim in a workflow file is not itself proof that the latest canonical SHA passed in GitHub Actions. A release is considered certified only when a successful workflow run is attached to the exact release SHA.

### 2. Deployment parity is already designed

`deploy.yml` generates build metadata, deploys to Cloudflare Pages, then calls `scripts/verify-live-parity.mjs`. This is the correct direction and should be preserved rather than replaced with a new deployment architecture.

### 3. CI has many certification scripts

The current CI invokes a large number of certification scripts. These must be validated for real assertions rather than judged by their names or printed success messages. Future work must inspect each script's exit conditions and evidence outputs before increasing the claimed coverage.

### 4. Quality guard is currently brittle

The quality guard checks exact implementation strings such as `document.body.appendChild(modal)` and specific Wrangler configuration text. These are useful regression sentinels but should not become the sole proof of correctness. Future hardening should add behavior-level tests without removing working guards.

### 5. No mass rewrite

Do not replace the current frontend, agent architecture, Supabase schema, Cloudflare deployment architecture, or payment system wholesale. Any change must be justified by a specific failing test, security finding, data-integrity issue, or measured UX/performance regression.

## Release gates

A production release must satisfy all of the following:

1. Canonical SHA is known.
2. GitHub Actions has a successful run for that exact SHA.
3. Build metadata contains the exact SHA.
4. Cloudflare deployment points to that SHA.
5. Live parity check passes.
6. No P0 security/data/payment/authorization issue is open.
7. Critical browser E2E paths pass.
8. Database/RLS tests pass.
9. Payment webhook idempotency tests pass.
10. Agent tool authorization tests pass.
11. No UI claims a capability as LIVE without backend evidence.
12. Rollback target is known and deployable.

## Change protocol

For every code change:

`current behavior -> root cause -> smallest safe fix -> automated test -> regression test -> deployment verification`

No speculative architecture expansion is allowed during the baseline-hardening phase.
