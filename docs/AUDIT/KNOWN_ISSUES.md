# 14_KNOWN_ISSUES.md — Production Known Issues & Pilot Gaps

| Issue ID | Domain | Description | Current Mitigation | Severity |
| :--- | :--- | :--- | :--- | :---: |
| **GAP-01** | Payments | Live Stripe Secret Key unconfigured | Sandbox test keys active | **P1 (Sandbox Ready)** |
| **GAP-02** | Payments | Live bKash App Key unconfigured | Sandbox PGW active | **P1 (Sandbox Ready)** |
| **GAP-03** | Integrations | Meta WhatsApp Cloud API unconfigured | Router gracefully degrades | **P2 (Optional)** |
| **GAP-04** | Integrations | Twilio Voice Engine unconfigured | Router gracefully degrades | **P2 (Optional)** |
| **GAP-05** | APM | External Sentry DSN unconfigured | Edge Health API active | **P2 (Optional)** |
