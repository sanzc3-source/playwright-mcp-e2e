import { test, expect } from '../../src/fixtures/auth.fixture.js';
import { TransactionPage } from '../../src/pages/TransactionPage.js';

// Tests paying another user through the real New Transaction flow, then
// finding the payment in the personal feed
test.describe('Transactions - UI', () => {
  test('paying a user shows a confirmation and the payment in the Mine feed', async ({ authedPage }) => {
    const transactionPage = new TransactionPage(authedPage);

    // Unique per run - all three browsers share one backend, so a fixed note
    // could match a payment made by another browser's run
    const description = `Playwright payment ${Date.now()}`;

    await authedPage.goto('/');

    await transactionPage.clickNewTransaction();
    await transactionPage.selectUser('Arvilla');
    await transactionPage.submitPayment('5', description);

    // Step three confirms what was just submitted
    await expect(transactionPage.getPaymentConfirmation(description)).toBeVisible();

    await transactionPage.returnToTransactions();
    await transactionPage.openMineTab();

    await expect(transactionPage.getTransactionList().getByText(description)).toBeVisible();
  });
});

