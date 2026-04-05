import { useAuth } from "../../context/AuthContext";
import { LogOut, User as UserIcon, Car, ShieldCheck, Menu } from "lucide-react";
import { Button } from "../ui/Button";
import { Link, useNavigate } from "react-router-dom";

export function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 w-full shadow-sm">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onMenuClick} 
          className="md:hidden p-2 hover:bg-gray-100"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </Button>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white shadow-indigo-200 shadow-lg">
            <Car className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-800 tracking-tight hidden xs:block">Showroom<span className="text-indigo-600">Elite</span></h2>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-5">
        <Link to="/profile" className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 px-2 sm:px-3 py-1.5 rounded-full transition-colors border border-gray-100">
          <UserIcon className="h-4 w-4 text-indigo-600" />
          <div className="hidden sm:flex flex-col items-start leading-tight">
            <span className="text-xs font-bold text-gray-900">{user?.name}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-tighter flex items-center gap-0.5">
              {user?.role === 'admin' ? <ShieldCheck className="h-2 w-2 text-indigo-500" /> : null}
              {user?.role}
            </span>
          </div>
        </Link>
        <Button variant="ghost" size="sm" onClick={logout} className="text-gray-600 hover:text-red-700 hover:bg-red-50 font-medium px-2 sm:px-4">
          <LogOut className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
