import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CarsContext = createContext();

export function CarsProvider({ children }) {
  const [cars, setCars] = useState(() => {
    const savedCars = localStorage.getItem('showroom_cars_v2');
    if (savedCars) return JSON.parse(savedCars);
    return [
      { id: 1, name: "X5 xDrive40i", brand: "BMW", officialPrice: 60000, sellingPrice: 65000, modelYear: 2023, status: "Available", images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800"], specs: { engine: "3.0L V6", color: "Black", mileage: "12,000" } },
      { id: 2, name: "Model S Plaid", brand: "Tesla", officialPrice: 80000, sellingPrice: 85000, modelYear: 2024, status: "Sold", images: ["https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800"], specs: { engine: "Tri-Motor AWD", color: "Red", mileage: "5,000" } },
      { id: 3, name: "C-Class C300", brand: "Mercedes", officialPrice: 42000, sellingPrice: 45000, modelYear: 2023, status: "Available", images: ["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800"], specs: { engine: "2.0L I4", color: "Silver", mileage: "25,000" } },
      { id: 4, name: "911 Carrera", brand: "Porsche", officialPrice: 110000, sellingPrice: 120000, modelYear: 2022, status: "Sold", images: ["https://images.unsplash.com/photo-1503376713356-fcaddfb2210b?auto=format&fit=crop&q=80&w=800"], specs: { engine: "3.0L Flat-6", color: "White", mileage: "8,500" } },
      { id: 5, name: "Q7 Premium Plus", brand: "Audi", officialPrice: 65000, sellingPrice: 70000, modelYear: 2024, status: "Available", images: ["https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=800"], specs: { engine: "3.0L V6", color: "Blue", mileage: "3,000" } }
    ];
  });
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem('showroom_cars_v2', JSON.stringify(cars));
  }, [cars]);

  const addCar = async (carData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCar = {
          ...carData,
          id: Date.now(),
        };
        setCars(prev => [newCar, ...prev]);
        resolve(newCar);
      }, 500);
    });
  };

  const updateCar = async (id, updates) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setCars(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
        resolve();
      }, 500);
    });
  };

  const deleteCar = async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setCars(prev => prev.filter(c => c.id !== id));
        resolve();
      }, 400);
    });
  };

  const markAsSold = async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setCars(prev => prev.map(c => c.id === id ? { ...c, status: "Sold" } : c));
        resolve();
      }, 300);
    });
  };

  return (
    <CarsContext.Provider value={{ cars, loading, addCar, updateCar, deleteCar, markAsSold }}>
      {children}
    </CarsContext.Provider>
  );
}

export const useCars = () => useContext(CarsContext);
