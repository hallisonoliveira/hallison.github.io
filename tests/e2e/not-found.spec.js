import { test, expect } from '@playwright/test';

test.describe('404 Page', () => {
  test('should display PT 404 with translated content', async ({ page }) => {
    await page.goto('/url-inexistente/');

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).not.toContainText('404');
    await expect(page.locator('span.material-symbols-outlined')).toBeVisible();
  });

  test('should render PT home button with correct href', async ({ page }) => {
    await page.goto('/url-inexistente/');
    await expect(page.locator('section a[href="/"]')).toBeVisible();
  });

  test('should render PT posts button with correct href', async ({ page }) => {
    await page.goto('/url-inexistente/');
    await expect(page.locator('section a[href="/posts/"]')).toBeVisible();
  });

  test('should display EN 404 with translated content', async ({ page }) => {
    await page.goto('/en/url-that-does-not-exist/');

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).not.toContainText('404');
  });

  test('should render EN home button with correct href', async ({ page }) => {
    await page.goto('/en/url-that-does-not-exist/');
    await expect(page.locator('section a[href="/en/"]')).toBeVisible();
  });

  test('should render EN posts button with correct href', async ({ page }) => {
    await page.goto('/en/url-that-does-not-exist/');
    await expect(page.locator('section a[href="/en/posts/"]')).toBeVisible();
  });
});
