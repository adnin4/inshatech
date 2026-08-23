# IINSHA Staging Verification Policy

## Release invariant

A staging deployment is not considered verified merely because Cloudflare reports a successful deploy.

The staging release gate requires:

1. Build and regression tests pass.
2. The expected staging URL responds successfully.
3. `/api/sre/health` returns a successful response.
4. `/api/version` returns a SHA equal to the release commit.
5. Browser smoke runs against the staging target, never production.
6. Core routes return < 400.
7. Internal links and critical scripts are reachable.
8. Key customer-facing interactions are executable.
9. Browser and console errors are zero for the tested flows.

## Production protection

Until all checks are green, the staging change must not be merged to `master`.

Provider credentials and real external side effects remain a separate activation gate.
