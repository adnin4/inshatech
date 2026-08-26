# Current release gate

`master` is the only production candidate. Legacy PRs are closed.

Required evidence before production certification:
- exact-SHA authoritative CI green
- production deployment success
- live `/api/version` SHA parity
- production browser/route smoke pass
- public content parity pass

Provider and real-customer activation remain separate post-release gates.
