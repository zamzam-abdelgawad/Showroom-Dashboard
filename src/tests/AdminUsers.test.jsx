import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminUsers from '../admin/pages/Users';
import { UsersContext } from '../admin/context/UsersContext';
import { AuthContext } from '../shared/context/AuthContext';
import { ToastProvider } from '../shared/context/ToastContext';
import { MemoryRouter } from 'react-router-dom';

const mockAddUser = vi.fn();
const mockUpdateUser = vi.fn();
const mockDeleteUser = vi.fn();

const renderWithContext = (isAdmin = true) => {
  const usersVal = {
    users: [
      { id: 'user-1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', status: 'Active' },
      { id: 'user-2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', status: 'Inactive' }
    ],
    loading: false,
    addUser: mockAddUser,
    updateUser: mockUpdateUser,
    deleteUser: mockDeleteUser
  };

  const authVal = {
    user: { uid: 'admin-1', role: isAdmin ? 'admin' : 'user' },
    isAdmin: isAdmin
  };

  return render(
    <ToastProvider>
      <AuthContext.Provider value={authVal}>
        <UsersContext.Provider value={usersVal}>
          <MemoryRouter>
            <AdminUsers />
          </MemoryRouter>
        </UsersContext.Provider>
      </AuthContext.Provider>
    </ToastProvider>
  );
};

describe('AdminUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders user list', () => {
    renderWithContext(true);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('opens add user modal', () => {
    renderWithContext(true);
    const addBtn = screen.getByRole('button', { name: /Add User/i });
    fireEvent.click(addBtn);
    expect(screen.getByText('Add New User')).toBeInTheDocument();
  });

  it('adds a new user', async () => {
    renderWithContext(true);
    fireEvent.click(screen.getByRole('button', { name: /Add User/i }));
    
    // Fill out form
    fireEvent.change(screen.getByPlaceholderText('John'), { target: { value: 'New' } });
    fireEvent.change(screen.getByPlaceholderText('Doe'), { target: { value: 'Tester' } });
    fireEvent.change(screen.getByPlaceholderText(/john.doe@example.com/i), { target: { value: 'tester@example.com' } });

    const submitBtn = screen.getByRole('button', { name: /Create User/i });
    fireEvent.submit(submitBtn.closest('form'));

    await waitFor(() => {
      expect(mockAddUser).toHaveBeenCalledWith({
        firstName: 'New',
        lastName: 'Tester',
        email: 'tester@example.com',
        status: 'Active'
      });
    });
  });

  it('edits a user', async () => {
    renderWithContext(true);
    const editBtns = screen.getAllByTitle('Edit');
    fireEvent.click(editBtns[0]); // Edit John Doe

    const firstNameInput = screen.getByPlaceholderText('John');
    expect(firstNameInput.value).toBe('John');

    fireEvent.change(firstNameInput, { target: { value: 'Johnny' } });
    
    const saveBtn = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.submit(saveBtn.closest('form'));

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalled();
      expect(mockUpdateUser).toHaveBeenCalledWith('user-1', expect.objectContaining({ firstName: 'Johnny' }));
    });
  });
});
