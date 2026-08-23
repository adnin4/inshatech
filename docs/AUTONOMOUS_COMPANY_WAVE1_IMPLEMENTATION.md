# IINSHA AI-BOS — Autonomous Company Wave 1

## Objective

This wave moves IINSHA from agent architecture toward a governed, persistent revenue-acquisition foundation without enabling unrestricted outbound automation.

## Implemented on this branch

### 1. Governed lead acquisition foundation
- Added persistent data model for lead sources, prospects, prospect scores and outreach events.
- Added explicit source classification: `REAL`, `SYNTHETIC_DEMO`, `MANUAL`, `REFERRAL`, `IMPORT`.
- Synthetic prospects are structurally distinguishable and the acquisition engine rejects them for real outreach.

### 2. Lead acquisition engine
- Added provider-registry architecture.
- Provider configuration is explicit; missing providers return `NOT_CONFIGURED` rather than fake results.
- Added normalization for contact emails and websites.
- Added explainable ICP/intent/pain/budget/timing/service-fit scoring.
- Added outreach eligibility checks.

### 3. Owner-controlled outreach gate
- Added a central outbound policy gate.
- The owner can disable autonomous outreach.
- First campaigns require explicit approval by default.
- Daily campaign limits and verified-source requirements are enforced.
- Suppressed contacts and synthetic data are blocked.

### 4. Dynamic margin governance
- Upgraded `MarginGuardian` to accept real, server-side cost inputs.
- Legacy percentage estimates remain only as compatibility fallbacks.
- Added explicit risk reserve and safe-minimum price calculation.
- Unsafe deals remain blocked for approval.

### 5. Persistent learning foundation
- Added additive schema for skills, skill versions, skill evaluations and experience records.
- RLS is enabled on new sensitive tables.
- Tenant policies are intentionally not guessed in the migration; they must reuse the repository's canonical organization/tenant claim mapping before customer access is enabled.

## Safety boundary

No real acquisition provider is enabled by this change. No production outreach is enabled by this change. Credentials are still controlled by the owner. The next integration step must connect a real, authorized provider through the adapter contract and then validate the provider in sandbox/staging before any production sending is enabled.

## Verification requirements

Before merge to production:

1. Validate migration against the canonical Supabase schema/tenant claims.
2. Add RLS policies using the existing canonical tenant model.
3. Add provider-specific lead adapter(s) using owner-configured credentials.
4. Run unit/integration tests for normalization, scoring, suppression and policy gates.
5. Test duplicate prevention and idempotent provider events.
6. Verify no synthetic/demo prospect can enter outreach.
7. Keep autonomous outbound disabled until the owner explicitly enables it.
