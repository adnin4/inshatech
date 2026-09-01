# IINSHA Live Production Certification Runbook

## Purpose

Make live production verification evidence-driven without changing application UI/UX or business logic.

## Release truth

A master push is not production-verified until the public runtime reports the exact release SHA and the real browser suite passes.

```text
master SHA
  = Cloudflare deployed SHA
  = /api/version SHA
  = browser-observed runtime SHA
```

## Safety rules

- No application/UI/CSS changes in this release-certification change.
- No production database mutation.
- No real payment transaction from CI.
- No destructive admin action from CI.
- No secrets stored in source.
- If live parity is missing, fail closed.

## Live surfaces

- /
- /index.html
- /store.html
- /marketplace.html
- /compare.html
- /blog.html
- /portal.html
- /admin.html
- /affiliate.html
- /affiliate-login.html
- /affiliate-dashboard.html

## Browser certification

Use Playwright with isolated contexts and user-facing locators where possible. Validate navigation, safe buttons, tabs, forms, search/filter controls, loading/error states, console errors, failed network requests, and responsive layouts.

## Payment policy

Checkout surface may be verified automatically. Actual charges, refunds, and provider credentials require a separately authorized live transaction procedure and must never be simulated as LIVE_VERIFIED.

## Final states

- PASS: verified in the target environment with evidence.
- FAIL: a required assertion failed.
- BLOCKED: required external dependency or environment unavailable.
- NOT_CONFIGURED: integration is not enabled.
- LIVE_VERIFIED: only after exact SHA parity and live browser evidence.
