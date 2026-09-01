# IINSHA AI-BOS — Live Truth Roadmap

## Gate 1 — Deployment truth

GitHub `master` → Cloudflare Pages Native Git deployment → deployment metadata → live runtime.

Cloudflare Git integration supports automatic builds on connected branches and PR preview deployments. Production branch controls should keep `master` as the single production authority. citeturn861629search0turn861629search1

## Gate 2 — Runtime parity

Require:

`GitHub master SHA == Cloudflare deployment commit_hash == /api/version SHA`

Cloudflare deployment metadata exposes the deployment trigger commit hash, so parity should be checked against deployment metadata where available, not only page HTML. citeturn896863search3turn896863search6

## Gate 3 — Browser certification

After parity only:

- all 10 public routes
- navigation
- buttons
- tabs
- forms
- AI surfaces
- safe API flows
- console/network errors
- mobile/desktop
- accessibility
- visual regression

## Gate 4 — Business proof

Real payment → webhook → ledger → project → build → QA → client acceptance → delivery → support → renewal.

## Gate 5 — Learning proof

Experience → candidate → benchmark → controlled promotion → monitoring → rollback.

## Safety invariant

No application/UI/database/payment/AI behavior is changed by the live-truth gate itself. A live certification result is never inferred from code presence or synthetic evidence.
