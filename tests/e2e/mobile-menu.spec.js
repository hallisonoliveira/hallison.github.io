import { test, expect } from '@playwright/test';

test.describe('Mobile Navigation Menu', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('should show hamburger button on mobile viewport', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#mobile-menu-toggle')).toBeVisible();
  });

  test('should open panel when hamburger is clicked', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#mobile-nav-panel')).toBeHidden();
    await page.locator('#mobile-menu-toggle').click();
    await expect(page.locator('#mobile-nav-panel')).toBeVisible();
    await expect(page.locator('#mobile-menu-toggle')).toHaveAttribute('aria-expanded', 'true');
  });

  test('should close panel when a nav link is clicked', async ({ page }) => {
    await page.goto('/');
    await page.locator('#mobile-menu-toggle').click();
    await expect(page.locator('#mobile-nav-panel')).toBeVisible();
    await page.locator('#mobile-nav-panel a').first().click();
    await expect(page.locator('#mobile-nav-panel')).toBeHidden();
  });

  test('should close panel when Esc key is pressed', async ({ page }) => {
    await page.goto('/');
    await page.locator('#mobile-menu-toggle').click();
    await expect(page.locator('#mobile-nav-panel')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#mobile-nav-panel')).toBeHidden();
    await expect(page.locator('#mobile-menu-toggle')).toHaveAttribute('aria-expanded', 'false');
  });

  test('should not show hamburger button on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
    await expect(page.locator('#mobile-menu-toggle')).toBeHidden();
  });
});
