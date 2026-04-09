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
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../shared/lib/firebase";
import { useToast } from '../../shared/context/ToastContext';

export const UsersContext = createContext();

export function UsersProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setUsers([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const usersData = snapshot.docs.map(doc => ({
            ...doc.data(),
            firestoreId: doc.id
          }));
          setUsers(usersData);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching users:", error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    });

    return () => unsubAuth();
  }, []);

  const addUser = async (userData) => {
    try {
      const newUser = {
        ...userData,
        createdAt: new Date().toISOString(),
        id: Date.now()
      };
      const docRef = await addDoc(collection(db, "users"), newUser);
      addToast("User added successfully", "success");
      return { ...newUser, firestoreId: docRef.id };
    } catch (error) {
      console.error("Error adding user:", error);
      addToast("Failed to add user", "error");
      throw error;
    }
  };

  const updateUser = async (id, updates) => {
    try {
      const userToUpdate = users.find(u => u.firestoreId === id || u.id === id);
      if (userToUpdate && userToUpdate.firestoreId) {
        const userRef = doc(db, "users", userToUpdate.firestoreId);
        await updateDoc(userRef, updates);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      addToast("Failed to update user", "error");
      throw error;
    }
  };

  const deleteUser = async (id) => {
    try {
      const userToDelete = users.find(u => u.firestoreId === id || u.id === id);
      if (userToDelete && userToDelete.firestoreId) {
        const userRef = doc(db, "users", userToDelete.firestoreId);
        await deleteDoc(userRef);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      addToast("Failed to delete user", "error");
      throw error;
    }
  };

  return (
    <UsersContext.Provider value={{ users, loading, addUser, updateUser, deleteUser }}>
      {children}
    </UsersContext.Provider>
  );
}

export const useUsers = () => useContext(UsersContext);
