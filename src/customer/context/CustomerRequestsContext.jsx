import { createContext, useContext, useState, useEffect } from 'react';
import {
  collection, onSnapshot, addDoc, query, orderBy, where
} from "firebase/firestore";
import { db } from "../../shared/lib/firebase";
import { useAuth } from "../../shared/context/AuthContext";
import { useToast } from "../../shared/context/ToastContext";

export const CustomerRequestsContext = createContext();

export function CustomerRequestsProvider({ children }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    if (!user) {
      setRequests([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "requests"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          ...doc.data(),
          firestoreId: doc.id
        }));
        setRequests(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching requests:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addRequest = async (userId, carId) => {
    try {
      const newReq = {
        userId,
        carId,
        status: 'pending',
        timestamp: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, "requests"), newReq);
      return { ...newReq, firestoreId: docRef.id };
    } catch (error) {
      console.error("Error adding request:", error);
      addToast("Failed to submit request", "error");
      throw error;
    }
  };

  return (
    <CustomerRequestsContext.Provider value={{ requests, loading, addRequest }}>
      {children}
    </CustomerRequestsContext.Provider>
  );
}

export const useCustomerRequests = () => useContext(CustomerRequestsContext);
