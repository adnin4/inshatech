# Release gate fix v3

Production release gate parsing was fixed on the isolated release branch. The exact-SHA check polling heredoc is now shell-valid. This change is limited to release workflow parsing and does not change application behavior, database schema, payment logic, providers, or Cloudflare application configuration.
