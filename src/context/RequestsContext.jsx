import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const RequestsContext = createContext();

export function RequestsProvider({ children }) {
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('showroom_requests');
    if (saved) return JSON.parse(saved);
    return [];
  });
  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem('showroom_requests', JSON.stringify(requests));
  }, [requests]);

  const addRequest = async (userId, carId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newReq = {
          id: Date.now(),
          userId,
          carId,
          status: 'pending',
          timestamp: new Date().toISOString()
        };
        setRequests(prev => [newReq, ...prev]);
        resolve(newReq);
      }, 500);
    });
  };

  const updateRequestStatus = async (id, newStatus) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setRequests(prev => prev.map(req => req.id === id ? { ...req, status: newStatus } : req));
        resolve();
      }, 400);
    });
  };

  return (
    <RequestsContext.Provider value={{ requests, addRequest, updateRequestStatus }}>
      {children}
    </RequestsContext.Provider>
  );
}

export const useRequests = () => useContext(RequestsContext);
