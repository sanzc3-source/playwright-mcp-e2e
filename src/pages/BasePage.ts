import type { Page } from '@playwright/test';

// Every Page Object extends this class, so shared setup lives in one place
export class BasePage {
  // readonly protected: subclasses can read this.page, but nobody can reassign it
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Common navigation helper every page object can reuse
  async goto(path: string) {
    await this.page.goto(path);
  }
}