# CI Evidence ZIP — Human-Readable Handoff

The CI evidence archive from run `34459234581` contained 32 files. The archive is intentionally summarized here so its meaning remains available without downloading an archive.

Key report: `summary.md`

- Generated: `2026-09-10T09:11:25.635Z`
- Repository: `adnin4/inshatech`
- Workflow SHA: `f497ee3b0c9f1974c488f034766fd4bb7994afe0`
- PR head SHA: `ddf90cfe10a6934ff2a949be7cd9a0002a5c09ad`
- Checked-out source SHA: `ddf90cfe10a6934ff2a949be7cd9a0002a5c09ad`
- Base SHA: `45ee4c1f90f699686c71912a7f22598cbe3b0a74`
- Workflow ref: `refs/pull/67/merge`
- PR ref: `refs/pull/67/head`
- Run ID: `34459234581`
- Transport self-test: `VERIFIED NON-EMPTY & COMPLETE`
- Total suites: `24`
- Passed: `24`
- Failed: `0`
- Primary/secondary/dependency/environment failures: `0`
- Immutable green baseline: established at `ddf90cfe...`

The 24 suites covered governance/reality boundary, system claims, security, direct DB access scanning, visual baseline, forms, solution finder, Copilot, service authority, payment schema/coupon/FX/state-machine/webhook/hardening/adversarial/replay-concurrency/reconciliation, tenant RLS/isolation, SLO/DR, production-browser synthetic validation, release identity, and business truth gates.

Important boundary: this artifact is CI diagnostic evidence only. It does not certify Cloudflare production, Supabase production, live payments, real revenue, real customers, uptime, or autonomous operation.

`summary.json` independently records the same identity and 24/24 result, plus `evidence_only=true` and `production_certification=false`.

Other files in the archive are the per-suite JSON evidence records, `runner.log`, `repository-identity.txt`, `toolchain.txt`, `transport-start.txt`, `transport-end.txt`, and the individual payment/security/tenant/runtime/frontend evidence files.
