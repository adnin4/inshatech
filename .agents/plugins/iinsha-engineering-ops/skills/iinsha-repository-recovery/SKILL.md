---
name: iinsha-repository-recovery
description: Use when auditing or repairing Git history, V7 local candidate, master/main divergence, stacked PRs, workflow failures, source drift, or release identity in adnin4/inshatech.
---
# Repository Recovery and Source Reconciliation

## Read-only discovery
Run from the actual repository root:

```bash
git status --short
git branch --show-current
git branch -avv
git log -12 --oneline --decorate
git remote -v
git rev-parse HEAD
git status --porcelain=v1
```

Then inspect the exact candidate and refs. Do not assume old SHAs exist.

## Safe source reconciliation
- Verify each SHA using `git cat-file -t <sha>` and `git show --no-patch --format=fuller <sha>`.
- Fetch remote refs only when authenticated and approved; fetching does not imply merging.
- Compare branch ancestry and actual file diffs before choosing a release branch.
- Inspect PR base/head and stacked dependency before any merge.
- Inspect exact-SHA workflow runs, all jobs, annotations, skipped steps, and artifacts.
- Keep `main` and `master` distinct until production branch authority is independently confirmed.
- Never reset, force-push, clean untracked files, or overwrite a user's worktree to align reports.

## Fix workflow defects
For each confirmed issue: reproduce → identify file/line → root cause → minimal complete patch → regression test → focused rerun → full relevant suite. Preserve all feature contracts. Avoid duplicate workflows and duplicate evidence files.

## Required report
Show local HEAD, remote branch SHAs, candidate ancestry, PR chain, latest run SHA/conclusion, required check list, and exact mismatch evidence. If a tool cannot retrieve an item, use NOT_VERIFIED.
