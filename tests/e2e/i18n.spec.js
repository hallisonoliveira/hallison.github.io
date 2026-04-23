import { test, expect, devices, browser } from '@playwright/test';

test.describe('i18n System', () => {
  test('should display site in Portuguese by default', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const htmlElement = page.locator('html');
    await expect(htmlElement).toHaveAttribute('lang', 'pt');
  });

  test('should switch to English via language-toggle', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const langButton = page.locator('#language-toggle');
    await langButton.click();
    await page.waitForURL('**/en/**');

    await expect(page).toHaveURL(/\/en\//);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('should persist language preference in localStorage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.locator('#language-toggle').click();
    await page.waitForURL('**/en/**');

    const stored = await page.evaluate(() =>
      window.localStorage.getItem('preferredLanguage')
    );
    expect(stored).toBe('en');
  });

  test('should maintain language preference when navigating', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Switch to EN
    await page.locator('#language-toggle').click();
    await page.waitForURL('**/en/**');

    // Navigate to posts
    await page.goto('/en/posts/');
    await page.waitForLoadState('networkidle');

    // Check lang is still EN
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    // Check localStorage still has EN
    const stored = await page.evaluate(() =>
      window.localStorage.getItem('preferredLanguage')
    );
    expect(stored).toBe('en');
  });

  test('should detect browser language on first visit', async ({ browser }) => {
    const context = await browser.newContext({
      locale: 'en-US',
    });
    const page = await context.newPage();
    await context.clearCookies();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const stored = await page.evaluate(() =>
      window.localStorage.getItem('preferredLanguage')
    );

    expect(stored).toBe('en');
    await context.close();
  });

  test('should preserve navigation when switching language', async ({ page }) => {
    await page.goto('/posts/');
    await page.waitForLoadState('networkidle');

    // Click language toggle from /posts/
    await page.locator('#language-toggle').click();

    // Should navigate to /en/posts/
    await page.waitForURL(/\/en\/posts\//);
    await expect(page).toHaveURL(/\/en\/posts\//);
  });

  test('should apply correct html[lang] attribute', async ({ page }) => {
    // PT version
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt');

    // EN version
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('should have proper aria-labels on language toggle', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const langButton = page.locator('#language-toggle');
    const ariaLabel = await langButton.getAttribute('aria-label');

    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel).toMatch(/português|english/i);
  });

  test('should generate valid HTML with lang attribute', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check html tag has valid lang attribute
    const html = page.locator('html');
    const langAttr = await html.getAttribute('lang');

    expect(['pt', 'en']).toContain(langAttr);
  });

  test('should have proper language links in navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that nav has proper structure
    const nav = page.locator('nav');
    const links = nav.locator('a');

    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });
});
