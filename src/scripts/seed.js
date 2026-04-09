import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  serverTimestamp,
  query
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDhD7HTYqKH0lvZKfLG6zK1b6-Z6-6G2NE",
  authDomain: "car-showroom-2c807.firebaseapp.com",
  projectId: "car-showroom-2c807",
  storageBucket: "car-showroom-2c807.firebasestorage.app",
  messagingSenderId: "218842329232",
  appId: "1:218842329232:web:db9e04ae8f12ad06d6a815",
  measurementId: "G-JB8ZXEMNQD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const seedData = async () => {
  console.log("🚀 Starting database cleanup and seeding...");

  try {
    // Authenticate as Admin to bypass security rules
    console.log("🔐 Authenticating as Admin...");
    await signInWithEmailAndPassword(auth, "admin@admin.com", "admin123");
    console.log("✅ Authenticated!");

    // Function to clear a collection
    const clearCollection = async (colName) => {
      console.log(`🧹 Cleaning up ${colName}...`);
      const q = query(collection(db, colName));
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map((d) => deleteDoc(doc(db, colName, d.id)));
      await Promise.all(deletePromises);
    };

    // Cleanup before seeding
    await clearCollection("cars");
    await clearCollection("team");
    await clearCollection("requests");
    await clearCollection("schedules");
    // We don't clear "users" fully to avoid deleting manually created auth-linked profiles,
    // but we will overwrite the seeded ones.

    // 1. Seed Users (Roles)
    console.log("👤 Seeding users...");
    const users = [
      {
        uid: "admin-default-123",
        firstName: "Admin",
        lastName: "Manager",
        email: "admin@admin.com",
        role: "admin",
        status: "Active",
        image: "https://i.pravatar.cc/150?u=admin"
      },
      {
        uid: "user-default-123",
        firstName: "Regular",
        lastName: "User",
        email: "user@user.com",
        role: "user",
        status: "Active",
        image: "https://i.pravatar.cc/150?u=user"
      }
    ];

    for (const u of users) {
      const { uid, ...data } = u;
      await setDoc(doc(db, "users", uid), {
        ...data,
        createdAt: serverTimestamp()
      });
      console.log(`✅ User profile ${u.email} synced.`);
    }

    // 2. Seed Cars
    console.log("🚗 Seeding cars inventory with fixed IDs...");
    const cars = [
      {
        id: 1001,
        name: "X5 xDrive40i",
        brand: "BMW",
        modelYear: 2023,
        officialPrice: 60000,
        sellingPrice: 65000,
        status: "Available",
        images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e"],
        specs: { engine: "3.0L V6", color: "Black", mileage: "12,000" }
      },
      {
        id: 1002,
        name: "C-Class Sedan",
        brand: "Mercedes-Benz",
        modelYear: 2024,
        officialPrice: 50000,
        sellingPrice: 52000,
        status: "Available",
        images: ["https://images.unsplash.com/photo-1599395273763-7e4a1a0f0e0f"],
        specs: { engine: "2.0L I4", color: "White", mileage: "5,000" }
      },
      {
        id: 1003,
        name: "Model 3 Long Range",
        brand: "Tesla",
        modelYear: 2023,
        officialPrice: 45000,
        sellingPrice: 48000,
        status: "Sold",
        images: ["https://images.unsplash.com/photo-1594957608035-ad692997191e"],
        specs: { engine: "Electric", color: "Blue", mileage: "20,000" }
      }
    ];

    for (const car of cars) {
      await setDoc(doc(db, "cars", `car-${car.id}`), {
        ...car,
        createdAt: serverTimestamp()
      });
      console.log(`✅ Car ${car.name} set (ID: car-${car.id})`);
    }

    // 3. Seed Team
    console.log("👥 Seeding team members...");
    const teamMember = {
      id: "staff-alice",
      name: "Alice Johnson",
      role: "Sales Manager",
      phone: "+1 555-0198",
      email: "alice@showroom.com",
      image: "https://i.pravatar.cc/150?u=a"
    };

    const { id: staffId, ...staffData } = teamMember;
    await setDoc(doc(db, "team", staffId), {
      ...staffData,
      createdAt: serverTimestamp()
    });
    console.log(`✅ Team member Alice Johnson set.`);

    // 4. Seed Schedule
    console.log("📅 Seeding staff schedules...");
    await setDoc(doc(db, "schedules", `sched-alice-1`), {
      memberId: staffId,
      date: new Date().toISOString().split('T')[0],
      startTime: "09:00 AM",
      endTime: "05:00 PM",
      createdAt: serverTimestamp()
    });
    console.log(`✅ Schedule for Alice Johnson set.`);

    // 5. Seed Requests
    console.log("📝 Seeding requests...");
    const requests = [
      {
        userId: "user-default-123", 
        carId: "car-1001",
        status: "pending",
        timestamp: new Date().toISOString()
      },
      {
        userId: "user-default-123",  
        carId: "car-1002",
        status: "pending",
        timestamp: new Date().toISOString()
      }
    ];

    for (const request of requests) {
      await setDoc(doc(db, "requests", `req-${Date.now()}-${Math.random()}`), request);
      console.log(`✅ Request for car ${request.carId} created.`);
    }

    console.log("\n🎉 Seeding complete! Your database is clean and ready.");
    process.exit(0);

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
