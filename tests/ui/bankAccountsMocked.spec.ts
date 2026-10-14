import { test, expect } from '../../src/fixtures/auth.fixture.js';

// Tests the UI's empty-state rendering by mocking the GraphQL response -
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
});