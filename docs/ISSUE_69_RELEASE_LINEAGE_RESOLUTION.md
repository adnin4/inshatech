# ISSUE #69: RELEASE EVIDENCE LINEAGE RESOLUTION

## 1. Executive Summary
Issue #69 identified an architectural vulnerability in release evidence lineage:
When a pull request triggers GitHub Actions, `GITHUB_SHA` points to a synthetic merge commit (`refs/pull/<pr>/merge`), whereas `actions/checkout` with `ref: ${{ github.event.pull_request.head.sha }}` checks out the PR head commit (`refs/pull/<pr>/head`).

If diagnostic runners prioritize `GITHUB_SHA` over the actual checked-out filesystem HEAD, the generated evidence manifests (`summary.json`, `CI_FAILURE_EVIDENCE.json`, `summary.md`, `CI_FAILURE_EVIDENCE.md`) record a synthetic merge commit that does not exist in the author's git branch history, creating false lineage chains and preventing cryptographic release identity reconciliation.

In addition, workstation-specific absolute paths in Git executable detection risked leaking developer machine environment details into shared runners.

---

## 2. Root Cause Analysis
1. **GitHub Actions Ref Discrepancy**:
   - `github.sha` on `pull_request` events evaluates to `refs/pull/:number/merge`.
   - `actions/checkout` explicitly checks out `${{ github.event.pull_request.head.sha || github.sha }}`.
   - Any script reading `process.env.GITHUB_SHA` without distinguishing PR head vs workflow merge commit captures the synthetic merge SHA.
2. **Developer Workstation Fallback**:
   - Git detection included workstation-specific paths (`LOCALAPPDATA/GitHubDesktop`).
   - The runner must resolve `git` cleanly via system PATH, `GIT_EXEC_PATH`, or standard system directories (`ProgramFiles`), with `LOCALAPPDATA` handled generically without hardcoding developer usernames.

---

## 3. Resolution Implementation

### A. Lineage-Aware Git Resolution (`scripts/ci_evidence_runner.mjs`)
`resolveGitInfo()` was created to resolve both the authoritative source SHA and the full cryptographic lineage:
- Checked-out SHA from `git rev-parse HEAD`
- PR head SHA from `PR_HEAD_SHA` or checked-out SHA
- Workflow SHA from `GITHUB_SHA`
- Workflow ref from `GITHUB_REF`
- Explicit boolean flag `synthetic_merge_detected`

### B. CI Workflow Environment Injection (`.github/workflows/ci-evidence-diagnostics.yml`)
The workflow step explicitly passes both `PR_HEAD_SHA` and `WORKFLOW_SHA` to the evidence runner.

### C. Evidence Manifest Schema Upgrade
The summary artifacts now explicitly record the full cryptographic lineage and whether a synthetic merge was detected in `release_lineage`.

---

## 4. Verification & Validation
1. **Unit Tests**: `node scripts/test_release_identity.mjs` -> PASS
2. **Full CI Evidence Diagnostics (Gate 0A-0H)**: `node scripts/ci_evidence_runner.mjs` -> 24/24 suites passed (100% deterministic green).
3. **Visual Regression Baseline (Gate 0)**: `node scripts/visual_regression_baseline.mjs` -> 8/8 visual baselines locked (100%).
4. **Lineage Evidence Inspection**: Both `summary.json` and `summary.md` accurately reflect `release_lineage` with zero workstation leakage.
