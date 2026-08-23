# 🛡️ CANONICAL_SOURCE_REPORT.md — Canonical Repository & Release Parity Authority

## 📌 Executive Summary
This document establishes the single source of truth for the IINSHA AI-BOS codebase, deployment topology, and release authority across GitHub, Cloudflare Pages, Supabase, and local development workspaces.

---

## 🔒 Canonical Authority State

| Invariant / Authority Dimension | Verified Target / Value | Authority Status |
| :--- | :--- | :---: |
| **Canonical Repository** | \`adnin4/inshatech\` (GitHub) | 🟢 **CANONICAL_PRIMARY** |
| **Authoritative Production Branch** | \`master\` | 🟢 **LOCKED_AUTHORITATIVE** |
| **Authoritative Production Commit SHA** | \`8c0152bb912083637852ef4275c734e6d58b90ab\` | 🟢 **PARITY_MATCH (0 Divergence)** |
| **Live Edge Hosting Target** | Cloudflare Pages (\`inshatech.pages.dev\`) | 🟢 **AUTHORITATIVE_PRODUCTION** |
| **Supabase PostgreSQL Project** | \`inshatech-db\` (28 Tables, 100% RLS Enabled) | 🟢 **ACTIVE_HEALTHY** |
| **Local Workspace Staging** | \`portfolio-showcase\` | 🟢 **SYNCHRONIZED** |

---

## 🔄 4-Way Cryptographic Release Parity
$$\mathbf{Git\text{ }Master\text{ }HEAD \equiv CI\text{ }Build\text{ }Metadata \equiv Cloudflare\text{ }Deploy\text{ }Target \equiv Live\text{ }Version\text{ }Endpoint \equiv 8c0152bb912083637852ef4275c734e6d58b90ab}$$

---

## 🛡️ Production Governance Rules
1. **Single Production Branch:** \`master\` is the sole authoritative branch for live deployments.
2. **No Direct Production Commits:** All changes must originate from feature/safety branches, pass the unified \`npm test\` CI gate, and be merged via Pull Request.
3. **Rollback Immutability:** Baseline release tag \`foundation-baseline-v1\` pinned to \`8c0152bb912083637852ef4275c734e6d58b90ab\` enables sub-second Cloudflare Instant Rollback in disaster recovery scenarios.
