Production release gate fix index.

Root cause: malformed Bash heredoc indentation in exact-SHA check polling.
Fix scope: workflow parsing only.
Certification after merge: authoritative CI, production deployment, exact /api/version SHA parity, production browser/surface smoke.