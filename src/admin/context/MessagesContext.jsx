import { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../shared/lib/firebase";
import { useToast } from '../../shared/context/ToastContext';

export const MessagesContext = createContext();

export function MessagesProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setMessages([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const messagesData = snapshot.docs.map(doc => ({
            ...doc.data(),
            firestoreId: doc.id
          }));
          setMessages(messagesData);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching messages:", error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    });

    return () => unsubAuth();
  }, []);

  const markAsRead = async (id) => {
    try {
      const msgRef = doc(db, "messages", id);
      await updateDoc(msgRef, { read: true });
    } catch (error) {
      console.error("Error marking message as read:", error);
      addToast("Failed to update message", "error");
    }
  };

  const markAsUnread = async (id) => {
    try {
      const msgRef = doc(db, "messages", id);
      await updateDoc(msgRef, { read: false });
    } catch (error) {
      console.error("Error marking message as unread:", error);
      addToast("Failed to update message", "error");
    }
  };

  const deleteMessage = async (id) => {
    try {
      const msgRef = doc(db, "messages", id);
      await deleteDoc(msgRef);
      addToast("Message deleted", "success");
    } catch (error) {
      console.error("Error deleting message:", error);
      addToast("Failed to delete message", "error");
    }
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <MessagesContext.Provider value={{ messages, loading, markAsRead, markAsUnread, deleteMessage, unreadCount }}>
      {children}
    </MessagesContext.Provider>
  );
}

export const useMessages = () => useContext(MessagesContext);
