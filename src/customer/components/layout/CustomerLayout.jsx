import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/context/AuthContext";
import { Button } from "../../../shared/components/ui/Button";
import { Car, LogOut, User as UserIcon, ShieldCheck } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "../../../shared/components/ui/Skeleton";
import { CustomerCarsProvider } from "../../context/CustomerCarsContext";
import { CustomerRequestsProvider } from "../../context/CustomerRequestsContext";

function PageLoader() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function CustomerLayout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <CustomerCarsProvider>
      <CustomerRequestsProvider>
        <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans text-gray-900">
          {/* Navbar */}
          <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-10 w-full shadow-sm">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-3">
                <div className="bg-indigo-600 p-1.5 rounded-lg text-white shadow-indigo-200 shadow-lg">
                  <Car className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-extrabold text-gray-800 tracking-tight">
                  Showroom<span className="text-indigo-600">Elite</span>
                </h2>
              </Link>
              <nav className="hidden sm:flex items-center gap-1">
                <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-gray-50 transition-colors">
                  Home
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {isAdmin && (
                <Link to="/admin" className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors">
                  <ShieldCheck className="h-3.5 w-3.5" /> Admin Panel
                </Link>
              )}
              {user ? (
                <>
                  <Link to="/profile" className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 px-2 sm:px-3 py-1.5 rounded-full transition-colors border border-gray-100">
                    <UserIcon className="h-4 w-4 text-indigo-600" />
                    <span className="hidden sm:inline text-xs font-bold text-gray-900">{user.name || user.email}</span>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 hover:text-red-700 hover:bg-red-50 font-medium px-2 sm:px-4">
                    <LogOut className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="font-medium">Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="font-medium">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </header>

          {/* Content */}
          <main className="flex-1">
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Car className="h-4 w-4 text-indigo-600" />
                <span className="font-bold text-gray-700">ShowroomElite</span>
                <span>© 2026 All rights reserved</span>
              </div>
              <div className="text-xs text-gray-400">Premium Car Dealership</div>
            </div>
          </footer>
        </div>
      </CustomerRequestsProvider>
    </CustomerCarsProvider>
  );
}
