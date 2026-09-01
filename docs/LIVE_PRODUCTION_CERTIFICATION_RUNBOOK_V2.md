# IINSHA Live Production Certification Runbook

## Purpose

Make live production verification evidence-driven without changing application UI/UX or business logic.

## Release truth

A master push is not production-verified until the public runtime reports the exact release SHA and the real browser suite passes.

```text
master SHA = Cloudflare deployed SHA = /api/version SHA = browser-observed runtime SHA
```

## Safety

- No application/UI/CSS changes in the certification change.
- No production DB mutation from CI.
- No real payment/refund from CI.
- No destructive admin action from CI.
- No secrets in source.
- Missing live parity is a hard failure.

## Surfaces

/, /index.html, /store.html, /marketplace.html, /compare.html, /blog.html, /portal.html, /admin.html, /affiliate.html, /affiliate-login.html, /affiliate-dashboard.html

## Browser

Use isolated Playwright contexts and user-facing locators. Verify navigation, safe buttons, tabs, forms, search/filter controls, loading/error states, console errors, failed requests, and responsive layouts.

## Payment

CI may verify checkout surfaces and non-destructive contracts. Actual charges/refunds require a separately authorized live procedure and must never be simulated as LIVE_VERIFIED.

## Truth states

PASS / FAIL / BLOCKED / NOT_CONFIGURED / LIVE_VERIFIED

LIVE_VERIFIED requires exact SHA parity plus live browser evidence.
