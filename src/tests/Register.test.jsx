import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from './test-utils';
import Register from '../customer/pages/Register';
import { AuthContext } from '../shared/context/AuthContext';

// We need to properly mock the navigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockRegister = vi.fn();

const renderWithContext = () => {
  return render(
    <AuthContext.Provider value={{ register: mockRegister, user: null }}>
      <Register />
    </AuthContext.Provider>
  );
};

describe('Register Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders registration form', async () => {
    renderWithContext();
    expect(screen.getByRole('heading', { name: /Create Account/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/John Doe/i)).toBeInTheDocument();
  });

  it('shows error on invalid email and short password', async () => {
    renderWithContext();
    
    const nameInput = screen.getByPlaceholderText(/John Doe/i);
    const emailInput = screen.getByPlaceholderText(/john@example.com/i);
    const passwordInput = screen.getAllByPlaceholderText(/••••••••/i)[0];
    const confirmInput = screen.getAllByPlaceholderText(/••••••••/i)[1];
    const submitBtn = screen.getByRole('button', { name: /Create Account/i });

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.change(confirmInput, { target: { value: '123' } });
    
    fireEvent.submit(submitBtn.closest('form'));

    await waitFor(() => {
      // It should display validation errors
      expect(screen.getByText(/Invalid email format/i)).toBeInTheDocument();
      expect(screen.getByText(/Password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });

  it('calls register function successfully and navigates', async () => {
    renderWithContext();
    
    const nameInput = screen.getByPlaceholderText(/John Doe/i);
    const emailInput = screen.getByPlaceholderText(/john@example.com/i);
    const passwordInput = screen.getAllByPlaceholderText(/••••••••/i)[0];
    const confirmInput = screen.getAllByPlaceholderText(/••••••••/i)[1];
    const submitBtn = screen.getByRole('button', { name: /Create Account/i });

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });

    fireEvent.submit(submitBtn.closest('form'));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
