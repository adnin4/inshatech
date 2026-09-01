# IINSHA AI-BOS — Release Truth Rules

A release cannot be called production-verified unless all mandatory evidence exists.

```text
CODE_PASS
AND SECURITY_PASS
AND DEPLOY_PASS
AND LIVE_SHA_PARITY
AND LIVE_ROUTE_PASS
AND BROWSER_PASS
AND VISUAL_PASS
= LIVE_VERIFIED
```

A synthetic test, local preview, static report, or generated certificate cannot substitute for live runtime evidence.

High-impact actions (payments, refunds, deletion, kill-switch, production mutations) require dedicated controlled tests and must not be triggered by generic public-browser smoke tests.
