import { test, expect } from '../../src/fixtures/api.fixture.js';

// Proves apiClient carries a valid authenticated session — no browser involved at all
test('API request context is authenticated', async ({ apiClient }) => {
  const response = await apiClient.get('/checkAuth');

  // A 200 here means the backend recognized our session cookie as logged in
  expect(response.status()).toBe(200);
});