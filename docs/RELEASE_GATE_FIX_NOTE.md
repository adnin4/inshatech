# Release gate fix

The production release gate previously failed before deployment because the exact-SHA check polling step contained malformed shell heredoc indentation. The `NODE` terminator and command-substitution delimiter were not aligned for Bash, causing an unexpected EOF.

The fix only repairs workflow parsing. Application behavior, database schema, payment behavior, provider configuration, and Cloudflare application behavior are unchanged.

Required post-merge evidence remains: authoritative CI success, production deployment, exact `/api/version` SHA parity, and production browser/surface smoke.