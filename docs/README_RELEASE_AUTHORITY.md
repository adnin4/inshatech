# IINSHA AI-BOS — Release Authority Index

This index defines the order in which release evidence must be established. It is governance documentation only and does not declare any runtime status.

## Gate order

1. Gate 0 — CI evidence transport is independently retrievable.
2. Gate 1 — Exact suite failures are reproducible and fixed.
3. Gate 2 — Green baseline is frozen on an exact SHA.
4. Gate 3 — Release identity binds source/build/artifact/deployment/runtime.
5. Gate 4 — Cloudflare production source and deployment parity are externally verified.
6. Gate 5 — Supabase live control-plane, migration, RLS and function security are externally verified.
7. Gate 6 — Commerce, coupon, idempotency and payment contracts are verified.
8. Gate 7 — Finance ledger and reconciliation invariants are verified.
9. Gate 8 — Agent authority, tenant isolation, approvals and tool scopes are verified.
10. Gate 9 — Project Factory, QA, deployment and recovery paths are verified.
11. Gate 10 — Golden E2E and production browser evidence are complete.
12. Gate 11 — Real pilot is completed with complete trace/evidence.
13. Gate 12 — Revenue Operational requirements are met.
14. Gate 13 — Autonomous Operational requirements are met.

## Decision rule

A later gate may not be used to imply completion of an earlier gate. Missing external evidence is an explicit state (`UNVERIFIED`, `NOT_CONFIGURED`, or `BLOCKED`) and must not be converted into a PASS by generated documentation.
