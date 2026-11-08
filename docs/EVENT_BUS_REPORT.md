# ⚡ EVENT_BUS_REPORT.md — Event-Driven Operating System

## 🧭 System Event Flow
```text
lead.created -> lead.qualified -> proposal.created -> proposal.accepted -> payment.completed -> project.created -> task.completed -> qa.passed -> deployment.success -> ticket.created -> renewal.due -> churn_risk.detected -> skill.created
```
- Implemented in `ai_brain/company_event_bus.js` with Dead-Letter Queue (DLQ) buffer and structured audit receipts.
