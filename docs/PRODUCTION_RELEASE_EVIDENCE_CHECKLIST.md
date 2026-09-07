# IINSHA AI-BOS — Production Release Evidence Checklist

This checklist is an operational evidence register. It does not itself constitute production certification.

## Current release lineage

- Canonical branch: `master`
- Current runtime/code hardening head: `1b83d5c` (`test(truth): cover fail-closed verification outcomes`)
- Subsequent commits after this runtime/code head are documentation/release-state changes unless explicitly stated otherwise.
- Business truth regression checks are wired into CI.

## Evidence gates

| Gate | Required evidence | Current state |
|---|---|---|
| Git release identity | Exact reviewed runtime/code SHA | VERIFIED: `1b83d5c` |
| GitHub CI | Required workflow/check-run success for current code head | RECHECK REQUIRED AFTER LATEST CODE CHANGE |
| Cloudflare preview | Successful preview for reviewed SHA | VERIFIED for prior preview releases |
| Cloudflare production | Production deployment record for current code head | UNVERIFIED |
| Live `/api/version` | `deploy_sha` equals expected runtime/code SHA | UNVERIFIED |
| Live `/api/health` | Truthful runtime health | UNVERIFIED |
| Live `/api/sre/health` | Truthful SRE/runtime health | UNVERIFIED |
| Runtime DB identity | Runtime project equals canonical Supabase ref | UNVERIFIED |
| Supabase security | RLS, grants, policies and privileged functions reviewed | CONTROL-PLANE VERIFIED; runtime authorization evidence pending |
| Browser E2E | Critical journeys against deployed build | STATIC/PUBLIC TESTS VERIFIED; production browser evidence pending |
| AI execution | Mission/task/tool/provider/execution evidence | UNVERIFIED |
| Idempotency | Replay/duplicate side-effect tests | CODE GATES VERIFIED; LIVE/PROVIDER REPLAY EVIDENCE PENDING |
| Provider receipts | External acceptance/receipt for consequential actions | UNVERIFIED |
| Payments | Provider transaction + webhook + reconciliation | NOT CONFIGURED |
| Notifications | Provider acceptance + durable record | UNVERIFIED |
| Backup/restore | Successful restore evidence | UNVERIFIED |
| Rollback | Tested rollback/recovery evidence | UNVERIFIED |
| Branch governance | Protected canonical branch + required checks | NOT VERIFIED |
| Business truth gates | Synthetic payment/QA/delivery success prevented | VERIFIED IN CODE; CURRENT-HEAD CI RECHECK REQUIRED |
| Verification semantics | Operation/business verification cannot imply whole-production verification | VERIFIED IN CODE |
| Canonical system state | Static state cannot impersonate live runtime evidence | HARDENED; RUNTIME STILL UNVERIFIED |

## Release rule

The release remains `READY_FOR_STAGING` until all required production evidence is independently available. A green source-level test, generated ID, HTTP 200, preview URL, static state file, or internal database row is not production evidence by itself.

## Safety

- No UI redesign required.
- No database reset or destructive cleanup.
- No provider activation without credentials and receipt evidence.
- No payment activation without a real controlled transaction and reconciliation.
- Never mark a capability `LIVE_VERIFIED` when the corresponding external evidence is absent.
- Never mark local/provider/business verification as `production_verified` without whole-environment evidence.
