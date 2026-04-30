import { test, expect } from '@playwright/test';

function setupGtagMock(page) {
  return page.addInitScript(() => {
    localStorage.setItem('cookie-consent', 'accepted');
    window.__gtag_events = [];
    Object.defineProperty(window, 'gtag', {
      configurable: true,
      get() {
        return function(type, name, params) {
          if (type === 'event') window.__gtag_events.push({ name, params });
        };
      },
      set() {}
    });
  });
}

test('should have no JS errors when consent is declined', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));

  await page.addInitScript(() => localStorage.setItem('cookie-consent', 'declined'));
  await page.goto('/');
  await page.waitForLoadState('load');

  expect(errors).toHaveLength(0);
});

test('should have no JS errors without consent', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));

  await page.goto('/');
  await page.waitForLoadState('load');

  expect(errors).toHaveLength(0);
});

test('should fire outbound_link event on external link click', async ({ page }) => {
  await setupGtagMock(page);

  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', function() {
      const link = document.createElement('a');
      link.href = 'https://example.com/external';
      link.textContent = 'External test link';
      link.id = 'test-external-link';
      document.body.appendChild(link);
    });
  });

  await page.goto('/');
  await page.waitForLoadState('load');

  await page.evaluate(() => {
    document.addEventListener('click', (e) => {
      if (e.target && e.target.id === 'test-external-link') e.preventDefault();
    }, true);
    const link = document.getElementById('test-external-link');
    if (link) link.click();
  });

  await page.waitForFunction(() => window.__gtag_events.some((e) => e.name === 'outbound_link'));

  const events = await page.evaluate(() => window.__gtag_events);
  const outboundEvent = events.find((e) => e.name === 'outbound_link');
  expect(outboundEvent).toBeDefined();
  expect(outboundEvent.params.url).toContain('example.com');
});

test('should fire social_click event on footer social link click', async ({ page }) => {
  await setupGtagMock(page);

  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', function() {
      const link = document.createElement('a');
      link.href = 'https://github.com/test';
      link.target = '_blank';
      link.dataset.network = 'github';
      link.textContent = 'GitHub';
      link.id = 'test-social-link';
      const footer = document.querySelector('footer') || document.body;
      footer.appendChild(link);
    });
  });

  await page.goto('/');
  await page.waitForLoadState('load');

  await page.evaluate(() => {
    document.addEventListener('click', (e) => {
      if (e.target && e.target.id === 'test-social-link') e.preventDefault();
    }, true);
    const link = document.getElementById('test-social-link');
    if (link) link.click();
  });

  await page.waitForFunction(() => window.__gtag_events.some((e) => e.name === 'social_click'));

  const events = await page.evaluate(() => window.__gtag_events);
  const socialEvent = events.find((e) => e.name === 'social_click');
  expect(socialEvent).toBeDefined();
  expect(socialEvent.params.network).toBe('github');
});

test('should fire read_depth event at 25% scroll', async ({ page }) => {
  await setupGtagMock(page);

  await page.goto('/posts/test-post/');
  await page.waitForLoadState('load');

  await page.evaluate(() => {
    const target = document.body.scrollHeight * 0.3;
    window.scrollTo(0, target);
    window.dispatchEvent(new Event('scroll'));
  });

  await page.waitForFunction(() => window.__gtag_events.some((e) => e.name === 'read_depth' && e.params.depth === 25));

  const events = await page.evaluate(() => window.__gtag_events);
  const depthEvent = events.find((e) => e.name === 'read_depth' && e.params.depth === 25);
  expect(depthEvent).toBeDefined();
});
