# Release gate fix v2

The production release workflow's exact-SHA polling step failed before deployment because a shell heredoc terminator was indented, producing an unexpected EOF. The current release branch aligns the heredoc terminator and command-substitution delimiter.

No application, database, payment, provider, or Cloudflare application behavior changes are included.
