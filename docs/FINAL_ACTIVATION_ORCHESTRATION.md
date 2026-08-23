# IINSHA AI-BOS — Final Activation Orchestration

## Objective

Move the platform from certification-ready architecture to evidence-backed real-world operation without fabricating live status.

## Release states

`BLOCKED -> STAGING_VERIFIED -> PRODUCTION_VERIFIED -> PROVIDERS_LIVE -> PILOT_ACTIVE -> MISSION_VERIFIED`

No state may be skipped.

## Activation order

1. P0 security remediation = zero.
2. Staging build, smoke, browser, version/SHA parity and security-content gates pass.
3. Canonical Supabase tenant/RLS verification passes.
4. Production deployment is created from the reviewed release candidate.
5. Provider preflight passes without exposing secret values.
6. Each required provider is connection-tested, then sandbox-tested, then live-verified with provider evidence.
7. One real customer is admitted through an owner-approved pilot.
8. The complete business loop is executed and every stage receives immutable evidence.
9. A measured rollback drill is completed.
10. Learning is promoted only through benchmark -> approval -> canary -> measurement.
11. 5-10 pilot customers repeat the lifecycle with no P0/P1 incident and acceptable business metrics.
12. The 100-sector matrix is regenerated from evidence, not claims.
13. Final launch review signs the release.

## Pilot control limits

- Outbound automation starts disabled.
- Financial actions remain owner-approved until pilot stability is demonstrated.
- Production deployment remains owner-approved.
- AI tool execution is capability-scoped and budget-limited.
- Learning promotion cannot alter auth, financial policy, or safety policy automatically.
- Emergency kill switch must stop external autonomous side effects.

## Evidence packet for one real customer

Each stage must emit:

- evidence_id
- stage
- tenant/customer id
- correlation id
- actor/agent id
- UTC timestamp
- provider reference when applicable
- deployment/commit reference when applicable
- result
- evidence URI or hash

Required stages:

`LEAD, SALES, NEGOTIATION, PAYMENT, PROJECT, BUILD, QA, CLIENT_APPROVAL, DELIVERY, SUPPORT, RENEWAL, LEARNING`

## Business success metrics

Track, at minimum:

- lead-to-qualified rate
- qualified-to-proposal rate
- proposal-to-win rate
- average sales cycle
- gross margin per project
- AI cost per project
- delivery cycle time
- defect escape rate
- rollback rate
- customer satisfaction
- support response time
- renewal rate
- referral rate
- learning promotion rate

Thresholds must be configured by the owner before global launch.

## Final mission condition

`MISSION_VERIFIED` requires:

- all P0/P1 blockers closed
- all required providers LIVE_VERIFIED
- one complete real customer lifecycle evidenced
- payment reconciliation clean
- deployment and rollback proven
- support and renewal evidenced
- learning promotion evidenced
- 100-sector matrix complete
- release sign-off recorded

## Non-goals

No fabricated customers, payments, testimonials, uptime, revenue, ROI, compliance certification, or provider health status.
