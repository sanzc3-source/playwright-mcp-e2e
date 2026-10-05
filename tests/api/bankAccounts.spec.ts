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
});