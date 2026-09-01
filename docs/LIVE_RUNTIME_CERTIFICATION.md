# IINSHA AI-BOS — Live Runtime Certification

This document defines the post-deployment live verification gate for the canonical Cloudflare Pages Git integration.

## Release rule

A production release is `LIVE_VERIFIED` only when all of the following are true for the same Git SHA:

1. CI certification gates pass.
2. Cloudflare Native Git Integration deploys the canonical `master` branch.
3. `https://inshatech.pages.dev/api/version` returns the exact `github.sha` for the release.
4. Production browser certification passes for the public website.
5. Live surface smoke passes.

`LOCAL_VERIFIED` and `CI_PASS` must never be promoted to `LIVE_VERIFIED` without the runtime checks above.

## Safety invariants

- This workflow does not deploy application code.
- This workflow does not mutate Supabase.
- This workflow does not execute real payments.
- This workflow does not trigger destructive admin actions.
- UI/UX files are not modified by the verification job.

## Expected state model

```text
master push
  -> Cloudflare native deployment
  -> wait for /api/version parity
  -> browser certification
  -> live surface smoke
  -> LIVE_VERIFIED or BLOCKED
```

Any timeout, SHA mismatch, route failure, console critical error, or critical network failure is a release verification failure.
