import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Global Firebase Mocks
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  onAuthStateChanged: vi.fn((auth, callback) => {
    // Simulate an unauthenticated user by default
    callback(null);
    return vi.fn(); // Unsubscribe
  }),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn((auth, email, password) => {
    return Promise.resolve({ user: { uid: 'new-user-123', email } });
  }),
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
    query: vi.fn((collectionRef, ...queryConstraints) => ({ collectionRef, queryConstraints })),
    where: vi.fn((fieldPath, opStr, value) => ({ type: 'where', fieldPath, opStr, value })),
    orderBy: vi.fn((fieldPath, directionStr) => ({ type: 'orderBy', fieldPath, directionStr })),
    onSnapshot: vi.fn((q, callback) => {
      callback({
        docs: [] // default empty
      });
      return vi.fn(); // Unsubscribe
    }),
    addDoc: vi.fn(() => Promise.resolve({ id: 'new-doc-id' })),
    updateDoc: vi.fn(() => Promise.resolve()),
    deleteDoc: vi.fn(() => Promise.resolve()),
    setDoc: vi.fn(() => Promise.resolve()),
    getDoc: vi.fn(() => Promise.resolve(mockDoc({ role: 'admin', name: 'Test Admin', email: 'admin@admin.com' }))),
    getDocs: vi.fn(() => Promise.resolve({ empty: true, docs: [] })),
  };
});

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(() => ({})),
}));
