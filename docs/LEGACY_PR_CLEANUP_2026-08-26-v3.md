# Legacy PR cleanup

The current `master` release path is authoritative. Legacy PRs are not production inputs.

Closed as superseded: PR #4, #6, #7, #11, #12.

Useful tests or policy logic must be ported to current `master` through a fresh, current-base change with green CI. No legacy PR should be merged wholesale.
