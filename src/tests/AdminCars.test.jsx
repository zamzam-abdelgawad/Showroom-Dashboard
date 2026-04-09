import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import AdminCars from '../admin/pages/Cars';
import { CarsContext } from '../admin/context/CarsContext';
import { AuthContext } from '../shared/context/AuthContext';
import { ToastProvider } from '../shared/context/ToastContext';
import { MemoryRouter } from 'react-router-dom';

const mockAddCar = vi.fn();
const mockUpdateCar = vi.fn();
const mockDeleteCar = vi.fn();

const renderWithContext = (isAdmin = true) => {
  const carsVal = {
    cars: [
      { id: 'car-1', name: 'Car A', brand: 'Brand A', status: 'Available', sellingPrice: 100 },
      { id: 'car-2', name: 'Car B', brand: 'Brand B', status: 'Available', sellingPrice: 200 }
    ],
    loading: false,
    addCar: mockAddCar,
    updateCar: mockUpdateCar,
    deleteCar: mockDeleteCar
  };

  const authVal = {
    user: { uid: 'admin-1', role: isAdmin ? 'admin' : 'user' },
    isAdmin: isAdmin
  };

  return render(
    <ToastProvider>
      <AuthContext.Provider value={authVal}>
        <CarsContext.Provider value={carsVal}>
          <MemoryRouter>
            <AdminCars />
          </MemoryRouter>
        </CarsContext.Provider>
      </AuthContext.Provider>
    </ToastProvider>
  );
};

describe('AdminCars', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders car list', () => {
    renderWithContext(true);
    expect(screen.getByText('Brand A Car A')).toBeInTheDocument();
    expect(screen.getByText('Brand B Car B')).toBeInTheDocument();
  });

  it('opens add car modal when clicking Add Car', () => {
    renderWithContext(true);
    const addBtn = screen.getByRole('button', { name: /Add Car/i });
    fireEvent.click(addBtn);
    expect(screen.getByText('Add New Car')).toBeInTheDocument();
  });

  it('allows adding a new car', async () => {
    renderWithContext(true);
    fireEvent.click(screen.getByRole('button', { name: /Add Car/i }));
    
    // Fill out form
    fireEvent.change(screen.getByPlaceholderText(/M3 Competition/i), { target: { value: 'New Car' } });
    fireEvent.change(screen.getByPlaceholderText(/BMW/i), { target: { value: 'New Brand' } });
    fireEvent.change(screen.getByPlaceholderText(/48000/i), { target: { value: '5000' } });
    fireEvent.change(screen.getByPlaceholderText(/50000/i), { target: { value: '6000' } });
    fireEvent.change(screen.getByPlaceholderText(/2024/i), { target: { value: '2024' } });

    const submitBtn = screen.getByRole('button', { name: /Confirm Addition/i });
    fireEvent.submit(submitBtn.closest('form'));

    await waitFor(() => {
      expect(mockAddCar).toHaveBeenCalledWith({
        name: 'New Car',
        brand: 'New Brand',
        officialPrice: 5000,
        sellingPrice: 6000,
        modelYear: 2024,
        status: 'Available',
        specs: {
          engine: '',
          color: '',
          mileage: ''
        }
      });
    });
  });

  it('opens edit car modal and submits update', async () => {
    renderWithContext(true);
    const editBtns = screen.getAllByTitle('Edit');
    fireEvent.click(editBtns[0]); // Edit first car

    expect(screen.getByText('Edit Car')).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText(/M3 Competition/i);
    expect(nameInput.value).toBe('Car A'); // initial data

    fireEvent.change(nameInput, { target: { value: 'Updated Car A' } });
    
    // Because initial data doesnt have prices, we need to supply them so validation passes
    fireEvent.change(screen.getByPlaceholderText(/48000/i), { target: { value: '1000' } });
    fireEvent.change(screen.getByPlaceholderText(/50000/i), { target: { value: '1200' } });
    fireEvent.change(screen.getByPlaceholderText(/2024/i), { target: { value: '2022' } });

    const saveBtn = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.submit(saveBtn.closest('form'));

    await waitFor(() => {
      expect(mockUpdateCar).toHaveBeenCalled();
      expect(mockUpdateCar).toHaveBeenCalledWith('car-1', expect.objectContaining({ name: 'Updated Car A' }));
    });
  });

  it('allows deleting a car', async () => {
    renderWithContext(true);
    const deleteBtns = screen.getAllByTitle('Delete');
    fireEvent.click(deleteBtns[0]); // Delete first car

    const dialog = screen.getByRole('dialog');
    const confirmBtn = within(dialog).getByRole('button', { name: /Delete/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(mockDeleteCar).toHaveBeenCalledWith('car-1');
    });
  });
});
