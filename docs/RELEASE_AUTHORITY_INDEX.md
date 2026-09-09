# IINSHA AI-BOS — Release Authority Index

Documentation-only release governance index. No status in this file constitutes production certification.

## Gate order

0. Evidence transport is independently retrievable.
1. Exact failing assertions are reproducible and fixed.
2. A deterministic green baseline is frozen on an exact SHA.
3. Source/build/artifact/deployment/runtime identity is bound.
4. Cloudflare production source and deployment are externally verified.
5. Supabase project, migration, RLS, grants, and functions are externally verified.
6. Commerce, coupon, idempotency, payment, webhook, replay, and refund contracts are verified.
7. Finance ledger and reconciliation invariants are verified.
8. Agent identity, permissions, policy, approvals, budgets, and tenant isolation are verified.
9. Project Factory, independent QA, deployment, rollback, and support are verified.
10. Golden E2E and production browser evidence are complete.
11. Real pilot is completed with full trace/evidence.
12. Revenue Operational requirements are met.
13. Autonomous Operational requirements are met.

## Decision rule

A later gate may not substitute for an earlier gate. Missing external evidence remains `UNVERIFIED`, `NOT_CONFIGURED`, or `BLOCKED` and cannot be turned into `PASS` by generated documentation or test output alone.
