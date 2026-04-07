import { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  setDoc 
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user data/role from Firestore
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          let userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUser({ 
              uid: firebaseUser.uid, 
              email: firebaseUser.email, 
              ...userDoc.data() 
            });
          } else {
            // Fallback: Check if there's a document with this email but a different ID (from seeding)
            const q = query(collection(db, "users"), where("email", "==", firebaseUser.email));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
              const existingData = querySnapshot.docs[0].data();
              // Auto-migrate/link the profile to the current UID
              await setDoc(userDocRef, { ...existingData, lastSynced: new Date() });
              setUser({ 
                uid: firebaseUser.uid, 
                email: firebaseUser.email, 
                ...existingData 
              });
            } else {
              // True fallback for completely unknown users
              setUser({ uid: firebaseUser.uid, email: firebaseUser.email, role: 'user' });
            }
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, role: 'user' });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      // Map common Firebase auth errors to user-friendly messages
      let message = "Failed to log in. Please check your credentials.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = "Invalid email or password. Use provided dummy logins.";
      }
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);