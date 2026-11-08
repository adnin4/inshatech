# UI/UX and Feature Safety Guardrails

Backend, security, payment, database, and release hardening must preserve the existing customer-facing product surface.

## Protected by default

- HTML structure and page routing
- CSS and responsive layout
- Navigation and existing CTAs
- Existing customer-facing features and API response fields
- Existing authentication flows unless a security fix requires a compatibility-preserving change

## Required before any UI/feature change

1. Identify the exact user-facing surface and dependency.
2. Add or update a regression test.
3. Verify desktop and mobile browser behavior.
4. Verify API contract compatibility.
5. Verify no payment/security boundary is weakened.
6. Review before merge.

## Rule

Security hardening must be surgical. Do not redesign or remove working UI/UX while repairing backend contracts. Any intentional product-surface change must be isolated in a separate, explicitly reviewed change set.
