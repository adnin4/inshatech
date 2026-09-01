# IINSHA AI-BOS — Production Release Truth Runbook

1. Merge only from the current `master` baseline after PR checks pass.
2. Cloudflare Pages Native Git Integration remains the canonical production deployment authority.
3. Wait for the Cloudflare production deployment to complete.
4. Verify Cloudflare deployment metadata commit hash, where available, matches the exact master SHA.
5. Verify `GET /api/version` reports the same SHA.
6. Verify all 10 core public routes return HTTP 200 without redirects or empty bodies.
7. Run Chromium browser certification against the live URL.
8. Run visual and accessibility regression checks.
9. Only then label the public site `LIVE_VERIFIED`.
10. Keep real payment and real customer evidence as separate gates.

Safety: all generic live-truth probes are read-only. They must not trigger payments, refunds, deletions, kill-switches, production mutations, or customer notifications.
