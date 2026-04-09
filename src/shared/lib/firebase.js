import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhD7HTYqKH0lvZKfLG6zK1b6-Z6-6G2NE",
  authDomain: "car-showroom-2c807.firebaseapp.com",
  projectId: "car-showroom-2c807",
  storageBucket: "car-showroom-2c807.firebasestorage.app",
  messagingSenderId: "218842329232",
  appId: "1:218842329232:web:db9e04ae8f12ad06d6a815",
  measurementId: "G-JB8ZXEMNQD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
