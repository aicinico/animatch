import { defineConfig, devices } from '@playwright/test';

const API_URL = 'https://localhost';
const WEB_URL = 'http://localhost:5173';

// GitHub Actions sets CI: there, test the production build of the interface
const isCI = !!process.env.CI;

export default defineConfig({
  reporter: [['list'], ['html', { open: 'never' }]],
  webServer: {
    command: isCI
      ? 'npm run build && npm run preview -- --port 5173 --strictPort'
      : 'npm run dev',
    cwd: '../web',
    url: WEB_URL,
    reuseExistingServer: !isCI,
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
