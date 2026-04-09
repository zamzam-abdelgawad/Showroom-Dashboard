import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./shared/context/ToastContext";
import { AuthProvider } from "./shared/context/AuthContext";
import { ProtectedRoute } from "./shared/components/layout/ProtectedRoute";
import { AdminRoute } from "./shared/components/layout/AdminRoute";

// Customer pages
import { CustomerLayout } from "./customer/components/layout/CustomerLayout";
import Login from "./customer/pages/Login";
import Register from "./customer/pages/Register";
import Home from "./customer/pages/Home";
import CustomerCarDetails from "./customer/pages/CarDetails";
import CustomerProfile from "./customer/pages/Profile";

// Admin pages
import { AdminLayout } from "./admin/components/layout/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import AdminCars from "./admin/pages/Cars";
import AdminCarDetails from "./admin/pages/CarDetails";
import Users from "./admin/pages/Users";
import UserDetails from "./admin/pages/UserDetails";
import Requests from "./admin/pages/Requests";
import Team from "./admin/pages/Team";
import TeamDetails from "./admin/pages/TeamDetails";
import AdminProfile from "./admin/pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* ========== Auth Pages ========== */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ========== Customer Website ========== */}
            <Route path="/" element={<CustomerLayout />}>
              <Route index element={<Home />} />
              <Route path="cars/:id" element={<CustomerCarDetails />} />
              <Route path="profile" element={
                <ProtectedRoute>
                  <CustomerProfile />
                </ProtectedRoute>
              } />
            </Route>

            {/* ========== Admin Dashboard ========== */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="cars" element={<AdminCars />} />
              <Route path="cars/:id" element={<AdminCarDetails />} />
              <Route path="users" element={<Users />} />
              <Route path="users/:id" element={<UserDetails />} />
              <Route path="requests" element={<Requests />} />
              <Route path="team" element={<Team />} />
              <Route path="team/:id" element={<TeamDetails />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>

            {/* ========== Catch-all ========== */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
