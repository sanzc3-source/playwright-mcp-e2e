import { test as base, type APIRequestContext } from '@playwright/test';
import { ApiClient } from '../api/ApiClient.js';

// Shape of our custom fixtures — now exposing both the raw context and the wrapped client
type ApiFixtures = {
  apiContext: APIRequestContext;
  apiClient: ApiClient;
};

// Extends Playwright's base test with an authenticated API request context and client
export const test = base.extend<ApiFixtures>({
  // apiContext: hands tests a request context that's already authenticated,
  // reusing the same session cookie saved by auth.setup.ts
  apiContext: async ({ playwright }, use) => {
    // newContext() builds a fresh API client, loading the same storageState
    // file our browser fixture uses, so the backend recognizes this as a logged-in user
    const context = await playwright.request.newContext({
      baseURL: 'http://localhost:3001',
      storageState: 'playwright/.auth/user.json',
    });

    // hand the ready context to the test
    await use(context);

    // dispose cleans up the underlying connection once the test finishes
    await context.dispose();
  },

  // apiClient: wraps apiContext in our reusable ApiClient class
  apiClient: async ({ apiContext }, use) => {
    await use(new ApiClient(apiContext));
  },
});

export { expect } from '@playwright/test';