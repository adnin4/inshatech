# IINSHA AI-BOS — Production Release Evidence Checklist

This checklist is an operational evidence register. It does not itself constitute production certification.

## Current release lineage

- Canonical branch: `master`
- Current verified release head: `2d2f134b0d4e171ded75fc34e5925c70bbbb5a8b`
- Previous release evidence commits: `99344cf`, `eee895fe`
- PR #50 is merged and contains CI false-green hardening.

## Evidence gates

| Gate | Required evidence | Current state |
|---|---|---|
| Git release identity | Exact reviewed master SHA | VERIFIED: `2d2f134` |
| GitHub CI | Required workflow/check-run success | PARTIALLY VERIFIED; re-check current head before certification |
| Cloudflare preview | Successful preview for reviewed SHA | VERIFIED for prior `99344cf` preview |
| Cloudflare production | Production deployment record for current SHA | UNVERIFIED |
| Live `/api/version` | `deploy_sha` equals expected release SHA | UNVERIFIED |
| Live `/api/health` | Truthful runtime health | UNVERIFIED |
| Live `/api/sre/health` | Truthful SRE/runtime health | UNVERIFIED |
| Runtime DB identity | Runtime project equals canonical Supabase ref | UNVERIFIED |
| Supabase security | RLS, grants, policies and privileged functions reviewed | CONTROL-PLANE VERIFIED; runtime authorization evidence pending |
| Browser E2E | Critical journeys against deployed build | STATIC/PUBLIC TESTS VERIFIED; production browser evidence pending |
| AI execution | Mission/task/tool/provider/execution evidence | UNVERIFIED |
| Idempotency | Replay/duplicate side-effect tests | UNVERIFIED |
| Provider receipts | External acceptance/receipt for consequential actions | UNVERIFIED |
| Payments | Provider transaction + webhook + reconciliation | NOT CONFIGURED |
| Notifications | Provider acceptance + durable record | UNVERIFIED |
| Backup/restore | Successful restore evidence | UNVERIFIED |
| Rollback | Tested rollback/recovery evidence | UNVERIFIED |
| Branch governance | Protected master + required checks | NOT VERIFIED |

## Release rule

The release remains `READY_FOR_STAGING` until all required production evidence is independently available. A green source-level test, generated ID, HTTP 200, preview URL, or internal database row is not production evidence by itself.

## Safety

- No UI redesign required.
- No database reset or destructive cleanup.
- No provider activation without credentials and receipt evidence.
- No payment activation without a real controlled transaction and reconciliation.
- Never mark a capability LIVE_VERIFIED when the corresponding external evidence is absent.
