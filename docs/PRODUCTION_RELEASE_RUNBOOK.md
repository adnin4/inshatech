# Production Release Runbook

## Release gate
1. Exact master SHA is selected.
2. The four authoritative GitHub check-runs for that SHA must all complete successfully.
3. Production deployment proceeds only after the check gate passes.
4. `/api/version` must expose the exact release SHA.
5. Production browser/route smoke must pass.
6. Any failed gate blocks certification.

## Required check-runs
- IINSHA AI-BOS Master Production CI
- Zero-Regression & Cloudflare Pages Guard
- Final Activation Gates
- Autonomous Company Wave 1

## Status vocabulary
- `CODE_READY`
- `CI_VERIFIED`
- `STAGING_VERIFIED`
- `LIVE_VERIFIED`
- `REAL_CUSTOMER_VERIFIED`

Never promote a lower proof level into a higher claim without the required evidence.