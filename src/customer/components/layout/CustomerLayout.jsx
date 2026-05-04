import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/context/AuthContext";
import { Button } from "../../../shared/components/ui/Button";
import { Car, LogOut, User as UserIcon, ShieldCheck, MessageSquare, Home } from "lucide-react";
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
          <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-10 w-full shadow-sm">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200">
                  <Car className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-extrabold text-gray-800 tracking-tight">
                  Showroom<span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Elite</span>
                </h2>
              </Link>
              <nav className="hidden sm:flex items-center gap-1">
                <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50/50 transition-all duration-200 flex items-center gap-1.5">
                  <Home className="h-3.5 w-3.5" />
                  Home
                </Link>
                <Link to="/contact" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 rounded-xl hover:bg-indigo-50/50 transition-all duration-200 flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Contact Us
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {isAdmin && (
                <Link to="/admin" className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-all duration-200">
                  <ShieldCheck className="h-3.5 w-3.5" /> Admin Panel
                </Link>
              )}
              {user ? (
                <>
                  <Link to="/profile" className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 px-2 sm:px-3 py-1.5 rounded-full transition-all duration-200 border border-gray-100 hover:shadow-sm">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <UserIcon className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="hidden sm:inline text-xs font-bold text-gray-900">{user.name || user.email}</span>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-500 hover:text-red-600 hover:bg-red-50 font-medium px-2 sm:px-3 rounded-xl transition-all duration-200">
                    <LogOut className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="font-medium rounded-xl">Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="font-medium rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200">Sign Up</Button>
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
          <footer className="bg-white border-t border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-1.5 rounded-lg text-white">
                      <Car className="h-4 w-4" />
                    </div>
                    <span className="font-extrabold text-gray-800">Showroom<span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Elite</span></span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">Premium car dealership offering the finest selection of luxury and performance vehicles.</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Quick Links</h4>
                  <div className="space-y-2">
                    <Link to="/" className="block text-sm text-gray-600 hover:text-indigo-600 transition-colors">Browse Cars</Link>
                    <Link to="/contact" className="block text-sm text-gray-600 hover:text-indigo-600 transition-colors">Contact Us</Link>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Contact</h4>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>support@showroomelite.com</p>
                    <p>+1 (555) 123-4567</p>
                    <p>123 Elite Drive, Los Angeles</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-400">
                  © 2026 ShowroomElite. All rights reserved.
                </div>
                <div className="text-xs text-gray-400">Premium Car Dealership</div>
              </div>
            </div>
          </footer>
        </div>
      </CustomerRequestsProvider>
    </CustomerCarsProvider>
  );
}
