# IINSHA AI-BOS — Final Activation & Evidence Gate

## Purpose

This document is the release contract for turning the existing autonomous-company architecture into a real, provider-backed business system without allowing simulated or unverified behavior to appear as LIVE.

## Non-negotiable rules

1. **No fake success.** Missing provider configuration returns `NOT_CONFIGURED` or `UNAVAILABLE`.
2. **No production side effect from tests.** CI uses sandbox/test adapters only.
3. **No direct model-to-provider access.** Agents call registered tools/adapters through the policy gateway.
4. **No automatic production delivery.** Production deployment, money movement, refunds, payouts, credential changes and destructive operations require the configured owner approval policy.
5. **Every high-impact action is idempotent and auditable.** Store request/idempotency key, actor, policy decision, provider result, timestamps and evidence reference.
6. **Learning is promotion-based.** Runtime observations become candidates; candidates require benchmark evidence and explicit approval before changing production agent behavior.
7. **Release is evidence-gated.** A green UI or unit test alone never proves a live provider capability.

## Activation order

### Gate A — Source and deployment parity

- One canonical production branch and SHA.
- Cloudflare deployment SHA must match the approved Git commit.
- Preview/staging must be the only target for unmerged changes.
- Production rollback target must be known before release.
- Every release records deployment evidence.

### Gate B — Supabase integrity

- All production tables have RLS enabled.
- Sensitive tables have explicit deny-by-default behavior where tenant mapping is not established.
- Foreign-key indexes are present where required.
- Payment/order/webhook records are durable and idempotent.
- No client-supplied price is authoritative.
- Database migrations are the canonical schema history.

### Gate C — Identity and authorization

- Customer, affiliate, operator and owner identities use server-side authorization.
- Critical actions require the correct role/resource/action policy.
- Sessions are revocable.
- Owner critical actions require the configured MFA policy.
- Service credentials never appear in browser code.

### Gate D — Provider activation

Each integration must have an explicit state:

`NOT_CONFIGURED → SANDBOX_CONFIGURED → SANDBOX_VERIFIED → LIVE_CONFIGURED → LIVE_VERIFIED`

Required adapters include, as applicable:

- lead/CRM provider
- transactional email
- WhatsApp/SMS provider
- payment provider(s)
- project execution worker
- isolated browser/API QA runner
- deployment/rollback provider
- notification channels
- analytics/observability sink

Never infer `LIVE_VERIFIED` from the presence of a secret.

### Gate E — Real revenue transaction

A controlled sandbox transaction must prove:

`checkout → provider session → signed webhook → idempotent event → order → revenue → ledger → invoice/receipt`

Live activation additionally requires one real provider transaction and reconciliation evidence. Refund/dispute paths must be tested before declaring payment production-ready.

### Gate F — Real project lifecycle

A pilot order must prove:

`PAID → PLANNING → IN_PROGRESS → QA → CLIENT_REVIEW → APPROVED → DELIVERED → MAINTENANCE`

Each transition records actor, timestamp, reason and evidence. A failed QA or rejected client review must return to a safe prior state rather than skipping gates.

### Gate G — Agent control plane

Agents operate as workers, not owners of the system.

`Mission → policy evaluation → tool authorization → execution → receipt → evidence → state update`

Owner controls must include:

- global kill switch
- per-agent enable/disable
- per-tool enable/disable
- budget limit
- rate limit
- channel allowlist
- customer/tenant scope
- production-write approval policy
- emergency revoke

### Gate H — AI safety and evaluation

- Prompt-injection and tool-confusion tests.
- Sensitive-data redaction tests.
- Memory poisoning tests.
- Tool authorization bypass tests.
- Golden customer conversations.
- Sales accuracy and pricing-policy tests.
- Regression evaluation on every agent/version change.
- New skills remain shadow/candidate until benchmarked and approved.

### Gate I — Observability and incident response

Every request/mission/tool execution should be traceable using a correlation chain such as:

`request_id → trace_id → mission_id → actor_id → tool_call_id → receipt_id → evidence_id`

Track latency, errors, provider status, model/token cost, business outcome and policy decisions. P0/P1 alerts must reach the configured owner notification channels. Incident records must preserve timeline and remediation evidence.

### Gate J — Disaster recovery

- Backup existence is not sufficient.
- Execute a restore drill in an isolated environment.
- Verify schema, critical records and application connectivity after restore.
- Record measured RTO/RPO.
- Test rollback of the latest application release.

## Business loop certification

The first real pilot is the minimum proof of the intended autonomous-company loop:

`REAL LEAD → QUALIFY → OUTREACH → SALES → NEGOTIATION → PROPOSAL → PAYMENT → PROJECT → BUILD → QA → CLIENT ACCEPTANCE → DELIVERY → SUPPORT → RENEWAL → EXPERIENCE → BENCHMARK → APPROVED SKILL`

The loop is not certified if any stage is merely mocked, simulated, manually bypassed, or represented by a static UI counter.

## Production release gate

A release is **BLOCKED** if any of the following is true:

- live SHA parity is unknown;
- a required provider is unconfigured;
- payment/webhook evidence is missing;
- production tool execution is not isolated and policy-controlled;
- QA evidence is missing;
- rollback has not been tested;
- critical RLS/security checks fail;
- an agent can bypass the tool policy gateway;
- a learning candidate can alter production behavior without approval;
- a public page labels simulated/unverified metrics as LIVE.

## Definition of done

The system may be called production-ready only when all gates above have recorded evidence. It may be called **real-world mission complete** only after the first real customer completes the full lifecycle and the learning pipeline produces a benchmarked, approved improvement without changing production behavior outside policy.
