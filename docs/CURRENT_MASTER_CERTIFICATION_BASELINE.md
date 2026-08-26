# IINSHA Current Master Certification Baseline

Date: 2026-08-26

## Purpose

This document is a release-evidence marker. It does not certify production readiness by itself.

## Rules

1. The current `master` commit is the only release candidate.
2. All authoritative CI checks must pass for the exact release SHA.
3. Production deployment must be followed by live SHA parity verification.
4. Browser/route smoke must pass against the live artifact.
5. Provider integrations remain `NOT_CONFIGURED`, `SANDBOX_VERIFIED`, or `LIVE_VERIFIED` based only on real evidence.
6. A real customer transaction is required before claiming full real-world mission completion.

## Certification states

- `CODE_VERIFIED`: code and CI checks pass.
- `STAGING_VERIFIED`: isolated staging artifact and browser checks pass.
- `LIVE_VERIFIED`: production artifact SHA and browser checks pass.
- `REAL_WORLD_VERIFIED`: a real customer lifecycle has completed with evidence.

## Current scope

This baseline intentionally makes no claim that payment providers, WhatsApp, CRM, real project execution, or real customer revenue are live-verified.
