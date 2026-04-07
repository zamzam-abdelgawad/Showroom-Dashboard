import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Cars from '../pages/Cars';
import { AuthProvider } from '../context/AuthContext';
import { CarsContext, CarsProvider } from '../context/CarsContext';
import { RequestsProvider } from '../context/RequestsContext';
import { TeamProvider } from '../context/TeamContext';
import { ToastProvider } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { onSnapshot } from 'firebase/firestore';

vi.mock('../context/AuthContext', async () => {
  const actual = await vi.importActual('../context/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn()
  };
});

const mockCars = [
  { id: 1, name: "X5 xDrive40i", brand: "BMW", status: "Available", firestoreId: 'car-1' },
  { id: 4, name: "911 Carrera", brand: "Porsche", status: "Sold", firestoreId: 'car-4' }
];

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

    vi.mocked(onSnapshot).mockImplementation((q, callback) => {
      // Mock snapshot for Cars
      callback({
        docs: mockCars.map(c => ({
          id: c.firestoreId,
          data: () => c
        }))
      });
      return vi.fn();
    });

    vi.clearAllMocks();
  });

  it('renders correctly and shows base inventory from firestore', async () => {
    renderWithProviders(<Cars />);
    await waitFor(() => {
      expect(screen.getByText(/Cars Inventory/i)).toBeInTheDocument();
      expect(screen.getByText(/X5 xDrive40i/i)).toBeInTheDocument();
    });
  });

  it('can open add car modal properly', async () => {
    renderWithProviders(<Cars />);
    await waitFor(() => expect(screen.getByText(/X5 xDrive40i/i)).toBeInTheDocument());
    
    const addBtn = screen.getByRole('button', { name: /Add Car/i });
    fireEvent.click(addBtn);
    expect(screen.getByText(/Add New Car/i)).toBeInTheDocument();
  });

  it('filters properties by status safely', async () => {
    renderWithProviders(<Cars />);
    await waitFor(() => expect(screen.getByText(/X5 xDrive40i/i)).toBeInTheDocument());

    const combobox = screen.getByRole('combobox');
    fireEvent.change(combobox, { target: { value: 'sold' } });

    await waitFor(() => {
      expect(screen.queryByText(/X5 xDrive40i/i)).not.toBeInTheDocument();
      expect(screen.getByText(/911 Carrera/i)).toBeInTheDocument();
    });
  });
});
