const { test, expect } = require('@playwright/test');

test('html lang attribute is pt on default page', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => document.readyState === 'complete');

  await expect(page.locator('html')).toHaveAttribute('lang', 'pt');
});

test('clicking language toggle redirects to /en/ and sets lang to en', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => document.readyState === 'complete');

  await page.locator('#language-toggle').click();
  await page.waitForURL('**/en/**');

  await expect(page).toHaveURL(/\/en\//);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('localStorage preferredLanguage persists after toggle', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => document.readyState === 'complete');

  await page.locator('#language-toggle').click();
  await page.waitForURL('**/en/**');

  const stored = await page.evaluate(() =>
    window.localStorage.getItem('preferredLanguage')
  );
  expect(stored).toBe('en');
});

test('localStorage is set on first visit using browser language detection', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'en-US' });
  const page = await context.newPage();

  await page.goto('/');
  await page.waitForFunction(() => document.readyState === 'complete');

  const stored = await page.evaluate(() =>
    window.localStorage.getItem('preferredLanguage')
  );

  expect(stored).toBe('en');
  await context.close();
});

test('mapUrl: PT root to EN adds /en/', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => document.readyState === 'complete');

  const result = await page.evaluate(() => window.NavigationMapper.mapUrl('/', 'en'));
  expect(result).toBe('/en/');
});

test('mapUrl: EN posts to PT removes /en/', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => document.readyState === 'complete');

  const result = await page.evaluate(() => window.NavigationMapper.mapUrl('/en/posts/', 'pt'));
  expect(result).toBe('/posts/');
});

test('mapUrl: PT path already in PT stays unchanged', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => document.readyState === 'complete');

  const result = await page.evaluate(() => window.NavigationMapper.mapUrl('/', 'pt'));
  expect(result).toBe('/');
});

test('mapUrl: EN path already in EN stays unchanged', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => document.readyState === 'complete');

  const result = await page.evaluate(() => window.NavigationMapper.mapUrl('/en/posts/', 'en'));
  expect(result).toBe('/en/posts/');
});

test('mapUrl: EN path without trailing slash to PT strips /en', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => document.readyState === 'complete');

  const result = await page.evaluate(() => window.NavigationMapper.mapUrl('/en/posts', 'pt'));
  expect(result).toBe('/posts');
});
