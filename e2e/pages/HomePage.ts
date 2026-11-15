import type { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly tagline: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1, name: 'Animatch' });
    this.tagline = page.getByText(
      'Adoptez un chat ou un chien près de chez vous.',
    );
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
