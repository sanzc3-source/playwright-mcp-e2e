import { test, expect } from '../src/fixtures/auth.fixture.js';

// This test never touches the sign-in form. The authedPage fixture handles
// loading the saved session and landing on the home page for us.
test('lands on authenticated page without logging in', async ({ authedPage }) => {
  // If we were NOT authenticated, RWA would redirect to /signin instead.
  await expect(authedPage).toHaveURL('/');
});