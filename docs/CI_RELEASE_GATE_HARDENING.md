# IINSHA AI-BOS — CI Release Gate Hardening

This document records two fail-closed CI corrections:

1. TruffleHog hardcoded-secret scanning must fail the job when the scan fails; it must not be bypassed with `continue-on-error`.
2. Dependency installation must use the committed lockfile via `npm ci`; falling back to `npm install` can mask lockfile/package drift in a release gate.

The existing staging preview parity check remains intentionally a staging check. It must not be represented as proof of production deployment or live production SHA parity.
