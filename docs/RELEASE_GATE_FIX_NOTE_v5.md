# Release gate fix v5

The exact-SHA production release check had malformed shell heredoc indentation. The release branch contains the syntax correction only. Post-merge evidence still requires authoritative CI, live SHA parity, and browser/surface smoke.