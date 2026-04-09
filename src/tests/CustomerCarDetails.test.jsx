import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CustomerCarDetails from '../customer/pages/CarDetails';
import { CustomerCarsContext } from '../customer/context/CustomerCarsContext';
import { CustomerRequestsContext } from '../customer/context/CustomerRequestsContext';
import { AuthContext } from '../shared/context/AuthContext';
import { ToastProvider } from '../shared/context/ToastContext';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockAddRequest = vi.fn();
const mockCar = { id: 'car-1', name: 'Test Car', brand: 'Test Brand', status: 'Available', sellingPrice: 50000 };

const renderWithContext = (authExt, requestsExt, carId = 'car-1') => {
  const authVal = { user: null, ...authExt };
  const requestsVal = { requests: [], addRequest: mockAddRequest, ...requestsExt };
  const carsVal = { cars: [mockCar], loading: false };

  return render(
    <ToastProvider>
      <AuthContext.Provider value={authVal}>
        <CustomerCarsContext.Provider value={carsVal}>
          <CustomerRequestsContext.Provider value={requestsVal}>
            <MemoryRouter initialEntries={[`/cars/${carId}`]}>
              <Routes>
                <Route path="/cars/:id" element={<CustomerCarDetails />} />
              </Routes>
            </MemoryRouter>
          </CustomerRequestsContext.Provider>
        </CustomerCarsContext.Provider>
      </AuthContext.Provider>
    </ToastProvider>
  );
};

describe('CustomerCarDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders car details correctly', () => {
    renderWithContext();
    expect(screen.getByText('Test Car')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });

  it('redirects to login when clicking Buy Now and not logged in', () => {
    renderWithContext({ user: null });
    const buyBtn = screen.getByRole('button', { name: /Buy Now/i });
    fireEvent.click(buyBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/login', { state: { from: '/cars/car-1' } });
  });

  it('submits a request when clicking Buy Now and logged in', async () => {
    renderWithContext({ user: { uid: 'user-123' } }, { requests: [] });
    const buyBtn = screen.getByRole('button', { name: /Buy Now/i });
    fireEvent.click(buyBtn);

    await waitFor(() => {
      expect(mockAddRequest).toHaveBeenCalledWith('user-123', 'car-1');
    });
  });

  it('shows Request Pending if request already exists', () => {
    renderWithContext(
      { user: { uid: 'user-123' } },
      { requests: [{ carId: 'car-1', status: 'pending' }] }
    );
    const pendingBtn = screen.getByRole('button', { name: /Request Pending/i });
    expect(pendingBtn).toBeInTheDocument();
    expect(pendingBtn).toBeDisabled();
  });
});
