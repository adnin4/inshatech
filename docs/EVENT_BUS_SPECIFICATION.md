# ⚡ EVENT_BUS_SPECIFICATION.md — Event-Driven Architecture

## 14 Canonical Business Events
1. `lead.created` — Visitor completes AI qualification.
2. `order.created` — Customer initiates catalog checkout.
3. `payment.pending` — Payment intent generated on Stripe/bKash.
4. `payment.completed` — Signed webhook verified; order marked paid.
5. `payment.failed` — Gateway declined; notification queued.
6. `refund.requested` — Customer requests refund; L3 approval task created.
7. `project.started` — Fulfillment DAG activated upon payment.
8. `project.completed` — All milestone deliverables approved by customer.
9. `agent.started` — Dynamic swarm assigns specialist agent.
10. `agent.failed` — Agent encounters timeout; fallback triggered.
11. `agent.blocked` — Agent attempts L3/L4 tool without capability token.
12. `security.alert` — OWASP prompt firewall intercepts attack.
13. `payout.pending` — Affiliate commissions reach payout threshold.
14. `payout.completed` — Owner approves ledger payout disbursement.
