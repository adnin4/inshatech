# 14-known-risks.md — Known Risks & Mitigation Ledger

1. **Live Gateway Credentials:** Currently configured with sandbox test credentials. *Mitigation: Production secrets injected via Cloudflare dashboard upon live customer pilot.*
2. **External Voice/WhatsApp Connectors:** Not yet bound to live Meta/Twilio accounts. *Mitigation: Graceful router degradation returning safe configuration instructions.*
