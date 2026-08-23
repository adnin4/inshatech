# P0 Launch Remediation

The public homepage must pass this gate before production merge.

## 1. Admin credential exposure — BLOCKER
- Remove all hardcoded admin emails/passwords from HTML/JS.
- Remove any client-side `sessionStorage`/localStorage admin unlock bypass.
- Use server-side authentication, MFA, short-lived sessions and explicit authorization.
- Rotate any credential that has ever appeared in source/history.

## 2. Payment card data — BLOCKER
- Remove raw card-number/CVV inputs from the site.
- Use Stripe-hosted Checkout/Elements or another PCI-compliant tokenized field integration.
- Never persist PAN/CVV.

## 3. Marketing claims — BLOCKER
Any metric must be one of:
- LIVE_VERIFIED with evidence/source date,
- SANDBOX_VERIFIED and visibly labelled,
- ESTIMATE/ILLUSTRATIVE.

Remove or qualify unsupported absolute claims such as 100% reliability/privacy, fixed uptime, conversion/ROI figures, download/review counts, and customer outcome metrics.

## 4. Web automation wording — BLOCKER
Use only authorized-data wording. Do not market evasion/bypass of security or anti-bot controls. Respect target-site terms, robots directives where applicable, rate limits, and applicable law.

## 5. Regulated/compliance claims — BLOCKER
Do not claim HIPAA/GDPR/PCI/etc. compliance unless the required operational controls, agreements, audits and evidence are actually present. Use "HIPAA-ready architecture" or similar qualified language where appropriate.

## 6. Final verification
Run:
- npm test
- npm run test:autonomous
- npm run test:mission
- node scratch/security_content_gate.js
- live smoke test
- payment sandbox test
- RLS/tenant isolation tests

Then collect evidence before marking LIVE_VERIFIED.
