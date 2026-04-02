import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from './ToastContext';

const UsersContext = createContext();

export function UsersProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('showroom_users');
    if (savedUsers) return JSON.parse(savedUsers);
    return [];
  });
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchUsers = useCallback(async () => {
    const savedUsers = localStorage.getItem('showroom_users');
    if (savedUsers) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get('/users?limit=100');
      const data = response.data.users.map(u => ({
        ...u,
        status: u.id % 3 === 0 ? "Inactive" : "Active"
      }));
      setUsers(data);
    } catch (error) {
      addToast("Failed to fetch initial users data", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('showroom_users', JSON.stringify(users));
    }
  }, [users]);

  const addUser = async (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          ...userData,
          id: Date.now(), 
          image: "https://dummyjson.com/icon/newuser/128", 
          username: userData.email.split('@')[0],
        };
        setUsers(prev => [newUser, ...prev]);
        resolve(newUser);
      }, 500);
    });
  };

  const updateUser = async (id, updates) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
        resolve();
      }, 500);
    });
  };

  const deleteUser = async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setUsers(prev => prev.filter(u => u.id !== id));
        resolve();
      }, 400);
    });
  };

  return (
    <UsersContext.Provider value={{ users, loading, fetchUsers, addUser, updateUser, deleteUser }}>
      {children}
    </UsersContext.Provider>
  );
}

export const useUsers = () => useContext(UsersContext);
