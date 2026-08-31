# 📋 IINSHA AI-BOS: CAPABILITY REGISTRY & PROVIDER INTEGRITY MATRIX

```text
================================================================================
          🌐 IINSHA AI-BOS: REGISTERED CAPABILITIES & PROVIDER HEALTH
================================================================================
```

| Capability / Tool ID | Provider Adapter | Permission Level | Health Status | Verification Mechanism |
| :--- | :--- | :--- | :--- | :--- |
| `search_knowledge` | Static Canonical JSON | LEVEL_0_READ | HEALTHY | In-Memory Deterministic Match |
| `get_services` | Canonical Catalog | LEVEL_0_READ | HEALTHY | Knowledge Schema Hash Check |
| `create_quote` | Sales Engine Core | LEVEL_1_DRAFT | HEALTHY | Deterministic BDT/USD Calculation |
| `send_whatsapp` | WhatsApp Cloud API | LEVEL_2_EXECUTE | FAIL_CLOSED | Mock/Live Adapter Dispatch |
| `run_tests` | Node.js Test Runner | LEVEL_0_READ | HEALTHY | Subprocess Execution with Exit Codes |
| `create_deployment` | Cloudflare Pages CLI | LEVEL_3_APPROVAL| HEALTHY | SHA-256 Release Manifest Gate |
| `process_payout` | Banking / Merchant API | LEVEL_4_RESTRICTED| NOT_CONFIGURED| Strict Fail-Closed (Owner Only) |
