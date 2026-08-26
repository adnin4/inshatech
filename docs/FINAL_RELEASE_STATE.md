# Final release state

Current master is the sole release candidate.

Before production certification:
- exact-SHA CI must be green
- production deployment must succeed
- live `/api/version` must match the release SHA
- browser/route smoke must pass
- public content parity must pass

Only after those gates should external providers and real-customer activation proceed.
