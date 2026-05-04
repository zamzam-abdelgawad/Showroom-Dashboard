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
        images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1000"],
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
        images: ["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1000"],
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
        images: ["https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=1000"],
        specs: { engine: "Electric", color: "Blue", mileage: "20,000" }
      },
      {
        id: 1004,
        name: "911 Carrera S",
        brand: "Porsche",
        modelYear: 2024,
        officialPrice: 130000,
        sellingPrice: 135000,
        status: "Available",
        images: ["https://images.unsplash.com/photo-1503376713248-be5b5c3ff267?auto=format&fit=crop&q=80&w=1000"],
        specs: { engine: "3.0L Flat-6", color: "Shark Blue", mileage: "1,200" }
      },
      {
        id: 1005,
        name: "RS e-tron GT",
        brand: "Audi",
        modelYear: 2023,
        officialPrice: 145000,
        sellingPrice: 140000,
        status: "Available",
        images: ["https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&q=80&w=1000"],
        specs: { engine: "Dual Motor Electric", color: "Tactical Green", mileage: "3,500" }
      },
      {
        id: 1006,
        name: "Range Rover Vogue",
        brand: "Land Rover",
        modelYear: 2023,
        officialPrice: 105000,
        sellingPrice: 110000,
        status: "Available",
        images: ["https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80&w=1000"],
        specs: { engine: "3.0L Inline-6", color: "Fuji White", mileage: "8,000" }
      },
      {
        id: 1007,
        name: "LC 500",
        brand: "Lexus",
        modelYear: 2024,
        officialPrice: 99000,
        sellingPrice: 101000,
        status: "Sold",
        images: ["https://images.unsplash.com/photo-1620866299298-6da8da4821a7?auto=format&fit=crop&q=80&w=1000"],
        specs: { engine: "5.0L V8", color: "Infrared", mileage: "2,500" }
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
        carId: "1001",
        status: "approved",
        timestamp: new Date().toISOString()
      },
      {
        userId: "user-default-123",  
        carId: "1002",
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
