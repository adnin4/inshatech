# IINSHA AI-BOS — OPEN PRODUCTION BLOCKERS & RUNTIME DEPENDENCIES

**Audit date:** 2026-09-07  
**Readiness:** `READY_FOR_STAGING`

## BLOCKER-01 — Cloudflare live deployment evidence (Issue #49)
**Severity:** P0 for production certification

The Cloudflare Pages build path fix (`functions` relative imports + `nodejs_compat` in `wrangler.toml`) has been proven working via PR #48 preview deployment (`dfef0d5` -> `Deploy successful`). However, the production deployment SHA on canonical domain `https://inshatech.pages.dev` and live edge SHA parity against master `99344cf` remain to be independently certified from the Cloudflare edge.

**Required:** confirm the Cloudflare project production build completion and live `/api/version` SHA parity for commit `99344cfe4a671e5059be86e5e76978a9c3fe8548`.

## BLOCKER-02 — GitHub Branch Protection Governance
**Severity:** P1 for release management

The `master` branch on GitHub currently lacks branch protection rules and required status checks.

**Required:** configure branch protection on `master` requiring PR reviews and passing CI workflows before merging.

## BLOCKER-03 — Browser-level deployed E2E
**Severity:** P1

Repository and static DOM E2E is verified (12/12 public surfaces clean), but actual live browser interaction against the deployed customer edge surface remains to be exercised.

**Required:** exercise navigation, AI Solution Finder, chat, auth/portal flows, critical forms and checkout handoff against the live deployed build.

## BLOCKER-04 — Provider execution receipts
**Severity:** P1

Payment, notification, CRM and other external actions cannot be labeled `LIVE_VERIFIED` from adapters, generated IDs, or source-level tests alone.

**Required:** provider acceptance, signature/webhook verification, idempotency/replay controls and durable reconciliation evidence.

## Verified now

- Supabase project `kitwadizsvjmuxkfewxj`: `ACTIVE_HEALTHY`.
- Supabase security advisor: 0 lints.
- Public PostgreSQL tables: 110; RLS enabled on 110/110.
- Current canonical `master` and `main` baseline: `99344cfe4a671e5059be86e5e76978a9c3fe8548`.
- Zero UI/UX regressions; all 22 sections, 3D Hero, and glassmorphic designs 100% frozen.
- All automated CI and security gates pass 100%.

Production certification remains gated solely on live edge deployment verification.