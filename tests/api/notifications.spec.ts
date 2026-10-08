import { test, expect } from '../../src/fixtures/api.fixture.js';

// Tests the notification endpoints - bulk create, list unread, mark as read
test.describe('Notifications API', () => {
  test('POST /notifications/bulk, then GET /notifications shows it unread, then PATCH marks it read', async ({ apiClient }) => {
    // Grab a real transaction ID first - no hardcoded guesses
    const listResponse = await apiClient.get('/transactions');
    const listBody = await listResponse.json();
    const realTransactionId = listBody.results[0].id;

    // Confirmed from backend source: createPaymentNotification just stores transactionId
    // as a plain string, no lookup that could fail - but using a real one anyway for realism
    const createResponse = await apiClient.post('/notifications/bulk', {
      items: [
        {
          type: 'payment',
          transactionId: realTransactionId,
          status: 'requested',
        },
      ],
    });

    expect(createResponse.status()).toBe(200);

    const createBody = await createResponse.json();
    const createdNotification = createBody.results[0];
    expect(createdNotification.transactionId).toBe(realTransactionId);
    expect(createdNotification.isRead).toBe(false);

    // Confirm it shows up in the unread list
    const unreadResponse = await apiClient.get('/notifications');
    expect(unreadResponse.status()).toBe(200);

    const unreadBody = await unreadResponse.json();
    const matchesCreated = unreadBody.results.some(
      (notification: { id: string }) => notification.id === createdNotification.id
    );
    expect(matchesCreated).toBe(true);

    // Mark it read
    const patchResponse = await apiClient.patch(`/notifications/${createdNotification.id}`, {
      isRead: true,
    });

    // Confirmed from backend source: PATCH returns 204 with no body on success
    expect(patchResponse.status()).toBe(204);
  });
});
