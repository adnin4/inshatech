import { chromium } from 'playwright';

const base = (process.env.SITE_BASE_URL || 'https://inshatech.pages.dev').replace(/\/$/, '');
const routes = [
  '/',
  '/marketplace',
  '/compare',
  '/blog',
  '/store',
  '/portal',
  '/affiliate',
  '/affiliate-login',
  '/affiliate-dashboard',
  '/admin',
];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  serviceWorkers: 'block',
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
const failures = [];

page.on('pageerror', (error) => failures.push(`pageerror: ${error.message}`));
page.on('console', (msg) => {
  if (msg.type() === 'error') failures.push(`console: ${msg.text()}`);
});
page.on('requestfailed', (request) => {
  failures.push(`requestfailed: ${request.method()} ${request.url()} ${request.failure()?.errorText || ''}`);
});

for (const route of routes) {
  const response = await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  const status = response?.status() ?? 0;
  console.log(`${route} -> ${status} (${page.url()})`);
  if (status < 200 || status >= 400) {
    failures.push(`route ${route}: HTTP ${status}`);
  }
  await page.waitForTimeout(250);
}

await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 30000 });

const interactiveCount = await page.locator('button, a[href], input, select, textarea').count();
if (interactiveCount < 5) {
  failures.push(`interactive surface too small: ${interactiveCount}`);
}

const brokenLinks = await page.locator('a[href]').evaluateAll((anchors) =>
  anchors
    .map((a) => ({ text: (a.textContent || '').trim(), href: a.getAttribute('href') || '' }))
    .filter(({ href }) => href.startsWith('/') && href !== '#')
);
for (const link of brokenLinks.slice(0, 100)) {
  try {
    const r = await context.request.get(`${base}${link.href}`, { timeout: 15000, failOnStatusCode: false });
    if (r.status() >= 400) failures.push(`link ${link.href}: HTTP ${r.status()} (${link.text})`);
  } catch (error) {
    failures.push(`link ${link.href}: ${error.message}`);
  }
}

await browser.close();

if (failures.length) {
  console.error('PRODUCTION_SITE_SMOKE_FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`PRODUCTION_SITE_SMOKE_PASS: ${routes.length} routes, ${interactiveCount} interactive elements`);
