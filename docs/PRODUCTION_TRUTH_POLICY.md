# IINSHA Production Truth Policy

This document defines how public claims and release evidence must be represented.

## Capability states

- `LIVE_VERIFIED`: proven against the current production deployment and real provider/runtime evidence.
- `INTEGRATION_VERIFIED`: external integration works in the configured test environment but production proof is pending.
- `SANDBOX_VERIFIED`: provider sandbox/test flow passed.
- `BETA`: implemented but still under controlled rollout.
- `SIMULATION`: calculated or simulated output; not production evidence.
- `ESTIMATED`: modelled estimate; not a guarantee.
- `DEMO`: demonstration-only behavior.
- `NOT_CONFIGURED`: required external configuration is missing.
- `UNAVAILABLE`: capability cannot currently execute.

## Public-claim rules

1. Never claim bypass, evasion, stealth, guaranteed outcomes, guaranteed savings, guaranteed income, or compliance certification without documented evidence.
2. Security/performance/business metrics shown on public pages must identify whether they are measured, estimated, simulated, or demo-only.
3. Payment, messaging, CRM, payout, deployment, and agent actions must not be presented as live unless the corresponding provider/runtime evidence exists.
4. A passing unit or synthetic test suite is not sufficient to label a feature `LIVE_VERIFIED`.
5. Public marketing copy must match the current production artifact and may not describe retired architectures or providers as current capabilities.
