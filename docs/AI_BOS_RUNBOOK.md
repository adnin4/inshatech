# 📘 IINSHA AI-BOS: SOVEREIGN OPERATIONAL RUNBOOK

## 1. Operational Controls:
* **Global Emergency Kill-Switch:** Accessible via `orchestrator.triggerGlobalKillSwitch()`. Halts all autonomous tasks immediately.
* **Level 3 Approval Protocol:** Any deployment, refund, or payout requires the Founder's cryptographic sign-off (`IINSHA_OWNER_AUTH_2026`).
* **Packaging Procedure:** Run `npm run package:clean` to regenerate `insha zip all documentes 1.zip` omitting all secrets.

## 2. Disaster Recovery:
* Rollback deployment via Cloudflare Pages commit rollback.
* Zero-trust database restore from Supabase automated snapshots.
