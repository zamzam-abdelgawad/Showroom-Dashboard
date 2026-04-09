import { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../shared/lib/firebase";

export const CustomerCarsContext = createContext();

export function CustomerCarsProvider({ children }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "cars"), orderBy("id", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const carsData = snapshot.docs.map(doc => ({
          ...doc.data(),
          firestoreId: doc.id
        }));
        setCars(carsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching cars:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <CustomerCarsContext.Provider value={{ cars, loading }}>
      {children}
    </CustomerCarsContext.Provider>
  );
}

export const useCustomerCars = () => useContext(CustomerCarsContext);
