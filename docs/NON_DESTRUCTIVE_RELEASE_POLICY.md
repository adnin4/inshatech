# Non-Destructive Release Policy

All live-truth verification changes must remain isolated from product code.

Allowed:
- read-only HTTP checks
- deployment metadata checks
- CI verification
- browser smoke that uses safe, non-mutating interactions
- evidence generation

Forbidden in generic release checks:
- real payment charges
- refunds
- deletions
- production data mutation
- kill-switch actions
- credential rotation
- customer notifications

Product/UI changes require their own PR and visual/functional regression gates.
