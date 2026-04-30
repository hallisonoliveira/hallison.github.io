import { test, expect } from '@playwright/test';

test.describe('About page — PT', () => {
  test('should display correct hero name in h1', async ({ page }) => {
    await page.goto('/about/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1')).toContainText('Hallison Oliveira');
  });

  test('should display biographical text in Portuguese', async ({ page }) => {
    await page.goto('/about/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('main')).toContainText('desenvolvedor de software com mais de uma década');
  });
});

test.describe('About page — EN', () => {
  test('should display correct hero name in h1', async ({ page }) => {
    await page.goto('/en/about/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1')).toContainText('Hallison Oliveira');
  });

  test('should display biographical text in English', async ({ page }) => {
    await page.goto('/en/about/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('main')).toContainText('software developer with over a decade');
  });

  test('should display LinkedIn link in English version', async ({ page }) => {
    await page.goto('/en/about/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('a[href*="linkedin.com"]')).toBeVisible();
  });

  test('should display GitHub link in English version', async ({ page }) => {
    await page.goto('/en/about/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('a[href*="github.com"]')).toBeVisible();
  });

  test('should open LinkedIn link in new tab in English version', async ({ page }) => {
    await page.goto('/en/about/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('a[href*="linkedin.com"]')).toHaveAttribute('target', '_blank');
  });

  test('should open GitHub link in new tab in English version', async ({ page }) => {
    await page.goto('/en/about/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('a[href*="github.com"]')).toHaveAttribute('target', '_blank');
  });
});

test.describe('About page — Contact links', () => {
  test('should display LinkedIn link in PT version', async ({ page }) => {
    await page.goto('/about/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('a[href*="linkedin.com"]')).toBeVisible();
  });

  test('should display GitHub link in PT version', async ({ page }) => {
    await page.goto('/about/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('a[href*="github.com"]')).toBeVisible();
  });

  test('should open LinkedIn link in new tab', async ({ page }) => {
    await page.goto('/about/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('a[href*="linkedin.com"]')).toHaveAttribute('target', '_blank');
  });

  test('should open GitHub link in new tab', async ({ page }) => {
    await page.goto('/about/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('a[href*="github.com"]')).toHaveAttribute('target', '_blank');
  });

  test('should set rel noopener noreferrer on LinkedIn link', async ({ page }) => {
    await page.goto('/about/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('a[href*="linkedin.com"]')).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('should set rel noopener noreferrer on GitHub link', async ({ page }) => {
    await page.goto('/about/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('a[href*="github.com"]')).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('should render material-symbols-outlined icon in LinkedIn link', async ({ page }) => {
    await page.goto('/about/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('a[href*="linkedin.com"] .material-symbols-outlined')).toBeVisible();
  });

  test('should render material-symbols-outlined icon in GitHub link', async ({ page }) => {
    await page.goto('/about/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('a[href*="github.com"] .material-symbols-outlined')).toBeVisible();
  });
});
