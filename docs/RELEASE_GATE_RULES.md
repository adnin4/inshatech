# Release Gate Rules

A production release is verified only when:

- all mandatory CI suites pass
- Cloudflare deploy is confirmed
- `/api/version` matches the exact master SHA
- production browser smoke passes
- live surface smoke passes
- no unresolved P0/P1 exists

A skipped deployment or unknown live SHA is a failed release state, not success.