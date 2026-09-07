# IINSHA AI-BOS — Production Release Evidence Checklist

This checklist is an operational evidence register. It does not constitute production certification.

## Current release lineage

- Canonical branch: `master`
- Runtime/code hardening head: `1b83d5c` (`test(truth): cover fail-closed verification outcomes`)
- Documentation-only revisions follow that runtime head.
- Main and master must be SHA-checked before any production release.

## Evidence gates

| Gate | Current state |
|---|---|
| Exact reviewed runtime/code SHA | VERIFIED: `1b83d5c` |
| Current-head GitHub CI | MUST RECHECK |
| Cloudflare production deployment | UNVERIFIED |
| Live `/api/version` | UNVERIFIED |
| Live `/api/health` | UNVERIFIED |
| Live `/api/sre/health` | UNVERIFIED |
| Runtime Supabase identity | UNVERIFIED |
| Supabase control-plane security | VERIFIED baseline; runtime authorization pending |
| Production browser E2E | UNVERIFIED |
| Real AI execution chain | UNVERIFIED |
| Live replay/idempotency evidence | UNVERIFIED |
| Provider receipts | UNVERIFIED |
| Payments | NOT_CONFIGURED |
| Notifications | UNVERIFIED |
| Backup/restore | UNVERIFIED |
| Rollback/recovery | UNVERIFIED |
| Branch governance | NOT_VERIFIED |
| Business truth gates | VERIFIED IN CODE |
| Verification semantics | VERIFIED IN CODE |
| Canonical system state truthfulness | HARDENED |

## Release rule

Release remains `READY_FOR_STAGING` until the required production evidence is independently available.

Do not treat source tests, generated IDs, timestamps, hashes, HTTP 200 responses, preview URLs, static state files, or internal rows as sufficient production evidence.

## Safety

- No UI redesign is required for this hardening pass.
- No destructive database cleanup.
- No provider activation without credentials and external receipt evidence.
- No payment activation without a real controlled transaction and reconciliation.
- Never mark `LIVE_VERIFIED` without corresponding external evidence.
- Never equate business/provider verification with `production_verified`.
