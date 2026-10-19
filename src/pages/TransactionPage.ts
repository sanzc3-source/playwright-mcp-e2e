import type { Page } from '@playwright/test';
import { BasePage } from './BasePage.js';

// Page Object for the New Transaction flow: pick a user, enter amount and note, pay
export class TransactionPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Opens the New Transaction flow from the top navigation bar
  async clickNewTransaction() {
    await this.page.getByTestId('nav-top-new-transaction').click();
  }

  // Step one: searches for a user and selects them as the receiver.
  // data-test sits on the <input> itself here, so no extra locator is needed.
  async selectUser(searchTerm: string) {
    await this.page.getByTestId('user-list-search-input').fill(searchTerm);
    // The list refreshes after the search, so wait for a matching row rather than taking whichever is first
    await this.page.getByTestId('users-list').locator('[data-test^="user-list-item-"]').filter({ hasText: searchTerm }).first().click();
  }

  // Step two: amount and note. data-test sits on the wrapper div for both fields,
  // so each needs .locator('input') to reach the actual input.
  async submitPayment(amount: string, description: string) {
    await this.page.getByTestId('transaction-create-amount-input').locator('input').fill(amount);
    await this.page.getByTestId('transaction-create-description-input').locator('input').fill(description);

    // data-test sits directly on the <button> here, no wrapper
    await this.page.getByTestId('transaction-create-submit-payment').click();
  }

  // Step three heading, e.g. "Paid $5.00 for <description>"
  getPaymentConfirmation(description: string) {
    return this.page.getByText(new RegExp(`Paid .* for ${description}`));
  }

  async returnToTransactions() {
    await this.page.getByTestId('new-transaction-return-to-transactions').click();
  }

  async openMineTab() {
    await this.page.getByTestId('nav-personal-tab').click();
  }

  getTransactionList() {
    return this.page.getByTestId('transaction-list');
  }
}