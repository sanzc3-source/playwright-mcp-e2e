import { test as setup } from '@playwright/test';

// Path where the authenticated browser session gets saved.
// Every other test in the suite will reuse this file instead of logging in via the UI.
const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // One real UI login — this is the only place in the whole suite that touches the sign-in form.
  await page.goto('/signin');

  await page.getByLabel('Username').fill('Heath93');
  await page.getByLabel('Password').fill('s3cret');
  await page.getByTestId('signin-submit').click();

  // Confirm login actually succeeded before saving state — waiting for a URL change
  // proves we're past the sign-in page, not just that the click happened.
  await page.waitForURL('/');

  // Save the authenticated session (cookies, localStorage) to disk.
  await page.context().storageState({ path: authFile });
});
