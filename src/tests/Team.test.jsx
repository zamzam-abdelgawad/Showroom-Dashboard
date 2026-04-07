import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Team from '../pages/Team';
import { TeamProvider } from '../context/TeamContext';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider } from '../context/AuthContext';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <TeamProvider>
            {component}
          </TeamProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

describe('Team Module - Add Staff', () => {
  it('opens the add staff modal when clicking the button', async () => {
    renderWithProviders(<Team />);
    const addBtn = await screen.findByRole('button', { name: /Add Staff Member/i });
    fireEvent.click(addBtn);
    expect(screen.getByText(/Add New Staff Member/i)).toBeInTheDocument();
  });

  it('validates the form correctly', async () => {
    renderWithProviders(<Team />);
    const addBtn = await screen.findByRole('button', { name: /Add Staff Member/i });
    fireEvent.click(addBtn);
    
    const submitBtn = await screen.findByRole('button', { name: /Confirm Staff Member/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Phone number is required/i)).toBeInTheDocument();
    });
  });
});
