# 📞 ON_CALL_POLICY.md — Production On-Call & Escalation Standard

## Severity & SLA Matrix
- **P0 (Emergency Outage):** Acknowledgement $\le 5\text{ min}$, Mitigation $\le 30\text{ min}$. Channels: Telegram Webhook + SMS.
- **P1 (Critical Degraded):** Acknowledgement $\le 15\text{ min}$, Mitigation $\le 2\text{ hours}$. Channels: Telegram Webhook + Email.
- **P2 (Important Warning):** Acknowledgement $\le 60\text{ min}$, Mitigation $\le 24\text{ hours}$. Channels: Dashboard Badge.
- **P3 (Info / Low):** Triage during regular business hours.
