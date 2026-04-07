import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { signInWithEmailAndPassword } from "firebase/auth";

// Mock Firebase Auth module
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  signInWithEmailAndPassword: vi.fn(),
  onAuthStateChanged: vi.fn((auth, callback) => {
    // Call callback with null user (not logged in)
    callback(null);
    // Return unsubscribe function
    return vi.fn();
  }),
}));

// Mock Firebase app
vi.mock('../firebase', () => ({
  auth: {},
  db: {},
}));

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          {component}
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('renders login form correctly', async () => {
    renderWithProviders(<Login />);
    
    // Use findBy for async rendering
    expect(await screen.findByText(/Welcome Back/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/admin@admin.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
  });

  it('shows error on invalid login', async () => {
    // Mock failure for this specific test
    vi.mocked(signInWithEmailAndPassword).mockRejectedValueOnce({
      code: 'auth/invalid-credential'
    });
    
    renderWithProviders(<Login />);
    
    const emailInput = await screen.findByPlaceholderText(/admin@admin.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    const submitBtn = screen.getByRole('button', { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@user.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
    });
  });

  it('handles successful login', async () => {
    // Mock success for this test
    vi.mocked(signInWithEmailAndPassword).mockResolvedValueOnce({
      user: { uid: 'admin-123', email: 'admin@admin.com' }
    });
    
    renderWithProviders(<Login />);
    
    const emailInput = await screen.findByPlaceholderText(/admin@admin.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    const submitBtn = screen.getByRole('button', { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: 'admin@admin.com' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });
    
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Successfully logged in/i)).toBeInTheDocument();
    });
  });
});