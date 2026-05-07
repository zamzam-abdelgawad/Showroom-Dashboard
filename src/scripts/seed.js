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
    console.log("✅ Authenticated as Admin!");

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
    await clearCollection("messages");

    // 1. Seed Users (Roles)
    console.log("👤 Seeding admin user profile...");
    const adminUser = {
      firstName: "Admin",
      lastName: "Manager",
      email: "admin@admin.com",
      role: "admin",
      status: "Active",
      image: "https://i.pravatar.cc/150?u=admin"
    };

    const adminCredential = await signInWithEmailAndPassword(auth, "admin@admin.com", "admin123");
    const realAdminId = adminCredential.user.uid;
    await setDoc(doc(db, "users", realAdminId), {
      ...adminUser,
      createdAt: serverTimestamp()
    });
    console.log(`✅ Admin profile synced with real UID: ${realAdminId}`);

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
        images: ["https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1000"],
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
        name: "Huracán Tecnica",
        brand: "Lamborghini",
        modelYear: 2024,
        officialPrice: 240000,
        sellingPrice: 245000,
        status: "Sold",
        images: ["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=1000"],
        specs: { engine: "5.2L V10", color: "Verde Selvans", mileage: "500" }
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

    // 5. Seed Messages
    console.log("💬 Seeding messages...");
    const messages = [
      {
        name: "Regular User",
        email: "user@user.com",
        subject: "Inquiry: Lexus LC 500 Availability",
        message: "Is the Lexus LC 500 still available for a test drive this weekend?",
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        name: "Regular User",
        email: "user@user.com",
        subject: "Question about Porsche 911",
        message: "What are the financing options for the Porsche 911 Carrera S?",
        read: false,
        createdAt: new Date().toISOString()
      }
    ];

    for (let i = 0; i < messages.length; i++) {
      await setDoc(doc(db, "messages", `msg-${i}-${Date.now()}`), messages[i]);
    }
    console.log(`✅ ${messages.length} messages seeded.`);

    // 6. Get real user UID then seed requests
    console.log("🔐 Signing in as regular user to get real UID...");
    const userCredential = await signInWithEmailAndPassword(auth, "user@user.com", "user123");
    const realUserId = userCredential.user.uid;
    console.log(`✅ Real user UID: ${realUserId}`);

    // Sync user profile with real UID
    await setDoc(doc(db, "users", realUserId), {
      firstName: "Regular",
      lastName: "User",
      email: "user@user.com",
      role: "user",
      status: "Active",
      image: "https://i.pravatar.cc/150?u=user",
      createdAt: serverTimestamp()
    });
    console.log(`✅ Regular user profile synced with real UID: ${realUserId}`);

    // Seed Requests with real UID and number carId to match cars context
    console.log("📝 Seeding requests...");
    const requests = [
      {
        userId: realUserId,
        carId: 1001, // number — matches cars[].id in Firestore
        status: "approved",
        timestamp: new Date(Date.now() - 172800000).toISOString()
      },
      {
        userId: realUserId,
        carId: 1002,
        status: "pending",
        timestamp: new Date(Date.now() - 86400000).toISOString()
      },
      {
        userId: realUserId,
        carId: 1005,
        status: "rejected",
        timestamp: new Date().toISOString()
      }
    ];

    for (let i = 0; i < requests.length; i++) {
      await setDoc(doc(db, "requests", `req-${i}-${Date.now()}`), requests[i]);
      console.log(`✅ Request for car ${requests[i].carId} (${requests[i].status}) created.`);
    }

    console.log("\n🎉 Seeding complete! Your database is clean and ready.");
    process.exit(0);

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedData();