import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Users from '../pages/Users';
import { UsersProvider } from '../context/UsersContext';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { api } from '../services/api';

vi.mock('../context/AuthContext', async () => {
  const actual = await vi.importActual('../context/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn()
  };
});

vi.mock('../services/api');

const mockUsersData = {
  data: {
    users: [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', image: '' },
      { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', image: '' }
    ],
    total: 2
  }
};

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
    api.get.mockResolvedValue(mockUsersData);
    vi.clearAllMocks();
  });

  it('fetches and displays users', async () => {
    renderWithProviders(<Users />);
    expect(screen.getByText(/User Management/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
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
