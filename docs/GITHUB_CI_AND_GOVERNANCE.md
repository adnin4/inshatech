# GitHub CI & Governance Architecture

**Repository:** `adnin4/inshatech`  
**Default Branch:** `master`  
**Evaluation Date:** 2026-11-03

---

## 1. Branch Topology & Commit Lineage

```mermaid
gitGraph
   commit id: "45ee4c1 (origin/main)"
   commit id: "b3de765 (origin/master)"
   branch "fix/release-identity-fail-closed-20260910 (PR #67)"
   commit id: "ddf90cf (PR #67 Head)"
   checkout master
   branch "fix/p0-admin-auth-release-identity"
   commit id: "ca236fb"
   commit id: "92bcbd1"
   commit id: "2ceef9e"
   commit id: "6b4aea7"
   commit id: "ecd050e (Local Head)"
```

### Lineage Inventory
1. **Remote Master Head**: `b3de7650b65e388514ca82674654c92241ea8811` (10 Sep 2026).
2. **Remote Main Head**: `45ee4c1f90f699686c71912a7f22598cbe3b0a74`.
3. **PR #67 Remote Head**: `ddf90cfe10a6934ff2a949be7cd9a0002a5c09ad` on `fix/release-identity-fail-closed-20260910` (Open, unmerged, 19 commits ahead, 3 commits behind).
4. **Local Feature Branch**: `fix/p0-admin-auth-release-identity` at `ecd050e` (Contains complete 18-agent workforce, server database probe, 8-classification release identity, and 26/26 CI suites).

---

## 2. PR Reconciliation Strategy (Zero Overwrite Policy)

As strictly mandated by COMMAND 4:
- Local branch `fix/p0-admin-auth-release-identity` and remote branch `fix/release-identity-fail-closed-20260910` are separate branches.
- Under NO circumstance should PR #67 be overwritten or force-pushed.
- Once authenticated via `gh auth login`, push `fix/p0-admin-auth-release-identity` as a distinct remote branch:
  ```bash
  git push -u origin fix/p0-admin-auth-release-identity
  ```
- Open a unified Pull Request against `master`, or create a merge commit cleanly combining `ddf90cf` and `ecd050e` after file-by-file review.

---

## 3. Required GitHub Branch Protection Rulesets

When enabling branch protection on `master`:
1. **Require Pull Request before merging**:
   - Minimum 1 approved review.
   - Dismiss stale pull request approvals when new commits are pushed.
   - Require review from Code Owners.
2. **Require status checks to pass before merging**:
   - Unique job names must be enforced:
     - `ci/deterministic-evidence-runner` (Suite 0A-0H, 26 suites)
     - `ci/18-specialist-workforce` (134/134 assertions)
     - `ci/cloudflare-preview-build`
3. **Require branches to be up to date before merging**.
4. **Do not allow force pushes or branch deletion**.
