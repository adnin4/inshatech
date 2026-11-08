# IINSHA AI-BOS — Wave 4 Production Adapter Status

Date: 2026-09-07
Branch: `codex/wave4-production-adapters`

## Scope

Wave 4 hardens the execution boundary without redesigning or deleting existing UI/features.
The objective is to ensure that an agent cannot claim a real-world side effect unless a real provider or verified execution service produced evidence.

## Changes

- `ai_brain/tool_execution_gateway.js`
  - removed the hardcoded owner approval token
  - owner approval is now supplied through trusted execution context
  - removed synthetic production success for checkout, sandbox, QA, deployment, refunds and payouts
  - CRM execution is delegated to the production Supabase adapter
  - rate-limit buckets now expire after one minute
  - every execution records production verification state
- `ai_brain/agent_runtime.js`
  - separates control-plane owner approval from public/tool arguments
  - propagates provider verification status
- `ai_brain/adapters/crm_adapter.js`
  - converts the previous in-memory CRM path into an explicit Supabase REST adapter
  - missing credentials or provider failures are fail-closed
  - successful persistence includes a correlation ID and provider receipt
- `ai_brain/adapters/notification_dispatcher.js`
  - Telegram and Resend paths now call providers when configured
  - missing credentials are `NOT_CONFIGURED`
  - success requires provider acceptance
- `ai_brain/adapters/deployment_adapter.js`
  - adds live `/api/version` SHA parity verification
  - deployment remains fail-closed until the exact Cloudflare Pages deployment receipt/upload contract is independently verified

## Production Truth Contract

`SUCCESS` is not sufficient by itself for production certification.

A production side effect is `LIVE_VERIFIED` only when:

1. provider credentials are configured in secret storage;
2. the real provider/executor is called;
3. the provider accepts the request;
4. a receipt/execution ID or equivalent evidence is returned;
5. the result is persisted/auditable where required.

Otherwise the adapter must return `NOT_CONFIGURED`, `UNVERIFIED`, `PROVIDER_ERROR`, `PROVIDER_UNREACHABLE`, `APPROVAL_REQUIRED`, or another explicit non-success state.

## Known next blockers

- Reconcile Supabase project identity (`uulqaslcfjrvkvyegmvo` references vs active connector project `kitwadizsvjmuxkfewxj`).
- Restore/verify the active Supabase project before database-backed production certification.
- Verify Cloudflare production deployment SHA against current GitHub master and `/api/version`.
- Add provider-specific payment/session/refund adapters and real transaction evidence before enabling financial claims.
- Add a real isolated execution service for browser automation, project sandbox and QA runner before claiming those tools as live.

## Safety

This branch is isolated from `master`. No production deployment, database mutation, payment activation, credential rotation, or UI redesign is performed by this Wave 4 change set.
