# Legacy PR cleanup

The current `master` release path is authoritative. Legacy PRs are not production inputs.

## Closed as superseded
- PR #4: autonomous-company Wave 1 draft; superseded by merged activation/production-gate work.

## Still under evaluation
- PR #6: staging activation gate
- PR #7: staging verification safety fix
- PR #11: production-truth gate
- PR #12: public-site functionality recovery

No legacy PR should be merged wholesale. Useful tests or policy logic must be ported to current `master` through a fresh, current-base change with green CI.
