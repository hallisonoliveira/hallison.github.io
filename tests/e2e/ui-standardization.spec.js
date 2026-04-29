import { test, expect } from '@playwright/test';

test.describe('Single post layout', () => {
  test('should have consistent left margin with home page section', async ({ page }) => {
    await page.goto('/posts/');

    const postLink = page.locator('article h2 a').first();
    await expect(postLink).toBeVisible();
    await postLink.click();

    const articleLocator = page.locator('article').first();
    await expect(articleLocator).toBeVisible();
    const articleBox = await articleLocator.boundingBox();
    expect(articleBox).not.toBeNull();

    await page.goto('/');

    const sectionLocator = page.locator('section').first();
    await expect(sectionLocator).toBeVisible();
    const sectionBox = await sectionLocator.boundingBox();
    expect(sectionBox).not.toBeNull();

    expect(Math.abs(articleBox.x - sectionBox.x)).toBeLessThan(4);
  });
});

test.describe('Max-width consistency', () => {
  test('should have max-width container on /', async ({ page }) => {
    await page.goto('/');
    const container = page.locator('.max-w-screen-xl').first();
    await expect(container).toBeVisible();
  });

  test('should have max-width container on /posts/', async ({ page }) => {
    await page.goto('/posts/');
    const container = page.locator('.max-w-screen-xl').first();
    await expect(container).toBeVisible();
  });

  test('should have max-width container on /about/', async ({ page }) => {
    await page.goto('/about/');
    const container = page.locator('.max-w-screen-xl').first();
    await expect(container).toBeVisible();
  });
});

test.describe('About page spacing', () => {
  test('should use mb-24 on hero section', async ({ page }) => {
    await page.goto('/about/');
    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();
    await expect(hero).toHaveClass(/mb-24/);
  });
});
