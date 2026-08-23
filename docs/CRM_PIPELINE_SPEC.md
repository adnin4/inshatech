# 📈 CRM_PIPELINE_SPEC.md — Phase 20 CRM Pipeline Architecture

```text
Visitor ──► Lead Discovery ──► AI Solution Qualification ──► Custom Quote ──► Checkout ──► Customer ──► Project Milestone DAG
```
- **Lead Qualification Score:** Computed in `ai_brain/sales_engine.js` based on industry, pain, channel, budget, timeline ($0-100$).
- **Central CRM Storage:** Synchronized with `public.ibos_leads` and `public.ibos_customer_contacts`.
