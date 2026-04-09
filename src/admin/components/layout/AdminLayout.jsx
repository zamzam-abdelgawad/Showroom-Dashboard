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

function PageLoader() {
  return (
    <div className="space-y-4 w-full">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-[200px] w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
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
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <UsersProvider>
      <CarsProvider>
        <RequestsProvider>
          <TeamProvider>
            <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans text-gray-900">
              <AdminNavbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
              <div className="flex flex-1 overflow-hidden relative">
                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                  <div 
                    className="fixed inset-0 bg-slate-900/50 z-20 md:hidden backdrop-blur-sm animate-in fade-in"
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
          </TeamProvider>
        </RequestsProvider>
      </CarsProvider>
    </UsersProvider>
  );
}
