import { test, expect } from '../../src/fixtures/api.fixture.js';

// Tests the transaction endpoints - list, contacts, public feed, create, get-one, update
test.describe('Transactions API', () => {
  test('GET /transactions returns a list for the authenticated user', async ({ apiClient }) => {
    const response = await apiClient.get('/transactions');

    expect(response.status()).toBe(200);

    // Confirmed from backend source: wrapped in "results", same shape as bankAccounts
    const body = await response.json();
    expect(Array.isArray(body.results)).toBe(true);
  });

  test('GET /transactions/contacts returns transactions scoped to contacts', async ({ apiClient }) => {
    const response = await apiClient.get('/transactions/contacts');

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body.results)).toBe(true);
  });

  test('GET /transactions/public returns the public feed', async ({ apiClient }) => {
    const response = await apiClient.get('/transactions/public');

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body.results)).toBe(true);
  });

  test('POST /transactions creates a payment transaction', async ({ apiClient }) => {
    const response = await apiClient.post('/transactions', {
      transactionType: 'payment',
      receiverId: 'GjWovtg2hr',
      description: 'Playwright test payment',
      amount: 100,
    });

    expect(response.status()).toBe(200);

    // Confirmed from backend source: single-transaction route wraps it in "transaction"
    const body = await response.json();
    expect(body.transaction.description).toBe('Playwright test payment');
    expect(body.transaction.amount).toBe(10000); // API stores amount in cents - confirmed via live response, 100 input became 10000
  });

  test('GET /transactions/:id returns a single transaction', async ({ apiClient }) => {
    // Grab a real transaction ID from the list endpoint first - no hardcoded guesses
    const listResponse = await apiClient.get('/transactions');
    const listBody = await listResponse.json();
    const firstTransactionId = listBody.results[0].id;

    const response = await apiClient.get(`/transactions/${firstTransactionId}`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.transaction.id).toBe(firstTransactionId);
  });

  test('PATCH /transactions/:id updates requestStatus on a request transaction', async ({ apiClient }) => {
    // requestStatus only applies to "request" type transactions, not "payment" -
    // create one here so this test doesn't depend on seeded data having the right type
    const createResponse = await apiClient.post('/transactions', {
      transactionType: 'request',
      receiverId: 'GjWovtg2hr',
      description: 'Playwright test request',
      amount: 50,
    });
    const createBody = await createResponse.json();
    const requestTransactionId = createBody.transaction.id;

    const patchResponse = await apiClient.patch(`/transactions/${requestTransactionId}`, {
      requestStatus: 'accepted',
    });

    // Confirmed from backend source: PATCH returns 204 with no body on success
    expect(patchResponse.status()).toBe(204);
  });
});
