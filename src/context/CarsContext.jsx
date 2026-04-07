import { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useToast } from './ToastContext';

const CarsContext = createContext();

export function CarsProvider({ children }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "cars"), orderBy("id", "desc"));
    
    // Real-time listener for cars collection
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const carsData = snapshot.docs.map(doc => ({
        ...doc.data(),
        firestoreId: doc.id // We keep the firestore doc id just in case
      }));
      setCars(carsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching cars:", error);
      addToast("Failed to fetch cars data", "error");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [addToast]);

  const addCar = async (carData) => {
    try {
      const newCar = {
        ...carData,
        id: Date.now(), // Still using a numeric ID for consistency with existing logic
        createdAt: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, "cars"), newCar);
      return { ...newCar, firestoreId: docRef.id };
    } catch (error) {
      console.error("Error adding car:", error);
      addToast("Failed to add car", "error");
      throw error;
    }
  };

  const updateCar = async (id, updates) => {
    try {
      // Find the document by our custom 'id' field
      // In a real app, we'd use the Firestore doc ID directly
      const carToUpdate = cars.find(c => c.id === id);
      if (carToUpdate && carToUpdate.firestoreId) {
        const carRef = doc(db, "cars", carToUpdate.firestoreId);
        await updateDoc(carRef, updates);
      }
    } catch (error) {
      console.error("Error updating car:", error);
      addToast("Failed to update car", "error");
      throw error;
    }
  };

  const deleteCar = async (id) => {
    try {
      const carToDelete = cars.find(c => c.id === id);
      if (carToDelete && carToDelete.firestoreId) {
        const carRef = doc(db, "cars", carToDelete.firestoreId);
        await deleteDoc(carRef);
      }
    } catch (error) {
      console.error("Error deleting car:", error);
      addToast("Failed to delete car", "error");
      throw error;
    }
  };

  const markAsSold = async (id) => {
    return updateCar(id, { status: "Sold" });
  };

  return (
    <CarsContext.Provider value={{ cars, loading, addCar, updateCar, deleteCar, markAsSold }}>
      {children}
    </CarsContext.Provider>
  );
}

export const useCars = () => useContext(CarsContext);
