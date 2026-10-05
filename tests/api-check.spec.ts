import { test, expect } from '../src/fixtures/api.fixture.js';

// Proves apiContext carries a valid authenticated session — no browser involved at all
test('API request context is authenticated', async ({ apiContext }) => {
  const response = await apiContext.get('/checkAuth');

  // A 200 here means the backend recognized our session cookie as logged in
  expect(response.status()).toBe(200);
});