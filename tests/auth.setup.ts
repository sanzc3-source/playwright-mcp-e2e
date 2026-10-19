import { test as setup } from '@playwright/test';
import { SignInPage } from '../src/pages/SignInPage.js';

// Path where the authenticated browser session gets saved.
// Every other test in the suite will reuse this file instead of logging in via the UI.
const authFile = 'playwright/.auth/user.json';

// The backend lives on the same host as the frontend, just a different port.
// Locally that's "localhost"; inside the Docker Compose network it's the "sut" service name.
const appHost = process.env.BASE_URL ? new URL(process.env.BASE_URL).hostname : 'localhost';

// Retries the seed request until the backend is actually ready to accept it -
// the container starting doesn't mean the app inside it has finished booting yet
async function seedDatabase() {
  const maxAttempts = 15;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(`http://${appHost}:3001/testData/seed`, { method: 'POST' });
      if (response.ok) return;
    } catch {
      // Backend isn't accepting connections yet - fall through and retry
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error('Backend never became ready to seed the database');
}

setup('authenticate', async ({ page }) => {
  // A fresh backend starts with an empty database - this endpoint is the only
  // thing that loads the test user data, and nothing else in the suite calls it
  await seedDatabase();

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