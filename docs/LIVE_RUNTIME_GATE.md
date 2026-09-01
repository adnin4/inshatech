# Live Runtime Gate

The production release gate must observe the exact master SHA at `/api/version` and pass live browser/surface checks. Missing or stale live identity fails closed.
