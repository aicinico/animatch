import { defineConfig, devices } from '@playwright/test';

const API_URL = 'https://localhost';
const WEB_URL = 'http://localhost:5173';

export default defineConfig({
  webServer: {
    command: 'npm run dev',
    cwd: '../web',
    url: WEB_URL,
    reuseExistingServer: true,
  },
  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: API_URL, ignoreHTTPSErrors: true },
    },
    {
      name: 'chromium',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'], baseURL: WEB_URL },
    },
    {
      name: 'webkit',
      testDir: './tests/ui',
      use: { ...devices['Desktop Safari'], baseURL: WEB_URL },
    },
    {
      name: 'iphone',
      testDir: './tests/ui',
      use: { ...devices['iPhone 17'], baseURL: WEB_URL },
    },
  ],
});
