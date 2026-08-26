# Release gate status

Current master remains the only production candidate.

Required before claiming LIVE_VERIFIED:
- exact-SHA authoritative CI green
- production deployment success
- `/api/version` equals release SHA
- production browser/route smoke passes
- public content parity passes

Provider activation and real-customer certification remain separate gates.
