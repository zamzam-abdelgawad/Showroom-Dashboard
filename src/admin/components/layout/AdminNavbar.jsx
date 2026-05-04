import { useAuth } from "../../../shared/context/AuthContext";
import { LogOut, User as UserIcon, Car, ShieldCheck, Menu, Bell } from "lucide-react";
import { Button } from "../../../shared/components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useMessages } from "../../context/MessagesContext";
import { ThemeToggle } from "../../../shared/components/ui/ThemeToggle";

export function AdminNavbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { unreadCount } = useMessages();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200/60 dark:border-slate-800/60 h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40 w-full shadow-sm flex-shrink-0 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onMenuClick} 
          className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl"
        >
          <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </Button>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/admin')}>
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200">
            <Car className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight hidden sm:block">
            Showroom<span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Elite</span>
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notification Bell */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/messages')}
          className="relative p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold h-4 min-w-[16px] flex items-center justify-center rounded-full px-1 animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>

        <Link to="/admin/profile" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 px-2 sm:px-3 py-1.5 rounded-full transition-all duration-200 border border-gray-100 dark:border-slate-700 hover:shadow-sm">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <UserIcon className="h-3.5 w-3.5 text-white" />
          </div>
          <div className="hidden sm:flex flex-col items-start leading-tight">
            <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{user?.name}</span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-tighter flex items-center gap-0.5">
              <ShieldCheck className="h-2 w-2 text-indigo-500" />
              {user?.role}
            </span>
          </div>
        </Link>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium px-2 sm:px-3 rounded-xl transition-all duration-200">
          <LogOut className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
