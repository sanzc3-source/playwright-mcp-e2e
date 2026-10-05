import { test as setup } from '@playwright/test';
import { SignInPage } from '../src/pages/SignInPage.js';

// Path where the authenticated browser session gets saved.
// Every other test in the suite will reuse this file instead of logging in via the UI.
const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // One real UI login — this is the only place in the whole suite that touches the sign-in form.
  const signInPage = new SignInPage(page);
  await signInPage.goToSignIn();
  await signInPage.signIn('Heath93', 's3cret');

  // Confirm login actually succeeded before saving state — waiting for a URL change
  // proves we're past the sign-in page, not just that the click happened.
  await page.waitForURL('/');

  // Save the authenticated session (cookies, localStorage) to disk.
  await page.context().storageState({ path: authFile });
});