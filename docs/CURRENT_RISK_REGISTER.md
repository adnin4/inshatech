# ⚠️ IINSHA AI-BOS — CURRENT RISK REGISTER & MITIGATION MATRIX

| Risk ID | Threat Description | Severity | Mitigation Strategy | Status |
| :---: | :--- | :---: | :--- | :---: |
| **RSK-01** | Unverified / Stale Model Marketing Claims | HIGH | Purged obsolete model names; calibrated copy to current Gemini 2.0 / Claude 3.5. | **RESOLVED** |
| **RSK-02** | Broken GitHub & Domain Links (404s) | HIGH | Fixed all links to `adnin4/inshatech` and `inshatech.pages.dev`. | **RESOLVED** |
| **RSK-03** | 1-Click Authentication Bypass in Login Modal | CRITICAL | Removed bypass button; enforced HMAC JWT verification. | **RESOLVED** |
| **RSK-04** | Client-Side Price Override in Checkout | HIGH | Enforced server-authoritative pricing calculations in `/api/checkout`. | **RESOLVED** |
| **RSK-05** | Self-Referral Affiliate Commission Theft | MEDIUM | Active IP/domain collision fraud radar scoring (score >= 60 blocked). | **RESOLVED** |
| **RSK-06** | Unused DB Indexes Reported by Supabase Advisor| LOW | Preserved indexes safely; index cleanup gated by query workload evidence. | **MONITORED** |
| **RSK-07** | Automated Regression on Code Changes | CRITICAL | Active `scratch/regression_firewall.js` in `npm test` and `npm run certify`. | **ACTIVE** |
