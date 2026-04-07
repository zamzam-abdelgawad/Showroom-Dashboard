import { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useToast } from './ToastContext';

const RequestsContext = createContext();

export function RequestsProvider({ children }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "requests"), orderBy("timestamp", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requestsData = snapshot.docs.map(doc => ({
        ...doc.data(),
        firestoreId: doc.id
      }));
      setRequests(requestsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching requests:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addRequest = async (userId, carId) => {
    try {
      const newReq = {
        userId,
        carId,
        status: 'pending',
        timestamp: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, "requests"), newReq);
      addToast("Request submitted successfully", "success");
      return { ...newReq, firestoreId: docRef.id };
    } catch (error) {
      console.error("Error adding request:", error);
      addToast("Failed to submit request", "error");
      throw error;
    }
  };

  const updateRequestStatus = async (id, newStatus) => {
    try {
      // If 'id' is our firestoreId, we use it directly. 
      // If it's a numeric id, we'd need to find the firestoreId first.
      // For simplicity, let's assume 'id' passed here is the firestoreId or we find it.
      const reqToUpdate = requests.find(r => r.firestoreId === id || r.id === id);
      if (reqToUpdate && reqToUpdate.firestoreId) {
        const reqRef = doc(db, "requests", reqToUpdate.firestoreId);
        await updateDoc(reqRef, { status: newStatus });
      } else if (typeof id === 'string') {
        const reqRef = doc(db, "requests", id);
        await updateDoc(reqRef, { status: newStatus });
      }
    } catch (error) {
      console.error("Error updating request status:", error);
      addToast("Failed to update status", "error");
      throw error;
    }
  };

  return (
    <RequestsContext.Provider value={{ requests, loading, addRequest, updateRequestStatus }}>
      {children}
    </RequestsContext.Provider>
  );
}

export const useRequests = () => useContext(RequestsContext);
