import type { APIRequestContext } from '@playwright/test';

// Wraps apiContext so test files call apiClient.get(...) instead of
// repeating raw apiContext calls and response-status checks everywhere
export class ApiClient {
  // readonly: this reference never changes after construction
  private readonly context: APIRequestContext;

  constructor(context: APIRequestContext) {
    this.context = context;
  }

  // Thin wrapper around GET — a single place to add logging/headers later
  async get(path: string) {
    return this.context.get(path);
  }

  // Thin wrapper around POST — takes an optional JSON body
  async post(path: string, data?: object) {
    return this.context.post(path, { data });
  }
}