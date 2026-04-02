import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Cars from '../pages/Cars';
import { CarsProvider } from '../context/CarsContext';
import { ToastProvider } from '../context/ToastContext';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ToastProvider>
        <CarsProvider>
          {component}
        </CarsProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

describe('Cars Module Implementation', () => {
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
