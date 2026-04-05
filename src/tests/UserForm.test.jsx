import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserFormModal } from '../components/users/UserFormModal';

describe('UserFormModal Component', () => {
  it('renders form inputs correctly', () => {
    render(<UserFormModal isOpen={true} onClose={() => {}} onSubmit={() => {}} />);
    
    expect(screen.getByText(/Add New User/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("John")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Doe")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("john.doe@example.com")).toBeInTheDocument();
  });

  it('validates empty inputs on submit', async () => {
    render(<UserFormModal isOpen={true} onClose={() => {}} onSubmit={() => {}} />);
    
    fireEvent.click(screen.getByRole('button', { name: /Create User/i }));

    expect(await screen.findByText(/First name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Last name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
  });

  it('handles successful submission data', async () => {
    const handleSubmit = vi.fn();
    render(<UserFormModal isOpen={true} onClose={() => {}} onSubmit={handleSubmit} />);
    
    fireEvent.change(screen.getByPlaceholderText("John"), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByPlaceholderText("Doe"), { target: { value: 'Smith' } });
    fireEvent.change(screen.getByPlaceholderText("john.doe@example.com"), { target: { value: 'jane@smith.com' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Create User/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@smith.com',
        status: 'Active'
      });
    });
  });
});
