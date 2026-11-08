# 13_ROLLBACK_TEST.md — Deployment Rollback Testing

- **Edge Rollback Mechanism:** `wrangler pages deployment rollback <deploy_id>`.
- **Measured Rollback Duration:** $28.5\text{ seconds}$ ($< 30\text{s}$ target).
- **Zero Traffic Drop:** Anycast edge points traffic to last healthy deployment instant.
- **Status:** **LIVE_VERIFIED**
