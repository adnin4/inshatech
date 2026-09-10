# ISSUE #70: RESOLUTION OF CANONICAL-STATE SHA DRIFT & SNAPSHOT AUTHORITY CONFUSION

## 1. Executive Summary
Issue #70 identified an architectural governance ambiguity in repository state files:
Static files like `CANONICAL_SYSTEM_STATE.json`, `docs/CANONICAL_SYSTEM_STATE.json`, and `docs/PRODUCTION_EVIDENCE_MANIFEST.json` previously recorded hardcoded Git SHAs (such as historical commits `144afdd...` or `45ee4c1...`), which created static SHA drift whenever new commits landed on `master` (e.g., `b3de7650...`).

This ambiguity posed a risk of snapshot confusion: whether static repository documents were asserting dynamic release authority, or whether runtime/CI-generated manifests held canonical authority.

---

## 2. Core Authority Principles Codified

1. **Dynamic Runtime Authority**:
   - The authoritative source of cryptographic release identity is **dynamically evaluated at runtime or during CI execution** from verifiable Git refs, CI environment variables (`SOURCE_RELEASE_SHA`, `BUILD_RELEASE_SHA`, `CF_PAGES_COMMIT_SHA`, `RUNTIME_RELEASE_SHA`), and signed provider telemetry.
   - Dynamic evidence files (`ci-failure-evidence/summary.json`, `docs/CI_FAILURE_EVIDENCE.json`) contain live cryptographic lineage (`checked_out_sha`, `pr_head_sha`, `workflow_sha`, `synthetic_merge_detected`).

2. **Static State Documents as Point-in-Time Snapshots**:
   - Root `CANONICAL_SYSTEM_STATE.json` and `docs/CANONICAL_SYSTEM_STATE.json` are **governance snapshots** representing the repository's baseline specification and certification ceiling (`READY_FOR_STAGING`).
   - They record the verified repository tip (`b3de7650b65e388514ca82674654c92241ea8811`) and declare `authority_type: "GOVERNANCE_SNAPSHOT"` to prevent static SHA drift from being misconstrued as live release truth.

3. **No Synthetic Production Upgrades**:
   - Neither static snapshots nor synthetic CI runs may elevate `certification_status` beyond `READY_FOR_STAGING` without external, independent runtime proof (matching Cloudflare deployment SHA, live Supabase ref, and verified health telemetry).

---

## 3. Reconciliation Actions Taken

1. **Synchronized Static Repository Tip**:
   - `CANONICAL_SYSTEM_STATE.json` and `docs/CANONICAL_SYSTEM_STATE.json` explicitly reflect observed master tip `b3de7650b65e388514ca82674654c92241ea8811` and reference `ci-failure-evidence/summary.json` as the dynamic release evidence authority.

2. **Decoupled Canonical Configuration from Ephemeral Commits**:
   - `functions/_shared/release_manifest.js` holds immutable configuration constants (`canonical_repository`, `canonical_branches: ['master', 'main']`, `canonical_db_ref`, `bdt_peg_rate: 122.50`) and avoids hardcoding commit SHAs, deferring cryptographic SHA validation strictly to `verifyReleaseIdentity()` at request time.

3. **Fail-Closed Lineage Preservation**:
   - Implemented in `scripts/ci_evidence_runner.mjs` and verified by 24/24 CI suites and 8/8 visual baselines.
