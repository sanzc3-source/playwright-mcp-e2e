import { test, expect } from '../../src/fixtures/api.fixture.js';

// Tests the user endpoints - list, search, create (public signup), get-one, public profile, update
test.describe('Users API', () => {
  test('GET /users returns all other users, excluding yourself', async ({ apiClient }) => {
    const response = await apiClient.get('/users');

    expect(response.status()).toBe(200);

    // Confirmed from backend source: removeUserFromResults strips the logged-in user out of the list
    const body = await response.json();
    expect(Array.isArray(body.results)).toBe(true);
    const matchesSelf = body.results.some((user: { username: string }) => user.username === 'Heath93');
    expect(matchesSelf).toBe(false);
  });

  test('GET /users/search finds another user, excluding yourself', async ({ apiClient }) => {
    // Searching your own name would return empty - search also filters out the logged-in user.
    // Using a different seeded user's name here on purpose.
    const response = await apiClient.get('/users/search?q=Arvilla');

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body.results)).toBe(true);
    expect(body.results.length).toBeGreaterThan(0);
    expect(body.results[0].username).toContain('Arvilla');
  });

  test('POST /users creates a new user without requiring auth', async ({ apiClient }) => {
    // Confirmed from backend source: this route has no ensureAuthenticated middleware - public signup
    const response = await apiClient.post('/users', {
      username: 'pw_test_user',
      password: 's3cret',
      firstName: 'Playwright',
      lastName: 'Tester',
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.user.username).toBe('pw_test_user');
  });

  test('GET /users/:userId returns your own profile', async ({ apiClient }) => {
    // Heath93's real seeded ID - confirmed via `yarn list:dev:users`
    const ownUserId = 'uBmeaz5pX';

    const response = await apiClient.get(`/users/${ownUserId}`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.user.id).toBe(ownUserId);
  });

  test('GET /users/:userId returns 401 for a different user\'s id', async ({ apiClient }) => {
    // Confirmed from backend source: this route only allows fetching your own id - everyone else is 401
    const otherUserId = 'GjWovtg2hr'; // Arvilla_Hegmann's real seeded id

    const response = await apiClient.get(`/users/${otherUserId}`);

    expect(response.status()).toBe(401);
  });

  test('GET /users/profile/:username returns only public fields', async ({ apiClient }) => {
    const response = await apiClient.get('/users/profile/Heath93');

    expect(response.status()).toBe(200);

    // Confirmed from backend source: pick(["firstName", "lastName", "avatar"]) - nothing sensitive should leak
    const body = await response.json();
    expect(body.user).toHaveProperty('firstName');
    expect(body.user).toHaveProperty('lastName');
    expect(body.user).toHaveProperty('avatar');
    expect(body.user).not.toHaveProperty('password');
  });

  test('PATCH /users/:userId updates your own profile', async ({ apiClient }) => {
    const ownUserId = 'uBmeaz5pX';

    const response = await apiClient.patch(`/users/${ownUserId}`, {
      firstName: 'UpdatedFirstName',
    });

    // Confirmed from backend source: PATCH returns 204 with no body on success
    expect(response.status()).toBe(204);
  });
});
