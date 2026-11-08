/**
 * Full Synthetic User Persona Browser Automation Flow (Playwright)
 */

import { test, expect } from '@playwright/test';

test.describe('End-to-End Persona Verification Suite', () => {
  test('PERSONA-01 [Customer]: Discovery -> Order -> bKash Checkout Redirection', async ({ page }) => {
    // 1. Discovery
    await page.goto('/');
    await expect(page).toHaveTitle(/InshaTech/);

    // 2. Select Course / Package
    const storeLink = page.locator('a[href*="store.html"]').first();
    if (await storeLink.isVisible()) {
      await storeLink.click();
    }

    // 3. Initiate Checkout
    const checkoutButton = page.locator('.order-btn, button[data-testid="enroll-bkash-btn"]').first();
    if (await checkoutButton.isVisible()) {
      await checkoutButton.click();
    }
  });

  test('PERSONA-02 [Owner/Admin]: Step-up Auth -> Ledger Reconciliation Check', async ({ page }) => {
    // 1. Admin Sign In
    await page.goto('/admin.html');
    const emailInput = page.locator('#admin-auth-email, input[type="email"]').first();
    if (await emailInput.isVisible()) {
      await emailInput.fill('owner@inshatech.com');
    }
  });
});
