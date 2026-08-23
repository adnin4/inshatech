# IINSHA AI-BOS — Final 100% Activation Matrix

## Objective

Move the platform from implementation-ready to evidence-backed real-world operation without fabricating live integrations, customers, payments, or outcomes.

## Activation states

- `CODE_READY` — implementation exists.
- `TEST_VERIFIED` — automated regression verifies behavior.
- `SANDBOX_VERIFIED` — provider/test environment verifies the integration.
- `CONFIGURED` — credentials/endpoints are present.
- `LIVE_VERIFIED` — a real production transaction or external action produced auditable evidence.
- `NOT_CONFIGURED` — dependency is not available.
- `FAILED` — verification failed and must block promotion.

## Provider gates

| Capability | Required live evidence |
|---|---|
| Lead source | Real authorized prospect discovery + source audit record |
| CRM | Create/update/readback of a real pilot opportunity |
| Email/WhatsApp | Provider-confirmed delivery and reply handling for a pilot contact |
| Stripe | Real payment + signed webhook + reconciliation + refund test |
| bKash | Real payment + callback/IPN + reconciliation + refund/void path where supported |
| Project executor | Isolated real project task runs with artifacts |
| AI sandbox | Real code/build/test execution in isolated workspace |
| QA runner | Real browser/API/security test evidence attached to project |
| Deployment | Real preview/prod deployment + rollback verification |
| Notifications | Real delivery of critical lifecycle notifications |
| Monitoring | Real incident/alert test with traceable event |

## Real customer pilot gate

A pilot customer is only `PASS` when all stages below are evidenced:

1. Lead sourced and attributed.
2. Qualification recorded.
3. Sales conversation recorded.
4. Proposal generated and accepted.
5. Negotiation stayed within pricing policy.
6. Payment settled and reconciled.
7. Project created automatically.
8. Requirements captured.
9. Work executed in an isolated workspace.
10. Independent QA passed.
11. Customer preview delivered.
12. Customer acceptance recorded.
13. Production delivery completed.
14. Rollback drill completed or explicitly waived by owner for a low-risk pilot.
15. Support event handled.
16. Renewal/retention event scheduled.
17. Outcome stored as an experience record.
18. Learning candidate evaluated.
19. Skill promoted only after benchmark + owner approval.
20. Post-pilot mission evidence recorded.

## Owner control

External side effects remain owner-controlled by default. The following always require explicit policy authorization:

- production deployment
- high-value refunds
- large discounts
- financial transfers
- bulk outreach
- access to high-sensitivity data
- changes to security/RBAC policy
- destructive database actions

## Final 100% gate

The platform is `MISSION_VERIFIED_100` only when:

- all critical providers are `LIVE_VERIFIED` for the intended business model,
- at least one real pilot customer completes the full lifecycle,
- 5–10 pilot users/customers repeat the core flow without P0/P1 failures,
- payment and ledger reconciliation remain balanced,
- rollback is demonstrated,
- observability captures the lifecycle,
- learning produces a verified improvement that survives benchmark/canary checks,
- final security/performance/DR review passes,
- and all evidence is stored in the mission evidence ledger.

Until then the only truthful top-level status is `PRE_LAUNCH_REAL_WORLD_VERIFICATION`.
