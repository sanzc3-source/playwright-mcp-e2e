import { test, expect } from '../../src/fixtures/api.fixture.js';

// Tests the bank account endpoints — list, get-one, create, delete
test.describe('Bank Accounts API', () => {
  test('GET /bankAccounts returns a list for the authenticated user', async ({ apiClient }) => {
    const response = await apiClient.get('/bankAccounts');

    // A logged-out or invalid session would fail here instead
    expect(response.status()).toBe(200);

    // The route wraps accounts in a "results" array — confirmed from backend source
    const body = await response.json();
    expect(Array.isArray(body.results)).toBe(true);
  });

    test('GET /bankAccounts/:id returns a single account', async ({ apiClient }) => {
    // Grab a real account ID from the list endpoint first — no hardcoded guesses
    const listResponse = await apiClient.get('/bankAccounts');
    const listBody = await listResponse.json();
    const firstAccountId = listBody.results[0].id;

    const response = await apiClient.get(`/bankAccounts/${firstAccountId}`);

    expect(response.status()).toBe(200);

    // Confirmed from backend source: single-account route wraps it in "account", not "results"
    const body = await response.json();
    expect(body.account.id).toBe(firstAccountId);
  });

    test('POST /bankAccounts creates a new account', async ({ apiClient }) => {
    const newAccount = {
      bankName: 'Test Bank',
      accountNumber: '123456789',
      routingNumber: '987654321',
    };

    const response = await apiClient.post('/bankAccounts', newAccount);

    expect(response.status()).toBe(200);

    // Confirm the created account actually has the data we sent
    const body = await response.json();
    expect(body.account.bankName).toBe(newAccount.bankName);
    expect(body.account.accountNumber).toBe(newAccount.accountNumber);
  });

    test('DELETE /bankAccounts/:id removes an account', async ({ apiClient }) => {
    // Create an account specifically to delete, so this test doesn't depend on data from other tests
    const createResponse = await apiClient.post('/bankAccounts', {
      bankName: 'Delete Me Bank',
      accountNumber: '111111111',
      routingNumber: '222222222',
    });
    const createBody = await createResponse.json();
    const accountId = createBody.account.id;

    const response = await apiClient.delete(`/bankAccounts/${accountId}`);

    expect(response.status()).toBe(200);
  });

});