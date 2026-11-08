# 🚨 INCIDENT_RUNBOOK.md — SRE Incident Remediation Guide

## Incident Response Standard Operating Procedure (SOP)
1. **Detection:** Automated Telegram alert or SRE Health API ping failure.
2. **Containment:**
   - If AI Swarm anomaly: Trigger Sovereign Emergency Kill-Switch on `admin.html`.
   - If breaking deployment: Execute `wrangler pages deployment rollback <deploy_id>`.
3. **Recovery:** RTO target $< 30\text{s}$ for edge rollback, $< 5\text{min}$ for database failover.
4. **Postmortem:** Issue blameless root cause analysis within 24 hours.
