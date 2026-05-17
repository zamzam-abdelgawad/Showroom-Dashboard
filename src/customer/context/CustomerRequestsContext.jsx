import { createContext, useContext, useState, useEffect } from 'react';
import {
  collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy, where
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

  /**
   * @param {string} userId
   * @param {string|number} carId
   * @param {Object} delivery
   * @param {string} delivery.address        - Full delivery address
   * @param {string} delivery.phone          - Primary contact number
   * @param {string} delivery.altPhone       - Alternate contact number (optional)
   * @param {Date}   delivery.date           - JS Date object from react-datepicker
   * @param {string} delivery.slot           - Time slot string e.g. "09:00"
   * @param {number} delivery.deliveryFee    - Flat delivery fee in USD
   * @param {number} delivery.totalPrice     - Vehicle price + delivery fee
   * @param {string} delivery.paymentMode    - "full" | "finance"
   * @param {number} delivery.financeTerm    - Loan term in months (only when finance)
   * @param {number} delivery.monthlyPayment - Est. monthly payment (only when finance)
   */
  const addRequest = async (userId, carId, delivery = {}) => {
    try {
      const newReq = {
        userId,
        carId,
        status: 'pending',
        timestamp: new Date().toISOString(),
        // Delivery fields — present only when booking modal is used
        ...(Object.keys(delivery).length > 0 && {
          delivery: {
            address:     delivery.address     ?? "",
            phone:       delivery.phone       ?? "",
            altPhone:    delivery.altPhone    ?? "",
            date:        delivery.date        ?? null,
            slot:        delivery.slot        ?? null,
            deliveryFee: delivery.deliveryFee ?? 0,
            totalPrice:  delivery.totalPrice  ?? 0,
            // ── Payment details ──────────────────────────────────────────
            paymentMode: delivery.paymentMode ?? "full",
            // Only persist financing fields when finance was chosen
            // — keeps Firestore clean, no null noise for full-payment orders
            ...(delivery.paymentMode === "finance" && {
              financeTerm:    delivery.financeTerm,
              monthlyPayment: delivery.monthlyPayment,
            }),
          }
        }),
      };
      const docRef = await addDoc(collection(db, "requests"), newReq);
      return { ...newReq, firestoreId: docRef.id };
    } catch (error) {
      console.error("Error adding request:", error);
      addToast("Failed to submit request", "error");
      throw error;
    }
  };

  const cancelRequest = async (firestoreId) => {
    try {
      await deleteDoc(doc(db, "requests", firestoreId));
    } catch (error) {
      console.error("Error cancelling request:", error);
      addToast("Failed to cancel request", "error");
      throw error;
    }
  };

  return (
    <CustomerRequestsContext.Provider value={{ requests, loading, addRequest, cancelRequest }}>
      {children}
    </CustomerRequestsContext.Provider>
  );
}

export const useCustomerRequests = () => useContext(CustomerRequestsContext);