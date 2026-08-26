# Release guardrails — current baseline

This file documents the current release rules only; it contains no deployment credentials and no runtime business logic.

- `master` is the only production candidate.
- Legacy PRs are closed and must not be merged wholesale.
- Required evidence before `LIVE_VERIFIED`: exact-SHA CI, production deploy success, `/api/version` parity, browser/route smoke, and public content parity.
- Missing provider credentials keep the provider `NOT_CONFIGURED`.
- Real customer evidence is required before full autonomous-company certification.
