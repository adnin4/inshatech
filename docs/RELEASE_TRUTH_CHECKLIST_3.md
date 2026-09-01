# Release Truth Checklist

Required before production verification:

- exact master SHA recorded
- Cloudflare production deployment confirmed
- public `/api/version` matches master SHA
- production browser certification passes
- live surface smoke passes
- functional, visual, accessibility, and security regressions pass
- rollback path is available

Missing any required item means the release is not verified.
