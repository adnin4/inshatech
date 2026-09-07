# IINSHA AI-BOS — Production Release Evidence Checklist

This checklist is an evidence register, not a production certification.

## Current release

- Repository: `adnin4/inshatech`
- Canonical branch: `master`
- Current reviewed master tip: `d6672d22fc6997c1741f98525d40ed75bae7330b`
- `main` must be fast-forwarded to the same reviewed tip before deployment.

## Verified engineering controls

| Gate | State | Evidence class |
|---|---|---|
| Business truth gates | PASS | STATIC / STRUCTURAL |
| Webhook verification boundary | PASS | STRUCTURAL |
| Idempotency requirement | PASS | STRUCTURAL |
| Evidence-gated QA | PASS | STRUCTURAL |
| Client approval gate | PASS | STRUCTURAL |
| Restricted tool blocking | PASS | STATIC |
| System claim classification | PASS | STATIC |
| Homepage public truth guard | IMPLEMENTED | DEPLOYMENT-DEPENDENT |
| Supabase control-plane baseline | PASS | CONTROL-PLANE |
| UI/UX invariants | PASS | STATIC |
| Autonomous business cycle | CONFORMANCE ONLY | SIMULATION |
| Final activation mission | READINESS ONLY | CONFORMANCE |

## External production evidence

| Gate | State |
|---|---|
| Cloudflare production deployment SHA | EXTERNAL_PROOF_REQUIRED |
| Live `/api/version` | EXTERNAL_PROOF_REQUIRED |
| Live `/api/health` | EXTERNAL_PROOF_REQUIRED |
| Live `/api/sre/health` | EXTERNAL_PROOF_REQUIRED |
| Runtime Supabase identity | EXTERNAL_PROOF_REQUIRED |
| Production browser E2E | EXTERNAL_PROOF_REQUIRED |
| Real AI provider execution | EXTERNAL_PROOF_REQUIRED |
| Provider receipt | EXTERNAL_PROOF_REQUIRED |
| Real payment transaction | NOT_CONFIGURED / EXTERNAL_PROOF_REQUIRED |
| Signed webhook + replay | EXTERNAL_PROOF_REQUIRED |
| Reconciliation/refund | EXTERNAL_PROOF_REQUIRED |
| Notifications/provider delivery | EXTERNAL_PROOF_REQUIRED |
| Backup/restore | EXTERNAL_PROOF_REQUIRED |
| Rollback/recovery | EXTERNAL_PROOF_REQUIRED |
| Branch protection | NOT_VERIFIED |

## Release classification

`READY_FOR_STAGING`

Promotion to `READY_FOR_PILOT` or `PRODUCTION_READY` requires independent external evidence for the exact reviewed/deployed SHA.

## Non-negotiable

A generated ID, timestamp, hash, HTTP 200, internal DB row, local test result, preview URL, simulated provider result, or source-file presence is not by itself production evidence.
