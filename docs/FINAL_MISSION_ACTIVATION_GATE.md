# IINSHA AI-BOS — FINAL MISSION ACTIVATION GATE

## Purpose

This document is the release gate for activating the autonomous-company lifecycle in production.

The platform may be considered architecturally ready before it is considered live-ready. A capability is only `LIVE_VERIFIED` after a real provider/configuration and real evidence are available.

## Required lifecycle

REAL LEAD
→ REAL SALES
→ REAL NEGOTIATION
→ REAL PAYMENT
→ REAL PROJECT
→ REAL BUILD
→ REAL QA
→ REAL DELIVERY
→ REAL SUPPORT
→ REAL RENEWAL
→ VERIFIED LEARNING
→ MEASURED IMPROVEMENT

## Status vocabulary

- `CODE_READY`: implementation exists and is statically reviewable.
- `TEST_VERIFIED`: automated tests pass.
- `SANDBOX_VERIFIED`: isolated/provider test environment passes.
- `LIVE_VERIFIED`: production provider and real end-to-end evidence pass.
- `NOT_CONFIGURED`: provider or required secret is intentionally absent.
- `BLOCKED`: activation is unsafe or missing mandatory evidence.

## Hard launch blockers

1. Canonical production branch is not established and protected.
2. Git SHA, CI SHA, build SHA, deployment SHA and live SHA do not match.
3. Production Supabase migration has not been validated against canonical tenant claims.
4. New autonomous-business tables are not present with verified RLS policies in production.
5. A payment provider is not live-verified.
6. A project execution worker is not live-verified.
7. QA execution is not live-verified.
8. Production delivery/rollback is not live-verified.
9. Customer acceptance is not live-verified.
10. A real customer lifecycle has not been completed successfully.

## Owner controls

The owner remains the final authority for:

- enabling outbound providers
- enabling real payments
- production deployment
- high-risk discounts
- refunds and financial actions
- production credential activation
- skill promotion to trusted production use
- autonomy budget changes
- kill-switch state

## Required production evidence package

- `CANONICAL_SOURCE_REPORT.md`
- `RELEASE_PARITY_REPORT.json`
- `SUPABASE_TENANT_RLS_VERIFICATION.md`
- `PROVIDER_CONFIGURATION_MATRIX.md`
- `LIVE_WEBHOOK_REPORT.md`
- `PROJECT_WORKER_LIVE_REPORT.md`
- `QA_RUNNER_LIVE_REPORT.md`
- `DELIVERY_ROLLBACK_REPORT.md`
- `CUSTOMER_ACCEPTANCE_REPORT.md`
- `PILOT_CUSTOMER_REPORT.md`
- `FINAL_MISSION_EVIDENCE_MATRIX.md`

## Final acceptance

The mission is complete only when all critical gates are `LIVE_VERIFIED` and at least one real customer completes the full lifecycle with no critical/high failure.
