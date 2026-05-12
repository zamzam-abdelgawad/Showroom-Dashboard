import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../shared/context/AuthContext";
import { AdminNavbar } from "./AdminNavbar";
import { AdminSidebar } from "./AdminSidebar";
import { Suspense, useState, useEffect } from "react";
import { Skeleton } from "../../../shared/components/ui/Skeleton";
import { useLocation } from "react-router-dom";
import { UsersProvider } from "../../context/UsersContext";
import { CarsProvider } from "../../context/CarsContext";
import { RequestsProvider } from "../../context/RequestsContext";
import { TeamProvider } from "../../context/TeamContext";
import { MessagesProvider } from "../../context/MessagesContext";

function PageLoader() {
  return (
    <div className="space-y-6 w-full animate-pulse">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32 rounded-lg" />
        <Skeleton className="h-8 w-64 rounded-xl" />
      </div>
      <Skeleton className="h-[250px] w-full rounded-3xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export function AdminLayout() {
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <UsersProvider>
      <CarsProvider>
        <RequestsProvider>
          <TeamProvider>
            <MessagesProvider>
              <div className="h-screen bg-zinc-50/50 dark:bg-zinc-950 flex flex-col font-sans text-zinc-900 dark:text-zinc-100 overflow-hidden transition-colors duration-500">
                <AdminNavbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                <div className="flex flex-1 overflow-hidden relative">
                  {/* Mobile Sidebar Overlay */}
                  {isSidebarOpen && (
                    <div 
                      className="fixed inset-0 bg-zinc-950/20 z-20 md:hidden backdrop-blur-sm animate-in fade-in"
                      onClick={() => setIsSidebarOpen(false)}
                    />
                  )}
                  
                  <AdminSidebar isOpen={isSidebarOpen} />
                  
                  <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full max-w-7xl mx-auto">
                    <Suspense fallback={<PageLoader />}>
                      <Outlet />
                    </Suspense>
                  </main>
                </div>
              </div>
            </MessagesProvider>
          </TeamProvider>
        </RequestsProvider>
      </CarsProvider>
    </UsersProvider>
  );
}
