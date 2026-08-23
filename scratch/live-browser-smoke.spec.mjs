import { test, expect } from '@playwright/test';

const BASE = (process.env.LIVE_URL || 'https://inshatech.pages.dev').replace(/\/$/, '');

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

test('homepage navigation targets are reachable', async ({ page }) => {
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });

  const hrefs = await page.locator('a[href]').evaluateAll((links) =>
    links
      .map((a) => a.getAttribute('href'))
      .filter((href) => href && !href.startsWith('#') && !href.startsWith('javascript:') && !href.startsWith('mailto:') && !href.startsWith('tel:'))
  );

  const internal = [...new Set(hrefs.filter((href) => href.startsWith('/') || href.startsWith('.')))]
    .slice(0, 80);

  for (const href of internal) {
    const url = new URL(href, BASE).href;
    const response = await page.request.get(url, { failOnStatusCode: false, timeout: 15000 });
    expect(response.status(), `Broken internal href ${href}`).toBeLessThan(400);
  }
});

test('solution finder and readiness audit open without runtime errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });

  const solutionFinder = page.getByText('Try AI Solution Finder', { exact: false }).first();
  if (await solutionFinder.count()) {
    await solutionFinder.click();
    await page.waitForTimeout(300);
  }

  const maturity = page.getByText('AI Readiness Audit', { exact: false }).first();
  if (await maturity.count()) {
    await maturity.click();
    await page.waitForTimeout(300);
  }

  expect(errors).toEqual([]);
});
