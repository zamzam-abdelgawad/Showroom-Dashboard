# 🚗 Car Showroom Enterprise Dashboard

A high-performance, role-based Car Dealership Management System. This project demonstrates a complete B2C (Customer) and B2B (Admin) ecosystem, featuring purchase pipelines, inventory lifecycle management, and internal team operations.

---

## 🌐 Live Demo

**App URL:** *(https://showroomelite.netlify.app)*

---

## 🎥 System Walkthrough

This dashboard simulates a real-world automotive business with distinct user journeys:

*   **Customer Journey**: Browsing inventory, viewing technical specs, and submitting "Buy Requests".
*   **Admin Journey**: Managing inventory, approving sales requests, and tracking team schedules.

![Showroom Demo](./public/showroom_demo.webp)

---

## 📌 Project Architecture

Built with a modular frontend architecture, the system separates logic into clear domains:
*   **Dual-Domain Routing**: Complete separation of concerns between `src/customer` (Public Storefront) and `src/admin` (Internal Management).
*   **Context API**: Global providers managing Auth, Inventory, Users, Sales Requests, and Team data, strictly isolated by domain.
*   **Data Persistence**: Fully integrated with **Firebase Firestore** and **Firebase Authentication** for real-time, secure database management and user identity.

---

## 🚀 Key Features

### 👤 Dual Role Experience
*   **Admin (Manager)**: Full access to the Analytics Dashboard, Cars CRUD, User Management, and staff schedules.
*   **User (Customer)**: Restricted access to Personal Profile, Car Browsing, and the Purchase Request system.

### 💰 Sales Request Pipeline (B2C)
*   **Buy Request**: Customers can submit purchase intent for any available vehicle.
*   **Request Management**: Admins can Approve or Reject requests in a dedicated tracking portal, providing a realistic sales workflow.

### 🔧 Advanced Inventory Management
*   **Car Specifications**: Full technical details including Engine, Mileage, Color, and Year.
*   **Price Privacy**: Admins see internal MSRP (Official Price), while Customers only see the public Selling Price.
*   **Image Galleries**: Dynamic rendering of vehicle assets.

### 👥 Team Operations (B2B)
*   **Staff Directory**: Manage internal dealership roles (Sales, Managers, Techs).
*   **Shift Scheduling**: Individual work schedules (Start/End times) for all team members.

---

## 🛠 Tech Stack

*   **Frontend**: React 19 + Vite 8
*   **Styling & Animation**: Tailwind CSS v4 + Framer Motion
*   **Backend**: Firebase (Auth & Firestore)
*   **Icons**: Lucide React
*   **State**: Context API (Multi-Provider Strategy)
*   **Charts**: Recharts (Sales performance visualization)
*   **Testing**: Vitest + React Testing Library

---

## 🏗️ Project Structure

```text
src/
├── admin/             # B2B System (/admin/* routes)
│   ├── components/    # Admin-specific UI (Form Modals, Layouts)
│   ├── context/       # Admin-only Providers (Full CRUD access)
│   └── pages/         # Dashboard, Inventory management, Requests
├── customer/          # B2C Storefront (/ routes)
│   ├── components/    # Public-facing UI (Layout)
│   ├── context/       # Read-only or Customer-local Providers
│   └── pages/         # Catalog, Car Details, Login/Register
├── shared/            # Universal Resources
│   ├── components/    # Reusable UI (Buttons, Micro-animations, Guards)
│   ├── context/       # Core Providers (Auth, Toast)
│   └── lib/           # Utilities, Firebase Init
└── tests/             # Comprehensive Unit & Integration Suites
```

---

## 💻 Installation & Usage

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run test suites
npm run test
```

---

## 🧪 Testing Architecture

The system uses a modern testing stack designed for speed and reliability:
*   **Runner**: [Vitest](https://vitest.dev/) (Vite-native test runner)
*   **Environment**: `jsdom` for browser API simulation
*   **Library**: [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
*   **Coverage**:
    *   **Auth Flow**: Validating multi-role login and error handling.
    *   **Inventory CRUD**: Testing Admin-only "Add Car" and "Delete Car" flows.
    *   **Role-Based UI**: Verifying that Customers cannot see Admin-only actions.
    *   **User Management**: Testing integration between the Users Context and the UI.

### Running Tests

```bash
# Standard run (all tests)
npm test

# Watch mode (auto-run on save)
npx vitest

# Visual UI (Browser-based dashboard)
npx vitest --ui
```

---

## 💡 Engineering Highlights

*   **Scalable Context Strategy**: Managed a complex dependency tree between Users, Cars, and Requests without state-draggling.
*   **Aesthetic UI**: Leveraged curated HSL colors and glassmorphism for a premium "Showroom" feel.
*   **Recruiter Ready**: Explicit demo credentials and clear "Next Steps" for backend migration.
