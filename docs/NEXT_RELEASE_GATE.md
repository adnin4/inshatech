# Next release gate

The current `master` is authoritative. Legacy PRs are closed and are not merge sources.

## Gate order
1. Authoritative CI for the exact master SHA.
2. Public surface HTTP smoke.
3. Live `/api/version` SHA parity.
4. Production browser/route smoke.
5. Public content-truth audit.
6. Provider activation only after live certification.
7. Real transaction and first-pilot evidence.

## Fail-closed rules
- Missing provider => `NOT_CONFIGURED`.
- Missing live SHA evidence => no `LIVE_VERIFIED`.
- Route smoke failure => release blocked.
- Browser/runtime failure => release blocked.
- Real customer evidence is required for full mission certification.
