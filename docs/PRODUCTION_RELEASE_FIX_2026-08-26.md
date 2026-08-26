# Production release gate fix — 2026-08-26

## Root cause
The production release workflow's authoritative-check step had a malformed shell heredoc indentation. The `NODE` terminator and closing command-substitution delimiter were indented, so Bash never closed the heredoc and the release job failed before Cloudflare deployment.

## Fix
- Align the heredoc terminator at shell column zero inside the workflow block.
- Align the closing command-substitution delimiter with `gate=$(...)`.
- No application, database, payment, provider, or Cloudflare behavior is changed.

## Required proof after merge
1. Authoritative CI checks complete successfully for the exact merge SHA.
2. Production release workflow reaches the deployment step.
3. `/api/version` exposes the exact deployed SHA.
4. Production browser/surface smoke passes.
5. Only then may the release be marked `LIVE_VERIFIED`.
