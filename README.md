# 🚗 Car Showroom Management Dashboard

A modern, responsive, and production-ready Admin Dashboard built for a Car Dealership.
This project demonstrates real-world React development skills including state management with Context API, dynamic CRUD operations, role-based UI, and component testing.

---

## 🌐 Live Demo

**App URL:** 

---

## 🎥 Demo Preview

This demo showcases full CRUD operations including:

* Adding a car
* Editing a car
* Deleting a car
* Marking a car as sold

![Showroom Demo](./public/)

---

## 📌 Project Overview

Built using React and Vite, this dashboard simulates a real car showroom system.
It allows managing users and car inventory with instant UI updates powered by Context API.

Data is persisted using `localStorage`, ensuring all changes remain after page refresh, mimicking real-world application behavior.

---

## 🚀 Key Features

* **Role-Based Access**

  * Admin: Full CRUD access (Add / Edit / Delete)
  * User: Read-only access

* **Car Inventory Management (`/cars`)**

  * Add, edit, and delete cars
  * Mark cars as "Sold"
  * Persistent data using localStorage

* **Interactive Dashboard**

  * Displays:

    * Total Cars
    * Available Cars
    * Sold Cars
    * Total Sales Value
  * Clicking cards filters data dynamically

* **User Management (`/users`)**

  * View users data
  * Integrated with role-based system

* **Modern UI/UX**

  * Responsive design
  * Toast notifications
  * Skeleton loading states
  * Confirmation modals

---

## 🛠 Tech Stack

* **Framework**: React 19 + Vite 8
* **Styling**: Tailwind CSS v4
* **State Management**: Context API
* **Data Persistence**: localStorage
* **Testing**: Vitest + React Testing Library

---

## 🏗️ Project Structure

```text
src/
├── components/        # Reusable UI components & feature modules
├── context/           # Global state management (Auth, Cars, Users)
├── pages/             # Application pages (Dashboard, Cars, Users, Login)
├── hooks/             # Custom hooks (e.g., useDebounce)
└── tests/             # Unit & integration tests
```

---

## 💻 Getting Started

### Prerequisites

Make sure you have Node.js installed.

### Installation

```bash
npm install
npm run dev
```

The app will run on:
http://localhost:5173

---

## 🧪 Testing

This project includes both unit and integration tests:

* **Unit Testing**

  * Reusable components (Button, Modal)

* **Integration Testing**

  * Core user flows:

    * Add car
    * Edit car
    * Delete car

Run tests using:

```bash
npm run test
```

---

## ⭐ Highlights

* Full CRUD system with real business logic
* Role-based UI (Admin vs User)
* Persistent state using localStorage
* Clean and scalable architecture
* Tested using modern frontend tools

---

## 💡 What I Learned

* Building scalable applications using Context API
* Managing global state without Redux
* Writing clean, reusable, and testable components
* Simulating real-world business logic in frontend apps

---

## 🤝 Future Enhancements

* Integrate real backend (JWT authentication)
* Use React Query or SWR for data fetching
* Improve performance and caching strategies
* Add advanced analytics to dashboard
