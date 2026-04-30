const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false, // single Hugo server instance cannot handle parallel requests reliably
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1, // single worker to avoid port conflicts with hugo server
  reporter: 'list',

  webServer: {
    command: 'hugo server --port 1313 --bind 0.0.0.0',
    url: 'http://localhost:1313',
    reuseExistingServer: true,
    timeout: 30000,
  },

  use: {
    baseURL: 'http://localhost:1313',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
