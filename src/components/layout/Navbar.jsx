import { useAuth } from "../../context/AuthContext";
import { LogOut, User as UserIcon, Shield } from "lucide-react";
import { Button } from "../ui/Button";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10 w-full shadow-sm">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
          <Shield className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-extrabold text-gray-800 tracking-tight hidden sm:block">Admin<span className="text-indigo-600">Pro</span></h2>
      </div>
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
          <UserIcon className="h-4 w-4 text-indigo-600" />
          {user?.name}
        </div>
        <Button variant="ghost" size="sm" onClick={logout} className="text-gray-600 hover:text-red-700 hover:bg-red-50 font-medium">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
}
