import { test as base, type Page } from '@playwright/test';

// Shape of our custom fixture so TypeScript knows authedPage exists and is a Page
type AuthFixtures = {
  authedPage: Page;
};

// Extends Playwright's base test with our custom fixture, typed via AuthFixtures
export const test = base.extend<AuthFixtures>({
  // authedPage: hands tests a page that's already logged in
  authedPage: async ({ page }, use) => {
    // storageState is loaded automatically per playwright.config.ts, so this page is already authenticated
    await page.goto('/');
    // pass the ready page to the test
    await use(page);
  },
});

// re-export expect so tests only need one import source
export { expect } from '@playwright/test';