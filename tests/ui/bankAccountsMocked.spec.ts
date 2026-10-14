import { test, expect } from '../../src/fixtures/auth.fixture.js';

// Tests the UI's handling (or lack thereof) of GraphQL responses by mocking them -
// the UI fetches bank accounts through POST /graphql with operationName "ListBankAccount"
test.describe('Bank Accounts - mocked responses', () => {
  test('shows empty state when the API returns no accounts', async ({ authedPage }) => {
    await authedPage.route('**/graphql', async (route) => {
      const requestBody = route.request().postDataJSON();

      // Only fake the ListBankAccount query - let every other GraphQL operation
      // (auth checks, other queries) hit the real backend normally
      if (requestBody.operationName === 'ListBankAccount') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { listBankAccount: [] } }),
        });
      } else {
        await route.continue();
      }
    });

    await authedPage.goto('/bankaccounts');

    // EmptyList renders this exact text and data-test when bankAccounts.length is 0
    await expect(authedPage.getByTestId('empty-list-header')).toBeVisible();
    await expect(authedPage.getByTestId('empty-list-header')).toHaveText('No Bank Accounts');
  });

  test('a failed request looks identical to the empty state - no distinct error UI exists', async ({ authedPage }) => {
    // Confirmed via frontend source: BankAccountsContainer never checks for the machine's
    // "failure" state, and dataMachine only populates results on success. A failed fetch
    // leaves results at its default empty array, so the UI falls back to the same
    // EmptyList component a real empty account list would show - there is no error message,
    // banner, or any way for the user to tell a failure happened.
    // This test documents that gap: it should start failing the moment someone adds
    // real error handling, which is the point.
    await authedPage.route('**/graphql', async (route) => {
      const requestBody = route.request().postDataJSON();

      if (requestBody.operationName === 'ListBankAccount') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ errors: [{ message: 'Internal Server Error' }] }),
        });
      } else {
        await route.continue();
      }
    });

    await authedPage.goto('/bankaccounts');

    await expect(authedPage.getByTestId('empty-list-header')).toBeVisible();
    await expect(authedPage.getByTestId('empty-list-header')).toHaveText('No Bank Accounts');
  });
});