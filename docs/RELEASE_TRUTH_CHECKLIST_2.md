# Release Truth Checklist

Before production verification:

- master SHA recorded
- Cloudflare deployment confirmed
- live `/api/version` SHA confirmed
- required browser suites green
- functional regression green
- visual regression green
- accessibility regression green
- security regression green
- rollback path documented

If any item is missing, status remains BLOCKED or NOT_VERIFIED.
