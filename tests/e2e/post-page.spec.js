import { test, expect } from '@playwright/test';

test.describe('Post Page', () => {
  test('should not show current post in related reading', async ({ page }) => {
    await page.goto('/posts/empatia-assertiva/');
    const relatedLinks = await page.locator('section a[href]').all();
    for (const link of relatedLinks) {
      const href = await link.getAttribute('href');
      expect(href).not.toContain('empatia-assertiva');
    }
  });

  test('should display feature image with correct aspect ratio', async ({ page }) => {
    await page.goto('/posts/empatia-assertiva/');
    const img = page.locator('div.aspect-\\[21\\/9\\]');
    await expect(img).toBeVisible();
  });

  test('should render title with correct font classes', async ({ page }) => {
    await page.goto('/posts/empatia-assertiva/');
    await expect(page.locator('h1.font-headline')).toBeVisible();
  });

  test('should render Giscus automatically with the page language and stable article term', async ({ page }) => {
    await page.goto('/posts/empatia-assertiva/');
    await expect(page.locator('[data-comments]')).toBeVisible();
    await expect(page.locator('#comments script[src="https://giscus.app/client.js"]')).toHaveAttribute('data-lang', 'pt');
    await expect(page.locator('#comments script[src="https://giscus.app/client.js"]')).toHaveAttribute('data-term', 'posts/empatia-assertiva');
    await expect(page.locator('[data-comments-load]')).toHaveCount(0);

    await page.goto('/en/posts/kubectl-curl-api-kubernetes/');
    await expect(page.locator('#comments script[src="https://giscus.app/client.js"]')).toHaveAttribute('data-lang', 'en');
    await expect(page.locator('#comments script[src="https://giscus.app/client.js"]')).toHaveAttribute('data-term', 'posts/kubectl-curl-api-kubernetes');

    await page.goto('/posts/kubectl-curl-api-kubernetes/');
    await expect(page.locator('#comments script[src="https://giscus.app/client.js"]')).toHaveAttribute('data-term', 'posts/kubectl-curl-api-kubernetes');
  });
});
