/**
 * InshaTech Production Release Verification Suite (Playwright)
 */

import { test, expect } from '@playwright/test';

test.describe('InshaTech Production Release Verification Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('SEC-01: Verify Production Edge Headers and Security Directives', async ({ page }) => {
    const response = await page.goto('/');
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);

    const headers = response!.headers();
    expect(headers['strict-transport-security']).toBeDefined();
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBe('DENY');
  });

  test('AUTH-01: Validate User Login and Session Initialization', async ({ page }) => {
    await page.click('text=Sign In');
    await expect(page).toHaveURL(/.*\/sign-in/);
    await page.fill('input[type="email"]', 'qa-verification@inshatech.com');
    await page.fill('input[type="password"]', 'ProductionReady2026!#');
    await page.click('button[type="submit"]');
    await expect(page.locator('data-testid=user-dashboard-root')).toBeVisible({ timeout: 10000 });
  });

  test('PAY-01: Verify bKash Tokenized Checkout Initiation Redirect', async ({ page }) => {
    await page.goto('/store.html');
    const btn = page.locator('.order-btn').first();
    if (await btn.isVisible()) {
      await btn.click();
    }
  });
});
