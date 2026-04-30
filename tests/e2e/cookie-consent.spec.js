import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
});

test('should display banner on first visit', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#cookie-banner')).toBeVisible();
});

test('should hide banner after accepting', async ({ page }) => {
  await page.goto('/');
  await page.locator('#cookie-accept').click();
  await expect(page.locator('#cookie-banner')).toBeHidden();
});

test('should hide banner when consent already accepted', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('cookie-consent', 'accepted'));
  await page.goto('/');
  await expect(page.locator('#cookie-banner')).toBeHidden();
});

test('should hide banner when consent already declined', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('cookie-consent', 'declined'));
  await page.goto('/');
  await expect(page.locator('#cookie-banner')).toBeHidden();
});

test('should not load gtag script when declined', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('cookie-consent', 'declined'));
  await page.goto('/');
  const gaScript = page.locator('script[src*="googletagmanager.com"]');
  await expect(gaScript).toHaveCount(0);
});

test('should display banner in English', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.locator('#cookie-banner p')).not.toBeEmpty();
});

test('should show cookie-manage button in footer', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#cookie-manage')).toBeVisible();
});
