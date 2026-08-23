import { test, expect } from '@playwright/test';

const BASE = (process.env.LIVE_URL || '').replace(/\/$/, '');
if (!BASE) throw new Error('LIVE_URL is required; refuse to run browser smoke against an implicit target.');

const corePaths = [
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

test('core pages load without uncaught browser errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console:${message.text()}`);
  });

  for (const path of corePaths) {
    const response = await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    expect(response, `No response for ${path}`).not.toBeNull();
    expect(response.status(), `HTTP status for ${path}`).toBeLessThan(400);
    await expect(page.locator('body')).toBeVisible();
  }

  expect(errors, 'Unexpected browser/console errors').toEqual([]);
});

test('homepage internal navigation targets are reachable', async ({ page }) => {
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });

  const hrefs = await page.locator('a[href]').evaluateAll((links) =>
    links
      .map((a) => a.getAttribute('href'))
      .filter((href) => href && !href.startsWith('#') && !href.startsWith('javascript:') && !href.startsWith('mailto:') && !href.startsWith('tel:'))
  );

  const internal = [...new Set(hrefs.filter((href) => href.startsWith('/') || href.startsWith('.')))].slice(0, 120);
  for (const href of internal) {
    const url = new URL(href, BASE).href;
    const response = await page.request.get(url, { failOnStatusCode: false, timeout: 15000 });
    expect(response.status(), `Broken internal href ${href}`).toBeLessThan(400);
  }
});

test('key homepage interactions are present and executable', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console:${message.text()}`);
  });

  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });

  const solutionFinder = page.getByRole('button', { name: /try ai solution finder/i }).first();
  await expect(solutionFinder, 'AI Solution Finder button must exist').toBeVisible();
  await solutionFinder.click();
  await expect(page.locator('body')).toContainText(/solution|business|industry/i);

  const readiness = page.getByRole('button', { name: /ai readiness audit/i }).first();
  await expect(readiness, 'AI Readiness Audit button must exist').toBeVisible();
  await readiness.click();
  await expect(page.locator('body')).toContainText(/readiness|audit|score/i);

  expect(errors, 'Unexpected errors during key interactions').toEqual([]);
});
