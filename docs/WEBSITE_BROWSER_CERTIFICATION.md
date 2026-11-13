# Website Browser & Public Surface Certification

**Audited Surface:** `adnin4/inshatech`  
**Standard:** WCAG 2.2 AA, Zero Raw Dialogs Policy, JSDOM & Browser Testing

---

## 1. Route & Surface Audit Summary

| Route | Viewport Support | Zero Raw Dialogs | Authentication Handling | Status |
| :--- | :--- | :--- | :--- | :--- |
| `/` (`index.html`) | 320px – 4K Responsive | `PASS` (Modal dialogs) | Public | `PASS` |
| `/store.html` | 320px – 4K Responsive | `PASS` | Public | `PASS` |
| `/marketplace.html` | 320px – 4K Responsive | `PASS` | Public | `PASS` |
| `/compare.html` | 320px – 4K Responsive | `PASS` | Public | `PASS` |
| `/blog.html` | 320px – 4K Responsive | `PASS` | Public | `PASS` |
| `/portal.html` | 320px – 4K Responsive | `PASS` | Public | `PASS` |
| `/admin.html` | Desktop & Tablet Cockpit | `PASS` (Inline modal) | Secure 2FA session | `PASS` |
| `/affiliate.html` | 320px – 4K Responsive | `PASS` | Public | `PASS` |
| `/affiliate-login.html` | Mobile & Desktop | `PASS` | Partner Portal Auth | `PASS` |
| `/affiliate-dashboard.html` | Mobile & Desktop | `PASS` | Partner Portal Auth | `PASS` |

---

## 2. Zero Raw Dialog Policy Compliance

- Strictly prohibited: `window.alert()`, `window.confirm()`, `window.prompt()`.
- Implemented: Custom DOM modals with animated entry/exit, clear action buttons, and keyboard accessibility (Escape to dismiss, focus trapping).
- Verified by automated test: `scripts/production_browser_certification.mjs` (Suite #22 in CI evidence runner, Exit Code 0).
