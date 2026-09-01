# IINSHA AI-BOS — Live Truth Gate Changelog

This change set is intentionally non-invasive.

Changed:
- added read-only live truth verification for `/api/version` and 10 core public routes
- added deterministic unit checks for the verification logic
- added current-master live evidence/status documentation
- added a production release runbook

Not changed:
- HTML
- CSS
- UI layout
- animations
- Supabase schema/data
- payment logic
- AI agent behavior
- customer records

The gate fails closed when live SHA parity or a core public route cannot be verified.
