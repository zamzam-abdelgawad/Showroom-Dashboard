import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CarsContext = createContext();

export function CarsProvider({ children }) {
  const [cars, setCars] = useState(() => {
    const savedCars = localStorage.getItem('showroom_cars');
    if (savedCars) return JSON.parse(savedCars);
    return [
      { id: 1, name: "X5 xDrive40i", brand: "BMW", price: 65000, modelYear: 2023, status: "Available" },
      { id: 2, name: "Model S Plaid", brand: "Tesla", price: 85000, modelYear: 2024, status: "Sold" },
      { id: 3, name: "C-Class C300", brand: "Mercedes", price: 45000, modelYear: 2023, status: "Available" },
      { id: 4, name: "911 Carrera", brand: "Porsche", price: 120000, modelYear: 2022, status: "Sold" },
      { id: 5, name: "Q7 Premium Plus", brand: "Audi", price: 70000, modelYear: 2024, status: "Available" }
    ];
  });
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem('showroom_cars', JSON.stringify(cars));
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
