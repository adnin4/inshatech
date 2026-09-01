# IINSHA AI-BOS — Live Truth Gates

## Gate 1 — Source
Current authoritative master: `364f47c47f94d3f89182e0148c75badc4b94834a`.

## Gate 2 — Deploy
Cloudflare Pages Native Git Integration is the intended single production deployment authority.

## Gate 3 — Runtime parity
`GitHub master SHA == Cloudflare deployment commit hash == /api/version SHA`

## Gate 4 — Public routes
All ten core routes must return HTTP 200, no redirect location, and non-empty content.

## Gate 5 — Browser
Chromium must pass safe navigation, interaction, console and network checks.

## Gate 6 — Visual/accessibility
Unexpected visual regression or accessibility regression blocks release.

## Gate 7 — Business proof
Real payment and real customer lifecycle evidence are separate and cannot be inferred from synthetic tests.
