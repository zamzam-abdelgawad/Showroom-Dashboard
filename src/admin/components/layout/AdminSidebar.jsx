import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Car, ClipboardList, Users2, MessageSquare } from "lucide-react";
import { cn } from "../../../shared/lib/utils";
import { useMessages } from "../../context/MessagesContext";

export function AdminSidebar({ isOpen }) {
  const { unreadCount } = useMessages();

  const links = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard className="h-5 w-5" />, end: true },
    { name: "Users", path: "/admin/users", icon: <Users className="h-5 w-5" /> },
    { name: "Cars Inventory", path: "/admin/cars", icon: <Car className="h-5 w-5" /> },
    { name: "Requests", path: "/admin/requests", icon: <ClipboardList className="h-5 w-5" /> },
    { name: "Team", path: "/admin/team", icon: <Users2 className="h-5 w-5" /> },
    { name: "Messages", path: "/admin/messages", icon: <MessageSquare className="h-5 w-5" />, badge: unreadCount },
  ];

  return (
    <aside className={cn(
      "w-64 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-300 border-r border-slate-800/50 flex-shrink-0 flex flex-col fixed md:sticky top-16 h-[calc(100vh-4rem)] z-30 transition-transform duration-300 ease-in-out md:translate-x-0",
      !isOpen && "-translate-x-full"
    )}>
      {/* Decorative gradient line at top */}
      <div className="h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex-shrink-0" />

      <div className="p-4 flex-1 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 mt-2">Navigation</p>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-indigo-600/90 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              )
            }
          >
            <span className="relative">
              {link.icon}
            </span>
            <span className="flex-1">{link.name}</span>
            {link.badge > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-none animate-pulse">
                {link.badge > 99 ? "99+" : link.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>
      <div className="p-4 border-t border-slate-800/50 flex-shrink-0">
        <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <p className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">System Status</p>
          <div className="flex items-center gap-2 text-sm text-emerald-400 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            All Systems Operational
          </div>
        </div>
      </div>
    </aside>
  );
}
