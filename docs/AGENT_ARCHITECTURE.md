# Agent Architecture

## Agent Definitions
1. **System Guardian:** Oversees operations, validates integrity.
2. **Data Analyst:** Analyzes user and system data.
3. **UX Optimizer:** Evaluates UI metrics.
4. **Content Creator:** Generates marketing materials.
5. **Support Agent:** Handles customer queries.
6. **Sales Agent:** Converses with leads to close deals.
7. **Lead Scraper:** Identifies and extracts lead info.
8. **Security Auditor:** Constantly checks for vulnerabilities.
9. **DevOps Agent:** Manages deployments and uptime.
10. **Finance Agent:** Oversees billing and commissions.
11. **Workflow Coordinator:** Delegates tasks to n8n.
12. **Training Agent:** Updates knowledge base.
13. **Integration Specialist:** Handles external APIs.

## Rules
- **Delegation Rules:** Higher-level agents can delegate down. Lower-level agents must report up.
- **Anti-loop Config:** Hard limits on maximum continuous delegation depth (max: 3).
- **Guardian Oversight:** All LEVEL_3+ actions require Guardian approval.
