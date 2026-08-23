# 📡 API_INVENTORY.md — Phase 17 API Inventory

| Path | Method | Auth Required | Rate Limit | Status |
| :--- | :---: | :---: | :---: | :---: |
| `/api/solution-finder` | POST | No | IP-based | **VERIFIED** |
| `/api/create-checkout` | POST | No | IP-based | **VERIFIED** |
| `/api/stripe-webhook` | POST | HMAC | Webhook | **VERIFIED** |
| `/api/payments/bkash-tokenized` | POST | No | IP-based | **VERIFIED** |
| `/api/webhook/bkash-sns-ipn` | POST | x509/HMAC | Webhook | **VERIFIED** |
| `/api/auth/session` | POST | No | 5/min | **VERIFIED** |
| `/api/admin/gate` | GET | Session Token | High | **VERIFIED** |
| `/api/ai/tool-broker` | POST | Capability Token | Scoped | **VERIFIED** |
| `/api/sre/health` | GET | No | Public | **VERIFIED** |
