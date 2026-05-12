import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/context/AuthContext";
import { Button } from "../../../shared/components/ui/Button";
import { Car, LogOut, User as UserIcon, ShieldCheck, MessageSquare, Home } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "../../../shared/components/ui/Skeleton";
import { CustomerCarsProvider } from "../../context/CustomerCarsContext";
import { CustomerRequestsProvider } from "../../context/CustomerRequestsContext";
import { ThemeToggle } from "../../../shared/components/ui/ThemeToggle";

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
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col font-sans text-zinc-900 dark:text-zinc-100 transition-colors duration-500 overflow-x-hidden">
          {/* Navbar */}
          <header className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800/80 h-16 sm:h-20 flex items-center justify-between px-4 sm:px-6 lg:px-12 sticky top-0 z-50 w-full shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-4 sm:gap-10 min-w-0">
              <Link to="/" className="flex items-center gap-2 sm:gap-3.5 group flex-shrink-0">
                <div className="bg-zinc-950 p-2 sm:p-2.5 rounded-xl text-brand-primary shadow-2xl border border-white/5 transition-transform group-hover:scale-110">
                  <Car className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <h2 className="text-base sm:text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tightest uppercase whitespace-nowrap">
                  Showroom<span className="text-brand-primary">Elite</span>
                </h2>
              </Link>
              <nav className="hidden md:flex items-center gap-2">
                <Link to="/" className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-brand-primary dark:hover:text-brand-primary rounded-xl transition-all duration-300 flex items-center gap-2.5 group">
                  <Home className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100" />
                  Home
                </Link>
                <Link to="/contact" className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-brand-primary dark:hover:text-brand-primary rounded-xl transition-all duration-300 flex items-center gap-2.5 group">
                  <MessageSquare className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100" />
                  Contact
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 lg:gap-6 flex-shrink-0">
              <ThemeToggle />
              {isAdmin && (
                <Link to="/admin" className="hidden lg:flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-brand-primary bg-brand-primary/5 dark:bg-brand-primary/10 hover:bg-brand-primary/10 dark:hover:bg-brand-primary/20 px-4 py-2 rounded-xl transition-all border border-brand-primary/20">
                  <ShieldCheck className="h-3.5 w-3.5" /> Dashboard
                </Link>
              )}
              {user ? (
                <div className="flex items-center gap-2">
                  <Link to="/profile" className="flex items-center gap-1.5 sm:gap-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-zinc-950 flex items-center justify-center border border-white/10 overflow-hidden flex-shrink-0">
                      {user.image ? <img src={user.image} alt={user.name} className="h-full w-full object-cover" /> : <UserIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-brand-primary" />}
                    </div>
                    <span className="hidden md:inline uppercase truncate max-w-[80px] lg:max-w-[100px]">{user.name || user.email.split('@')[0]}</span>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="text-zinc-400 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 px-2 rounded-xl transition-all">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3">
                  <Link to="/login" className="hidden sm:block">
                    <Button variant="ghost" size="sm" className="text-xs font-semibold uppercase tracking-wider rounded-xl h-10 px-4 lg:px-6">Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="text-xs font-bold uppercase tracking-widest rounded-xl h-9 sm:h-10 px-4 sm:px-8 bg-brand-primary hover:bg-brand-primary/90 shadow-xl shadow-brand-primary/20 transition-all active:scale-95">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 w-full overflow-x-hidden">
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </main>

          {/* Footer */}
          <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 py-12 sm:py-16 px-4 sm:px-6 lg:px-12 transition-colors w-full overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-16">
                <div className="sm:col-span-2 space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-zinc-950 p-2 rounded-xl text-brand-primary shadow-xl border border-white/5">
                      <Car className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <span className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-zinc-50 uppercase tracking-tightest">Showroom<span className="text-brand-primary">Elite</span></span>
                  </div>
                  <p className="text-sm text-zinc-400 dark:text-zinc-500 leading-relaxed max-w-sm font-normal">
                    Premier destination for elite performance assets. Curating automotive excellence through rigorous validation protocols.
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4 sm:mb-6">Quick Links</h4>
                  <div className="space-y-3 sm:space-y-4">
                    <Link to="/" className="block text-xs font-medium text-zinc-500 hover:text-brand-primary transition-colors">Home</Link>
                    <Link to="/contact" className="block text-xs font-medium text-zinc-500 hover:text-brand-primary transition-colors">Contact Us</Link>
                    <Link to="/profile" className="block text-xs font-medium text-zinc-500 hover:text-brand-primary transition-colors">Profile</Link>
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4 sm:mb-6">Contact</h4>
                  <div className="space-y-3 sm:space-y-4">
                    <p className="text-xs font-medium text-zinc-500 break-all">info@showcase.com</p>
                    <p className="text-xs font-medium text-zinc-500">+20 100 100 1001</p>
                    <p className="text-xs font-medium text-zinc-500">Cairo, Egypt</p>
                  </div>
                </div>
              </div>
              <div className="pt-8 sm:pt-10 border-t border-zinc-50 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                <div className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest text-center sm:text-left">
                  © 2026 ShowroomElite.
                </div>
                 <div className="flex items-center gap-4">
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse" />
                    <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">All rights reserved.</span>
                 </div>
              </div>
            </div>
          </footer>
        </div>
      </CustomerRequestsProvider>
    </CustomerCarsProvider>
  );
}