# IINSHA AI-BOS — Production Release Evidence Checklist

This checklist is an evidence register, not a production certification.

## Current release

- Repository: `adnin4/inshatech`
- Canonical branch: `master`
- Current release state: `READY_FOR_STAGING`

## Enforced engineering controls

| Gate | State |
|---|---|
| Business truth | PASS — fail-closed |
| Webhook verification | PASS — provider verifier required |
| Idempotency | PASS — required for payment webhook path |
| QA evidence | PASS — evidence-gated |
| Client approval | PASS — explicit evidence required |
| Restricted tool actions | PASS — blocked |
| System claim verification | PASS — evidence classifications |
| Homepage truth guard | IMPLEMENTED — deployment dependent |
| Autonomous cycle | CONFORMANCE ONLY |
| Final activation mission | READINESS ONLY |
| Supabase control-plane | VERIFIED BASELINE |
| UI/UX | FROZEN / STATIC INVARIANTS |

## External evidence gates

| Gate | State |
|---|---|
| Cloudflare production deployment SHA | EXTERNAL_PROOF_REQUIRED |
| Live `/api/version` | EXTERNAL_PROOF_REQUIRED |
| Live `/api/health` | EXTERNAL_PROOF_REQUIRED |
| Live `/api/sre/health` | EXTERNAL_PROOF_REQUIRED |
| Runtime Supabase identity | EXTERNAL_PROOF_REQUIRED |
| Production browser E2E | EXTERNAL_PROOF_REQUIRED |
| Real AI provider execution + receipt | EXTERNAL_PROOF_REQUIRED |
| Real payment transaction | NOT_CONFIGURED / EXTERNAL_PROOF_REQUIRED |
| Signed webhook + replay | EXTERNAL_PROOF_REQUIRED |
| Reconciliation/refund | EXTERNAL_PROOF_REQUIRED |
| Provider notifications | EXTERNAL_PROOF_REQUIRED |
| Backup/restore | EXTERNAL_PROOF_REQUIRED |
| Rollback/recovery | EXTERNAL_PROOF_REQUIRED |
| Branch protection | NOT_VERIFIED |

## Truth rule

Local tests, source inspection, generated IDs, hashes, timestamps, HTTP 200, preview deployments, internal DB rows and simulated provider output are not production evidence by themselves.
