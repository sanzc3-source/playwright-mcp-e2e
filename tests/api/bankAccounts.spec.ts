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

});