import { test, expect } from '../../src/fixtures/auth.fixture.js';
import { BankAccountPage } from '../../src/pages/BankAccountPage.js';

// Tests creating a bank account through the real UI form - same business action
// we already covered via API in Phase 4, now exercised through actual browser interaction
test.describe('Bank Account creation - UI', () => {
  test('creating a bank account shows it in the list', async ({ authedPage }) => {
    const bankAccountPage = new BankAccountPage(authedPage);

    // Unique per run - chromium/firefox/webkit all hit the same shared backend in parallel,
    // so a hardcoded name collides across browsers and causes a strict-mode violation
    const uniqueBankName = `Playwright UI Test Bank ${Date.now()}`;

    await authedPage.goto('/bankaccounts');

    await bankAccountPage.clickCreateNew();
    await bankAccountPage.createAccount(uniqueBankName, '123456789', '987654321');

    // After a successful save, the new bank name should appear in the list behind the dialog
    await expect(authedPage.getByText(uniqueBankName)).toBeVisible();
  });
});
