---
name: iinsha-browser-qa
description: Use to execute real browser regression testing of IINSHA public pages, service discovery, forms, responsive layouts, accessibility, and release screenshots.
---
# IINSHA Browser QA with Playwright

## Tool choice
Prefer Microsoft's Playwright CLI + its Agent Skills for coding-agent browser work. Check the current executable and help before assuming commands:

```powershell
playwright-cli --help
```

If not installed and the owner approves modifying dev dependencies, check the existing package manager/lockfile, then install `@playwright/cli` locally and use the CLI's current documented setup. `playwright-cli install --skills=agents` can install the Agent Skills layout under `.agents/skills`. Use Antigravity's built-in `/browser` when it is available and sufficient.

## Target coverage
Test the branch preview or local server—not production write flows without authorization.

Viewports:
- 1440×900
- 1280×800
- 1024×768
- 768×1024
- 390×844
- 360×800

Interactions:
- Header navigation and mobile menu.
- Hero CTA and WebGL/static fallback.
- Bento sections.
- All 80 detailed services.
- Search query, clear, no-result state, count announcement, and category tabs.
- Solution Finder.
- Architecture Builder.
- ROI Calculator with existing formula preserved.
- Package selection and modal.
- Checkout validation without a real payment.
- Contact forms and WhatsApp links.
- Footer/legal links.

## Evidence
Capture screenshots at all required viewports, console errors, failed network requests, browser logs, accessibility observations, and the exact tested Git SHA. Report not-tested functionality as NOT_VERIFIED. A source-level DOM assertion is not a substitute for an actual user interaction.
