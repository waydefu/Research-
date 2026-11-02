import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'tests/browser',
  timeout: 45_000,
  expect: { timeout: 12_000 },
  workers: 2,
  retries: 0,
  reporter: [['line']],
  use: { baseURL: 'http://127.0.0.1:4325/Research-/v3/', browserName: 'chromium', trace: 'retain-on-failure' },
  webServer: {
    command: 'node tests/serve-dist.mjs',
    url: 'http://127.0.0.1:4325/Research-/v3/',
    reuseExistingServer: false,
    timeout: 20_000
  }
});
