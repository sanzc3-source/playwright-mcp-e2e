import { test, expect } from '@playwright/test';

// This test never touches the sign-in form. If storageState is wired correctly,
// visiting "/" should land straight on the authenticated home page.
test('lands on authenticated page without logging in', async ({ page }) => {
  await page.goto('/');

  // If we were NOT authenticated, RWA would redirect to /signin instead.
  await expect(page).toHaveURL('/');
});
