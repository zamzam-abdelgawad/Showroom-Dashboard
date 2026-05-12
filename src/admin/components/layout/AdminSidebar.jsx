import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Car, ClipboardList, Users2, MessageSquare } from "lucide-react";
import { cn } from "../../../shared/lib/utils";
import { useMessages } from "../../context/MessagesContext";
import { useRequests } from "../../context/RequestsContext";

export function AdminSidebar({ isOpen }) {
  const { unreadCount } = useMessages();
  const { pendingCount } = useRequests();

  const links = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard className="h-5 w-5" />, end: true },
    { name: "Users", path: "/admin/users", icon: <Users className="h-5 w-5" /> },
    { name: "Cars", path: "/admin/cars", icon: <Car className="h-5 w-5" /> },
    { name: "Requests", path: "/admin/requests", icon: <ClipboardList className="h-5 w-5" />, badge: pendingCount },
    { name: "Team", path: "/admin/team", icon: <Users2 className="h-5 w-5" /> },
    { name: "Messages", path: "/admin/messages", icon: <MessageSquare className="h-5 w-5" />, badge: unreadCount },
  ];

  return (
    <aside className={cn(
      "w-64 bg-zinc-950 text-zinc-300 border-r border-zinc-900 flex-shrink-0 flex flex-col fixed md:sticky top-16 h-[calc(100vh-4rem)] z-30 transition-transform duration-300 ease-in-out md:translate-x-0",
      !isOpen && "-translate-x-full"
    )}>
      {/* Subtle border line at top */}
      <div className="h-[1px] bg-zinc-800 flex-shrink-0" />

      <div className="p-4 flex-1 space-y-1 overflow-y-auto">
        <p className="px-3 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 mt-2">Main Navigation</p>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                isActive
                  ? "bg-brand-primary text-white shadow-lg shadow-brand/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              )
            }
          >
            <span className="relative">
              {link.icon}
            </span>
            <span className="flex-1">{link.name}</span>
            {link.badge > 0 && (
              <span className="bg-brand-secondary text-brand-dark text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-none tracking-tighter">
                {link.badge > 99 ? "99+" : link.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>
      <div className="p-4 border-t border-zinc-900 flex-shrink-0">
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50">
          <p className="text-[10px] font-bold text-zinc-500 mb-1.5 uppercase tracking-widest text-center">System Integrity</p>
          <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-30 animate-pulse"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            Core V1.2.4 Active
          </div>
        </div>
      </div>
    </aside>
  );
}
