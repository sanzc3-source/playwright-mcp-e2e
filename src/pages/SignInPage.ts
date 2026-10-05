import type { Page } from '@playwright/test';
import { BasePage } from './BasePage.js';

// Wraps the sign-in form so tests call page.signIn(...) instead of repeating locators
export class SignInPage extends BasePage {
  constructor(page: Page) {
    // Runs BasePage's constructor so this.page gets set up correctly
    super(page);
  }

  // Navigates straight to the sign-in page
  async goToSignIn() {
    await this.goto('/signin');
  }

  // Fills the form and submits — same locators we verified earlier
  async signIn(username: string, password: string) {
    // Username field — matched via its label, not the misplaced data-test wrapper
    await this.page.getByLabel('Username').fill(username);
    // Password field — same label-based approach
    await this.page.getByLabel('Password').fill(password);
    // Submit button — this one's data-test IS on the actual <button>, confirmed earlier
    await this.page.getByTestId('signin-submit').click();
  }
}