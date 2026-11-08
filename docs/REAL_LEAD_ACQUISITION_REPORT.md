# 🎯 REAL_LEAD_ACQUISITION_REPORT.md — Real Lead Acquisition Engine

## 🧭 Architecture
- **Provider Abstraction (`LeadSourceAdapter`):** Search providers, Business directories, CRM imports, Customer-provided leads, Referral leads, Configured external providers.
- **Strict Classification:** `REAL_PROSPECT`, `SYNTHETIC_DEMO`, `MANUAL`, `REFERRAL`, `IMPORTED`.
- **Synthetic Quarantine:** Demo data strictly tagged `SYNTHETIC_DEMO` and barred from entering production outreach queues.
- **Multi-Factor Opportunity Scoring:** ICP Fit (30%) + Intent (25%) + Pain (20%) + Budget (15%) + Service Fit (10%).
