const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',

  webServer: {
    command: 'npm run hugo:server',
    url: 'http://localhost:1313',
    reuseExistingServer: !process.env.CI,
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
