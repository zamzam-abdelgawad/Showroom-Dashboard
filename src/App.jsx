import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { UsersProvider } from "./context/UsersContext";
import { CarsProvider } from "./context/CarsContext";
import { RequestsProvider } from "./context/RequestsContext";
import { TeamProvider } from "./context/TeamContext";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { RequireAdmin, RoleRedirect } from "./components/layout/RoleRedirect";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Users = lazy(() => import("./pages/Users"));
const UserDetails = lazy(() => import("./pages/UserDetails"));
const Cars = lazy(() => import("./pages/Cars"));
const CarDetails = lazy(() => import("./pages/CarDetails"));
const Profile = lazy(() => import("./pages/Profile"));
const Requests = lazy(() => import("./pages/Requests"));
const Team = lazy(() => import("./pages/Team"));
const TeamDetails = lazy(() => import("./pages/TeamDetails"));

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <UsersProvider>
            <CarsProvider>
              <RequestsProvider>
                <TeamProvider>
                  <Routes>
                    <Route path="/login" element={
                      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div></div>}>
                        <Login />
                      </Suspense>
                    } />

                    <Route path="/" element={<DashboardLayout />}>
                      <Route index element={<RoleRedirect />} />
                      <Route path="dashboard" element={<RequireAdmin><Dashboard /></RequireAdmin>} />
                      <Route path="users" element={<RequireAdmin><Users /></RequireAdmin>} />
                      <Route path="users/:id" element={<RequireAdmin><UserDetails /></RequireAdmin>} />
                      <Route path="cars" element={<Cars />} />
                      <Route path="cars/:id" element={<CarDetails />} />
                      <Route path="profile" element={<Profile />} />
                      <Route path="requests" element={<RequireAdmin><Requests /></RequireAdmin>} />
                      <Route path="team" element={<RequireAdmin><Team /></RequireAdmin>} />
                      <Route path="team/:id" element={<RequireAdmin><TeamDetails /></RequireAdmin>} />
                    </Route>

                    <Route path="*" element={<RoleRedirect />} />
                  </Routes>
                </TeamProvider>
              </RequestsProvider>
            </CarsProvider>
          </UsersProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
