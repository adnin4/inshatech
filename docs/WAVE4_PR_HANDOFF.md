# Wave 4 PR Handoff

## Branch
`codex/wave4-production-adapters`

## Review status
Draft/Review required before merge because `master` advanced after this branch was created. Do not deploy this branch directly to production.

## Why this change exists
The prior ToolExecutionGateway contained synthetic success responses for several side-effect tools and a hardcoded owner approval token. The new boundary makes these paths fail closed unless a real provider adapter produces evidence.

## Required CI checks
- `npm run test:wave4`
- existing claim verification
- existing security gate
- existing E2E suite
- no UI/UX regression

## Required pre-merge runtime checks
- current master SHA is rechecked
- Supabase project identity is reconciled
- Cloudflare `/api/version` parity is verified
- live provider credentials remain in secret storage only

## Merge policy
Do not merge until all checks pass on a branch rebased/replayed onto the latest `master`. Do not enable payment/deployment side effects as part of this PR.
