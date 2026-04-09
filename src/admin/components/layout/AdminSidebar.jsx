import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Car, ClipboardList, Users2 } from "lucide-react";
import { cn } from "../../../shared/lib/utils";

export function AdminSidebar({ isOpen }) {
  const links = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard className="h-5 w-5" />, end: true },
    { name: "Users", path: "/admin/users", icon: <Users className="h-5 w-5" /> },
    { name: "Cars Inventory", path: "/admin/cars", icon: <Car className="h-5 w-5" /> },
    { name: "Requests", path: "/admin/requests", icon: <ClipboardList className="h-5 w-5" /> },
    { name: "Team", path: "/admin/team", icon: <Users2 className="h-5 w-5" /> },
  ];

  return (
    <aside className={cn(
      "w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex-shrink-0 flex flex-col fixed md:sticky top-16 md:top-0 h-[calc(100vh-4rem)] md:h-screen z-30 transition-transform duration-300 ease-in-out md:translate-x-0",
      !isOpen && "-translate-x-full"
    )}>
      <div className="p-4 flex-1 space-y-1.5 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 mt-2">Menu</p>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all hover:text-white hover:bg-slate-800/80",
                isActive && "bg-indigo-600 text-white hover:bg-indigo-600 shadow-md translate-x-1"
              )
            }
          >
            {link.icon}
            {link.name}
          </NavLink>
        ))}
      </div>
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-xs font-medium text-slate-400 mb-1">System Status</p>
          <div className="flex items-center gap-2 text-sm text-green-400 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Operational
          </div>
        </div>
      </div>
    </aside>
  );
}
