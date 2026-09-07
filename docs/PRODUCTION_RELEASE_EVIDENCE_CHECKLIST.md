# IINSHA AI-BOS — Production Release Evidence Checklist

This checklist is an operational evidence register. It does not itself constitute production certification.

## Current release lineage

- Canonical branch: `master`
- Runtime/code hardening head: `1b83d5c` (`test(truth): cover fail-closed verification outcomes`)
- Main and master must be SHA-checked before production release.
- Documentation changes after the runtime head do not modify application runtime behavior.

## Evidence gates

| Gate | Required evidence | Current state |
|---|---|---|
| Git release identity | Exact reviewed runtime/code SHA | VERIFIED: `1b83d5c` |
| GitHub CI | Required workflow/check-run success for current code head | MUST RECHECK CURRENT HEAD |
| Cloudflare preview | Successful preview for reviewed SHA | VERIFIED for prior preview releases |
| Cloudflare production | Production deployment record for reviewed code | UNVERIFIED |
| Live `/api/version` | Deploy SHA equals reviewed runtime/code SHA | UNVERIFIED |
| Live `/api/health` | Truthful runtime health | UNVERIFIED |
| Live `/api/sre/health` | Truthful SRE/runtime health | UNVERIFIED |
| Runtime DB identity | Runtime project equals canonical Supabase ref | UNVERIFIED |
| Supabase security | RLS, grants, policies, privileged functions | CONTROL-PLANE VERIFIED; runtime authorization pending |
| Browser E2E | Critical journeys against deployed build | STATIC/PUBLIC VERIFIED; production evidence pending |
| AI execution | Mission/task/tool/provider/execution chain | UNVERIFIED |
| Idempotency | Replay/duplicate side-effect evidence | CODE VERIFIED; live/provider evidence pending |
| Provider receipts | External acceptance/receipt | UNVERIFIED |
| Payments | Transaction + signed webhook + reconciliation | NOT_CONFIGURED |
| Notifications | Provider acceptance + durable record | UNVERIFIED |
| Backup/restore | Successful restore evidence | UNVERIFIED |
| Rollback | Tested rollback/recovery evidence | UNVERIFIED |
| Branch governance | Protected branch + required checks | NOT VERIFIED |
| Business truth gates | Synthetic success prevented | VERIFIED IN CODE |
| Verification semantics | Operation verification cannot imply production verification | VERIFIED IN CODE |
| Canonical system state | Static state cannot impersonate runtime proof | HARDENED |

## Release rule

Release remains `READY_FOR_STAGING` until required production evidence is independently available.

A source-level test, generated ID, timestamp, hash, HTTP 200, preview URL, static state file, or internal row is not production evidence by itself.

## Safety

- No UI redesign required.
- No database reset/destructive cleanup.
- No provider activation without credentials and external receipt evidence.
- No payment activation without a real controlled transaction and reconciliation.
- Never mark capabilities `LIVE_VERIFIED` without corresponding external evidence.
- Never mark local/provider/business verification as `production_verified` without whole-environment evidence.
