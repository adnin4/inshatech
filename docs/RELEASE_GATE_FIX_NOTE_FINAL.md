# Production release gate fix

The exact-SHA production release gate had a malformed Bash heredoc indentation and failed before deployment. The release branch fixes only the shell parsing. Application, database, payments, providers, and Cloudflare application behavior are unchanged.

Required post-merge proof remains: authoritative CI success, production deployment, exact `/api/version` SHA parity, and browser/surface smoke.