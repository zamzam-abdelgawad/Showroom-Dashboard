import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Users from '../pages/Users';
import { UsersProvider } from '../context/UsersContext';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { onSnapshot } from "firebase/firestore";

vi.mock('../context/AuthContext', async () => {
  const actual = await vi.importActual('../context/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn()
  };
});

// Provide mock data for onSnapshot
const mockUsers = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'user', firestoreId: 'user-1' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'admin', firestoreId: 'user-2' }
];

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <UsersProvider>
            {component}
          </UsersProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

describe('Users Page CRUD Integration', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: { role: 'admin' },
      loading: false
    });
    
    // Default implementation for onSnapshot in this test file
    vi.mocked(onSnapshot).mockImplementation((q, callback) => {
      callback({
        docs: mockUsers.map(u => ({
          id: u.firestoreId,
          data: () => u
        }))
      });
      return vi.fn();
    });
    
    vi.clearAllMocks();
  });

  it('fetches and displays users from firestore', async () => {
    renderWithProviders(<Users />);
    await waitFor(() => {
      expect(screen.getByText(/User Management/i)).toBeInTheDocument();
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
    });
  });

  it('can open add user modal', async () => {
    renderWithProviders(<Users />);
    await waitFor(() => expect(screen.getByText(/John Doe/i)).toBeInTheDocument());

    const addBtn = screen.getByRole('button', { name: /Add User/i });
    fireEvent.click(addBtn);

    expect(screen.getByText(/Add New User/i)).toBeInTheDocument();
  });

  it('can open delete confirm modal from row action', async () => {
    renderWithProviders(<Users />);
    await waitFor(() => expect(screen.getByText(/John Doe/i)).toBeInTheDocument());

    const deleteBtns = screen.getAllByTitle(/Delete/i);
    fireEvent.click(deleteBtns[0]);

    expect(screen.getByText(/Confirm Deletion/i)).toBeInTheDocument();
  });
});
