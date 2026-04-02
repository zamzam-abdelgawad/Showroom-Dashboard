import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { UsersProvider } from "./context/UsersContext";
import { CarsProvider } from "./context/CarsContext";
import { DashboardLayout } from "./components/layout/DashboardLayout";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Users = lazy(() => import("./pages/Users"));
const UserDetails = lazy(() => import("./pages/UserDetails"));
const Cars = lazy(() => import("./pages/Cars"));

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <UsersProvider>
            <CarsProvider>
              <Routes>
              <Route path="/login" element={
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div></div>}>
                  <Login />
                </Suspense>
              } />

              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="users/:id" element={<UserDetails />} />
                <Route path="cars" element={<Cars />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            </CarsProvider>
          </UsersProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
