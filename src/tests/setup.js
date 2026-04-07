import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Global Firebase Mocks
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  onAuthStateChanged: vi.fn((auth, callback) => {
    // Simulate an authenticated admin user for most tests
    callback({ uid: 'test-admin-123', email: 'admin@admin.com' });
    return vi.fn(); // Unsubscribe
  }),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('firebase/firestore', () => {
  const mockDoc = (data) => ({
    exists: () => true,
    data: () => data,
    id: data.id || 'mock-id'
  });

  return {
    getFirestore: vi.fn(() => ({})),
    collection: vi.fn(),
    doc: vi.fn(),
    query: vi.fn(),
    orderBy: vi.fn(),
    onSnapshot: vi.fn((q, callback) => {
      // We will override this in individual tests if needed, 
      // but by default, return empty snapshots or basic dummy data.
      callback({
        docs: []
      });
      return vi.fn(); // Unsubscribe
    }),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    getDoc: vi.fn(() => Promise.resolve(mockDoc({ role: 'admin', name: 'Test Admin' }))),
  };
});

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(() => ({})),
}));
