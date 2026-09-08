# IINSHA AI-BOS — Master Remaining Execution Roadmap

Status: execution contract, not production certification.

## Safety contract

- No UI/UX redesign as part of backend hardening.
- No existing feature is removed or renamed without a separate compatibility review.
- No production payment activation without provider-native evidence.
- No synthetic/demo data may be presented as real customer, payment, revenue, or production evidence.
- Frontend is never payment authority.
- `service_role` and provider secrets remain server-side only.
- Database changes are additive, migration-controlled, and verified after application.
- Every production claim requires evidence.

## Execution order

1. Repository and release truth
2. Payment schema/code parity
3. Idempotency and state machine
4. SSLCommerz native verification
5. Payment adversarial tests
6. Reconciliation
7. Refunds
8. Authentication and authorization
9. Tenant isolation and RLS
10. API/security hardening
11. CRM and lead lifecycle
12. AI sales and proposal
13. Real order lifecycle
14. Project factory
15. Requirements and architecture
16. Task DAG
17. Agent governance
18. Sandbox development
19. Automated and independent QA
20. Preview and client approval
21. Production deployment and runtime evidence
22. Delivery/support/renewal
23. Affiliate/fraud/commission/payout
24. Observability/cost governance/kill switches
25. Incident/DR/backup/restore/rollback
26. Database/GitHub/legal governance
27. Real customer acquisition
28. Revenue operational
29. Governed autonomous operational

## Gate rule

Each stage is closed only when implementation, tests, evidence, and rollback/compatibility checks all pass. Otherwise the stage remains blocked.
