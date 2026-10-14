import type { Page } from '@playwright/test';
import { BasePage } from './BasePage.js';

// Page Object for the Create Bank Account dialog
export class BankAccountPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Opens the Create Bank Account dialog from the Bank Accounts page
  async clickCreateNew() {
    await this.page.getByTestId('bankaccount-new').click();
  }

  // Fills out and submits the form.
  // data-test sits on the wrapper div for these three fields, not the input itself -
  // confirmed via DevTools - so each needs .locator('input') to reach the actual field.
  async createAccount(bankName: string, routingNumber: string, accountNumber: string) {
    await this.page.getByTestId('bankaccount-bankName-input').locator('input').fill(bankName);
    await this.page.getByTestId('bankaccount-routingNumber-input').locator('input').fill(routingNumber);
    await this.page.getByTestId('bankaccount-accountNumber-input').locator('input').fill(accountNumber);

    // Confirmed via DevTools - data-test sits directly on the <button> here, no wrapper
    await this.page.getByTestId('bankaccount-submit').click();
  }

    // Scopes to the specific account row by its bank name, since the Delete button's
  // data-test value is identical across every row - clicking it unscoped would hit
  // whichever account Playwright finds first, not necessarily the one we mean
  getAccountRow(bankName: string) {
    return this.page.locator('[data-test^="bankaccount-list-item-"]').filter({ hasText: bankName });
  }

  async deleteAccount(bankName: string) {
    await this.getAccountRow(bankName).getByTestId('bankaccount-delete').click();
  }
}
