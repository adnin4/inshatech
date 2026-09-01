# IINSHA Safe Change Policy

All future production changes must preserve existing UI/UX and require:

- isolated branch
- smallest safe diff
- unit/integration coverage where applicable
- functional regression
- visual regression
- accessibility regression
- security regression
- production rollback path

No deployment, payment, database mutation, or agent behavior change is considered production-verified without runtime evidence.