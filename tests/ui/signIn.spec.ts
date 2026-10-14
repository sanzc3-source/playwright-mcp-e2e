import { test, expect } from '@playwright/test';
import { SignInPage } from '../../src/pages/SignInPage.js';

// Every browser project loads a pre-authenticated session by default -
// this overrides that so the test starts genuinely logged out
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Sign in - UI', () => {
  test('signing in with valid credentials redirects to the home page', async ({ page }) => {
    const signInPage = new SignInPage(page);

    await signInPage.goToSignIn();
    // Same seeded user auth.setup.ts already uses to log in successfully
    await signInPage.signIn('Heath93', 's3cret');

    // Confirmed via auth.setup.ts - a successful login lands on the home page
    await expect(page).toHaveURL('/');
  });
});