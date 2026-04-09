import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Requests from '../admin/pages/Requests';
import { RequestsContext } from '../admin/context/RequestsContext';
import { UsersContext } from '../admin/context/UsersContext';
import { CarsContext } from '../admin/context/CarsContext';
import { ToastProvider } from '../shared/context/ToastContext';
import { MemoryRouter } from 'react-router-dom';

const mockUpdateRequestStatus = vi.fn();
const mockMarkAsSold = vi.fn();

const renderWithContext = () => {
  const reqVal = {
    requests: [
      { id: 'req-1', firestoreId: 'req-1', userId: 'user-1', carId: 'car-1', status: 'pending', timestamp: new Date().toISOString() },
      { id: 'req-2', firestoreId: 'req-2', userId: 'user-2', carId: 'car-2', status: 'approved', timestamp: new Date().toISOString() },
    ],
    updateRequestStatus: mockUpdateRequestStatus
  };
  const usersVal = {
    users: [
      { id: 'user-1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
      { id: 'user-2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' }
    ]
  };
  const carsVal = {
    cars: [
      { id: 'car-1', name: 'Car A', brand: 'Brand A' },
      { id: 'car-2', name: 'Car B', brand: 'Brand B' }
    ],
    markAsSold: mockMarkAsSold
  };

  return render(
    <ToastProvider>
      <UsersContext.Provider value={usersVal}>
        <CarsContext.Provider value={carsVal}>
          <RequestsContext.Provider value={reqVal}>
            <MemoryRouter>
              <Requests />
            </MemoryRouter>
          </RequestsContext.Provider>
        </CarsContext.Provider>
      </UsersContext.Provider>
    </ToastProvider>
  );
};

describe('Requests (Admin)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders requests List', () => {
    renderWithContext();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Car A')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Car B')).toBeInTheDocument();
  });

  it('allows admin to approve request and marks car as sold', async () => {
    renderWithContext();
    const approveBtns = screen.getAllByRole('button', { name: /Approve/i });
    fireEvent.click(approveBtns[0]); // First one is pending

    await waitFor(() => {
      expect(mockUpdateRequestStatus).toHaveBeenCalledWith('req-1', 'approved');
      expect(mockMarkAsSold).toHaveBeenCalledWith('car-1');
    });
  });

  it('allows admin to reject request', async () => {
    renderWithContext();
    const rejectBtns = screen.getAllByRole('button', { name: /Reject/i });
    fireEvent.click(rejectBtns[0]); 

    await waitFor(() => {
      expect(mockUpdateRequestStatus).toHaveBeenCalledWith('req-1', 'rejected');
      expect(mockMarkAsSold).not.toHaveBeenCalled();
    });
  });
});
