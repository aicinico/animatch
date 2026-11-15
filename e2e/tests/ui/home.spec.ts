import { test, expect } from '../../fixtures';

test('home page shows the app name and tagline', async ({ homePage }) => {
  await homePage.goto();

  await expect(homePage.page).toHaveTitle('Animatch');
  await expect(homePage.heading).toBeVisible();
  await expect(homePage.tagline).toBeVisible();
});
