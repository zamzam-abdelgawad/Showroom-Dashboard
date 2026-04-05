import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Cars from '../pages/Cars';
import { AuthProvider } from '../context/AuthContext';
import { CarsProvider } from '../context/CarsContext';
import { RequestsProvider } from '../context/RequestsContext';
import { TeamProvider } from '../context/TeamContext';
import { ToastProvider } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

vi.mock('../context/AuthContext', async () => {
  const actual = await vi.importActual('../context/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn()
  };
});

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <RequestsProvider>
            <TeamProvider>
              <CarsProvider>
                {component}
              </CarsProvider>
            </TeamProvider>
          </RequestsProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

describe('Cars Module Implementation', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: { role: 'admin' },
      loading: false
    });
  });
  it('renders correctly and shows base dummy inventory', () => {
    renderWithProviders(<Cars />);
    expect(screen.getByText(/Cars Inventory/i)).toBeInTheDocument();
    expect(screen.getByText(/X5 xDrive40i/i)).toBeInTheDocument();
  });

  it('can open add car modal properly', () => {
    renderWithProviders(<Cars />);
    const addBtn = screen.getByRole('button', { name: /Add Car/i });
    fireEvent.click(addBtn);
    expect(screen.getByText(/Add New Car/i)).toBeInTheDocument();
  });

  it('filters out properties by status safely', async () => {
    renderWithProviders(<Cars />);

    const combobox = screen.getByRole('combobox');
    fireEvent.change(combobox, { target: { value: 'sold' } });

    await waitFor(() => {
      expect(screen.queryByText(/X5 xDrive40i/i)).not.toBeInTheDocument();
      expect(screen.getByText(/911 Carrera/i)).toBeInTheDocument();
    });
  });
});
