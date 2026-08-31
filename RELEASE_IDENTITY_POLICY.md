# Release Identity Policy

The Git commit SHA embedded in a committed repository file must never be treated as authoritative production identity. A new commit necessarily changes its own SHA.

## Sources of truth

- Source identity: CI `GITHUB_SHA`.
- Cloudflare Pages runtime identity: platform-provided commit SHA (for example `CF_PAGES_COMMIT_SHA`).
- Production parity: compare the runtime SHA to the explicitly approved release SHA recorded by the release workflow, not to a self-embedded SHA snapshot.
- `CANONICAL_SYSTEM_STATE.json` and `build-info.json` are descriptive metadata only.

## Verification rule

`LIVE_VERIFIED` requires externally observed production evidence. Repository file presence, local fixtures, or a committed metadata field must never be sufficient to mark production live.

## Safety

This policy does not alter UI, application behavior, database schema, payment logic, provider credentials, or agent permissions.
