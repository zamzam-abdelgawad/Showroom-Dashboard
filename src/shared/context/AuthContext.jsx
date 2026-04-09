import { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
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

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
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
            // Fallback: find doc seeded with same email but different ID
            const q = query(collection(db, "users"), where("email", "==", firebaseUser.email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              const existingData = querySnapshot.docs[0].data();
              await setDoc(userDocRef, { ...existingData, lastSynced: new Date() });
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                ...existingData
              });
            } else {
              // Unknown user — assign default role
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
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      let message = "Failed to log in. Please check your credentials.";
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-credential'
      ) {
        message = "Invalid email or password. Use provided dummy logins.";
      }
      throw new Error(message);
    }
  };

  const register = async (email, password, name) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", result.user.uid), {
        email,
        name,
        role: "user",
        status: "Active",
        createdAt: new Date().toISOString()
      });
      return result.user;
    } catch (error) {
      let message = "Failed to create account.";
      if (error.code === 'auth/email-already-in-use') {
        message = "This email is already registered. Please log in instead.";
      } else if (error.code === 'auth/weak-password') {
        message = "Password should be at least 6 characters.";
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

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading, authReady, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
