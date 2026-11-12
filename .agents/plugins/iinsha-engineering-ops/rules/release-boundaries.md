---
name: iinsha-release-boundaries
description: Apply strict release, deployment, database, and production-evidence boundaries to IINSHA changes.
---
# IINSHA Release Boundaries

- A green local test suite does not mean GitHub CI is green.
- A green PR CI run does not mean the PR head is merged.
- A staging deployment does not mean production is deployed.
- An HTTP 200 liveness endpoint does not mean readiness or database access is healthy.
- A version endpoint's own parity claim is evidence to inspect, not independent proof by itself.
- Production parity requires independently matched source, build, deployment, runtime, branch, repository, database identity, and migration head.
- Require authenticated owner health verification; anonymous responses cannot certify authenticated admin health.
- No merge/deploy/migration/DNS/secret mutation until the exact candidate and required owner gates are verified.
