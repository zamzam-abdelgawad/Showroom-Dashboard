import { useAuth } from "../../../shared/context/AuthContext";
import { LogOut, User as UserIcon, Car, ShieldCheck, Menu, Bell, MessageSquare, ClipboardList, Clock, Circle, X } from "lucide-react";
import { Button } from "../../../shared/components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useMessages } from "../../context/MessagesContext";
import { useRequests } from "../../context/RequestsContext";
import { useUsers } from "../../context/UsersContext";
import { useCars } from "../../context/CarsContext";
import { ThemeToggle } from "../../../shared/components/ui/ThemeToggle";
import { useState, useMemo, useRef, useEffect } from "react";

export function AdminNavbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { messages, unreadCount: unreadMessages } = useMessages();
  const { requests, pendingCount: pendingRequests } = useRequests();
  const { users } = useUsers();
  const { cars } = useCars();
  
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef(null);

  const totalNotifications = unreadMessages + pendingRequests;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    }
    
    if (isNotificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isNotificationsOpen]);

  const allNotifications = useMemo(() => {
    const unreadMsgs = messages
      .filter(m => !m.read)
      .map(m => ({
        id: m.firestoreId,
        type: 'message',
        title: m.subject || 'Direct Inquiry',
        description: `From: ${m.name || 'Anonymous User'}`,
        time: m.createdAt,
        path: '/admin/messages'
      }));

    const pendingReqs = requests
      .filter(r => r.status === 'pending')
      .map(r => {
        const u = users.find(user => user.id === r.userId || user.firestoreId === r.userId);
        const c = cars.find(car => car.id === r.carId);
        return {
          id: r.firestoreId,
          type: 'request',
          title: 'Purchase Request',
          description: `${u?.firstName || 'User'} is interested in ${c?.name || 'Asset'}`,
          time: r.timestamp,
          path: '/admin/requests'
        };
      });

    return [...unreadMsgs, ...pendingReqs].sort((a, b) => {
      const timeA = a.time?.toDate ? a.time.toDate() : new Date(a.time);
      const timeB = b.time?.toDate ? b.time.toDate() : new Date(b.time);
      return timeB - timeA;
    });
  }, [messages, requests, users, cars]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleNotificationClick = (path) => {
    setIsNotificationsOpen(false);
    navigate(path);
  };

  return (
    <header className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50 h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40 w-full shadow-sm flex-shrink-0 transition-colors duration-500">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onMenuClick} 
          className="md:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl"
        >
          <Menu className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
        </Button>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/admin')}>
          <div className="bg-brand-primary p-2 rounded-xl text-white shadow-lg shadow-brand-primary/10">
            <Car className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200 tracking-tightest hidden sm:block">
            Showroom<span className="text-brand-primary">Precision</span>
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notificationRef}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 rounded-xl text-zinc-500 dark:text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
          >
            <Bell className="h-5 w-5" />
            {totalNotifications > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-brand-secondary text-brand-dark text-[10px] font-bold h-4 min-w-[16px] flex items-center justify-center rounded-full px-1 tracking-tighter">
                {totalNotifications > 9 ? "9+" : totalNotifications}
              </span>
            )}
          </Button>

          {/* Notification Dropdown Panel */}
          {isNotificationsOpen && (
            <>
              {/* Mobile Backdrop */}
              <div className="fixed inset-0 bg-zinc-950/20 dark:bg-zinc-950/40 z-40 md:hidden" onClick={() => setIsNotificationsOpen(false)} />
              
              {/* Dropdown Panel */}
              <div className="fixed md:absolute left-4 right-4 md:left-auto md:right-0 top-20 md:top-auto md:mt-2 w-auto md:w-[380px] bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[calc(100vh-6rem)] md:max-h-none">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 sticky top-0 bg-white dark:bg-zinc-900 z-10">
                  <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest">Global Intelligence</h3>
                  <button
                    onClick={() => setIsNotificationsOpen(false)}
                    className="p-1 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                  </button>
                </div>

                {/* Notifications List */}
                <div className="max-h-[calc(100vh-12rem)] md:max-h-[420px] overflow-y-auto">
                  {allNotifications.length === 0 ? (
                    <div className="py-16 flex flex-col items-center justify-center text-center px-4">
                      <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl mb-4 border border-zinc-100 dark:border-zinc-800">
                        <Bell className="h-7 w-7 text-zinc-300 dark:text-zinc-700" />
                      </div>
                      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">No notifications</p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">You're all caught up!</p>
                    </div>
                  ) : (
                    <div className="p-2">
                      {allNotifications.map((notif) => (
                        <div 
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif.path)}
                          className="group cursor-pointer p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 active:bg-zinc-100 dark:active:bg-zinc-800 transition-all border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800 flex items-start gap-3 mb-1"
                        >
                          <div className={`p-2.5 rounded-lg flex-shrink-0 transition-colors border ${
                            notif.type === 'message' 
                            ? 'bg-brand-primary/5 text-brand-primary border-brand-primary/10 group-hover:bg-brand-primary group-hover:text-white' 
                            : 'bg-brand-secondary/5 text-brand-secondary border-brand-secondary/10 group-hover:bg-brand-secondary group-hover:text-brand-dark'
                          }`}>
                            {notif.type === 'message' ? <MessageSquare className="h-4 w-4" /> : <ClipboardList className="h-4 w-4" />}
                          </div>
                           <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className="text-xs font-bold text-zinc-950 dark:text-zinc-50 uppercase tracking-widest truncate group-hover:text-brand-primary transition-colors">{notif.title}</p>
                              <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 flex items-center gap-1 flex-shrink-0 whitespace-nowrap uppercase tracking-widest">
                                <Clock className="h-3 w-3" />
                                {notif.time?.toDate ? notif.time.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(notif.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-500 tracking-tight leading-tight line-clamp-1">{notif.description}</p>
                          </div>
                          <div className="flex items-center pt-1 pr-1">
                            <div className="h-2 w-2 rounded-full bg-brand-primary animate-pulse" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {allNotifications.length > 0 && (
                  <div className="px-4 py-3 border-t border-zinc-50 dark:border-zinc-900 text-center bg-zinc-50/50 dark:bg-zinc-900/30 sticky bottom-0">
                    <p className="text-[8px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                      Operational synchronization active
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

         <Link to="/admin/profile" className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-2 sm:px-3 py-1.5 rounded-full transition-all duration-200 border border-zinc-100 dark:border-zinc-800 hover:shadow-sm uppercase tracking-widest">
          <div className="h-7 w-7 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
            <UserIcon className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-400" />
          </div>
          <div className="hidden sm:flex flex-col items-start leading-tight">
            <span className="text-[11px] font-bold text-zinc-950 dark:text-zinc-50">{user?.name}</span>
            <span className="text-[9px] text-brand-primary uppercase tracking-widest flex items-center gap-0.5">
              <ShieldCheck className="h-2 w-2" />
              {user?.role}
            </span>
          </div>
        </Link>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-zinc-500 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs font-bold uppercase tracking-widest px-2 sm:px-3 rounded-xl transition-all duration-200">
          <LogOut className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}