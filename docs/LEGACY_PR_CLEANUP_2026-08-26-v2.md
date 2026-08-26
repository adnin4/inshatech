# Legacy PR cleanup

The current `master` release path is authoritative. Legacy PRs are not production inputs.

## Closed as superseded
- PR #4: autonomous-company Wave 1 branch superseded by merged activation and release-gate work.
- PR #6: staging activation branch superseded by the current release path.
- PR #7: staging verification branch superseded by the current release path.
- PR #11: production-truth branch superseded by the current fail-closed release gate.
- PR #12: public-site recovery branch superseded by the new current-master public surface gate.

No legacy PR should be merged wholesale. Useful tests or policy logic must be ported to current `master` through a fresh, current-base change with green CI.
