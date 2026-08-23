# 🔍 REAL_GAP_MATRIX.md — Phase 17 Real Gap Matrix

| ID | System | Requirement | Current Evidence | Status | Severity | Required Action |
|:---|:---|:---|:---|:---:|:---:|:---|
| **GAP-01** | Payments | Live Stripe Secret Key | Sandbox Keys Tested | **PARTIAL** | HIGH | Provision Live Stripe Merchant Keys |
| **GAP-02** | Payments | Live bKash App Key | Sandbox PGW Tested | **PARTIAL** | HIGH | Provision Live bKash Merchant App Key |
| **GAP-03** | Integrations | Meta WhatsApp Cloud API | Router returns `NOT_CONFIGURED` | **NOT_CONFIGURED** | MEDIUM | Provision Meta Cloud API Token & Phone ID |
| **GAP-04** | Integrations | Twilio SIP Voice Engine | Router returns `NOT_CONFIGURED` | **NOT_CONFIGURED** | MEDIUM | Provision Twilio SIP Domain & Auth Token |
| **GAP-05** | Integrations | Transactional SMTP Mailer | Router returns `NOT_CONFIGURED` | **NOT_CONFIGURED** | MEDIUM | Provision Live Resend / SMTP Password |
| **GAP-06** | Observability | External APM Aggregator | CF Logs & Health API Active | **PARTIAL** | LOW | Connect Sentry / Datadog DSN |
