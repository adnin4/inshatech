import { chromium } from 'playwright';

const BASE = process.env.SITE_BASE_URL || 'https://inshatech.pages.dev';
const ROUTES = [
  '/',
  '/store.html',
  '/marketplace.html',
  '/portal.html',
  '/admin.html',
  '/affiliate.html',
  '/affiliate-login.html',
  '/affiliate-dashboard.html',
  '/compare.html',
  '/blog.html'
];

const failures = [];
const results = [];

function record(route, kind, detail) {
  failures.push({ route, kind, detail });
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  ignoreHTTPSErrors: false
});

for (const route of ROUTES) {
  const page = await context.newPage();
  const consoleErrors = [];
  const requestFailures = [];

  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(`PAGEERROR: ${err.message}`));
  page.on('requestfailed', req => requestFailures.push(`${req.method()} ${req.url()} :: ${req.failure()?.errorText || 'failed'}`));

  const url = new URL(route, BASE).href;
  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(err => null);
  const status = response?.status() ?? 0;
  const title = await page.title().catch(() => '');

  if (!response || status < 200 || status >= 400) {
    record(route, 'http', `expected 2xx/3xx, got ${status}`);
  }

  const bodyText = await page.locator('body').innerText().catch(() => '');
  if (bodyText.trim().length < 40) record(route, 'content', 'page body is unexpectedly short');

  const internalLinks = await page.locator('a[href]').evaluateAll(anchors => anchors.map(a => a.getAttribute('href')).filter(Boolean));
  const badInternal = internalLinks.filter(href => href.startsWith('/') || href.startsWith(BASE)).filter(href => href.startsWith('javascript:') || href === '#');
  for (const href of badInternal) record(route, 'link', `non-navigating internal href: ${href}`);

  const buttons = await page.locator('button').evaluateAll(btns => btns.map(b => ({
    text: (b.textContent || '').trim().slice(0, 100),
    disabled: b.disabled,
    hasHref: Boolean(b.getAttribute('href')),
    onclick: b.getAttribute('onclick'),
    action: b.getAttribute('data-action'),
    target: b.getAttribute('data-target'),
    type: b.getAttribute('type') || 'submit'
  })));

  // Never click payment/submit/destructive controls in a public smoke test.
  // Instead verify that interactive buttons have a handler/target or are clearly static.
  for (const button of buttons) {
    if (button.disabled) continue;
    const interactiveIntent = button.onclick || button.action || button.target || button.hasHref;
    const text = button.text.toLowerCase();
    const protectedWord = /(pay|checkout|purchase|buy|refund|delete|remove|submit|login|sign|admin|control|publish)/.test(text);
    if (!interactiveIntent && !protectedWord && button.type !== 'submit') {
      record(route, 'button', `button appears to have no declared handler/target: ${button.text}`);
    }
  }

  // Validate common tab surfaces without activating side effects.
  const tabs = await page.locator('[role="tab"], .tab, [data-tab]').count();
  if (tabs > 0) {
    const tabCandidates = page.locator('[role="tab"], .tab, [data-tab]');
    const count = await tabCandidates.count();
    for (let i = 0; i < Math.min(count, 12); i++) {
      const tab = tabCandidates.nth(i);
      if (await tab.isVisible().catch(() => false)) {
        const disabled = await tab.isDisabled().catch(() => false);
        if (!disabled) {
          await tab.focus().catch(() => {});
          const aria = await tab.getAttribute('aria-controls').catch(() => null);
          const dataTarget = await tab.getAttribute('data-tab').catch(() => null);
          if (!aria && !dataTarget && (await tab.getAttribute('role')) === 'tab') {
            record(route, 'tab', 'tab lacks aria-controls/data-tab target');
          }
        }
      }
    }
  }

  for (const err of consoleErrors) record(route, 'console', err);
  for (const err of requestFailures.filter(x => !x.includes('favicon'))) record(route, 'request', err);

  results.push({ route, status, title, links: internalLinks.length, buttons: buttons.length, tabs, consoleErrors: consoleErrors.length, requestFailures: requestFailures.length });
  await page.close();
}

await browser.close();

console.log(JSON.stringify({ base: BASE, routes: results, failures }, null, 2));

if (failures.length) {
  console.error(`PUBLIC_SITE_E2E: FAIL (${failures.length} findings)`);
  process.exit(1);
}

console.log('PUBLIC_SITE_E2E: PASS');
