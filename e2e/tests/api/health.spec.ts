import { test, expect } from '@playwright/test';

test('GET /health reports that the API and its database are up', async ({ request }) => {
  const response = await request.get('/health');

  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ status: 'ok', database: 'ok' });
});
