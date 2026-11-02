import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'tests/pages',
  timeout: 45_000,
  workers: 1,
  reporter: [['line']],
  use: {
    browserName: 'chromium',
    baseURL: 'http://127.0.0.1:4326/Research-/',
    reducedMotion: 'reduce',
    viewport: {width: 1280, height: 800},
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'node tests/serve-pages.mjs',
    url: 'http://127.0.0.1:4326/Research-/',
    reuseExistingServer: false,
    timeout: 20_000
  }
});
