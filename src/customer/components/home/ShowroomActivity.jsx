import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  CheckCircle2,
  Clock,
  History,
  ArrowUpRight,
  User,
  Car as CarIcon
  } from "lucide-react";
import { useCustomerCars } from "../../context/CustomerCarsContext";
import { useCustomerRequests } from "../../context/CustomerRequestsContext";
import { formatDistanceToNow } from "date-fns";

const EVENT_CONFIG = {
  new_arrival: {
    icon: <Zap className="h-4 w-4 text-cyan-600 dark:text-cyan-500" />,
    colorClass: "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-700/30",
    badgeClass: "bg-transparent text-zinc-500 border-zinc-200 dark:border-zinc-800/50",
    status: "New Inventory Added"
  },
  sold: {
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />,
    colorClass: "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-700/30",
    badgeClass: "bg-emerald-50/50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-500 border-emerald-200/30 dark:border-emerald-900/30",
    status: "Purchase Approved"
  },
  request: {
    icon: <History className="h-4 w-4 text-amber-600 dark:text-amber-500" />,
    colorClass: "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-700/30",
    badgeClass: "bg-amber-50/50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-500 border-amber-200/30 dark:border-amber-900/30",
    status: "Vehicle Reserved"
  }
};

export function ShowroomActivity() {
  const { cars, loading: carsLoading } = useCustomerCars();
  const { requests, loading: requestsLoading } = useCustomerRequests();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const activities = useMemo(() => {
    if (carsLoading || requestsLoading) return [];

    const feed = [];

    // 1. Map Recent Requests (Max 3)
    requests.slice(0, 3).forEach(req => {
      const car = cars.find(c => String(c.id) === String(req.carId));
      const config = req.status === 'approved' ? EVENT_CONFIG.sold : EVENT_CONFIG.request;

      feed.push({
        id: req.firestoreId || `req-${req.userId}-${req.carId}`,
        type: req.status === 'approved' ? 'sold' : 'request',
        vehicle: car?.name || "Premium Asset",
        customer: "Institutional Client", // Hide exact name for privacy in public feed
        timestamp: req.timestamp ? formatDistanceToNow(new Date(req.timestamp), { addSuffix: true }) : "Recent",
        status: config.status,
        ...config
      });
    });

    // 2. Map New Arrivals (Latest 2)
    cars.slice(0, 2).forEach(car => {
      feed.push({
        id: `car-${car.id}`,
        type: 'new_arrival',
        vehicle: `${car.modelYear} ${car.name}`,
        customer: "Inventory Sync",
        timestamp: "Live Now",
        status: EVENT_CONFIG.new_arrival.status,
        ...EVENT_CONFIG.new_arrival
      });
    });

    return feed.sort((a, b) => b.id.localeCompare(a.id)).slice(0, 5);
  }, [cars, requests, carsLoading, requestsLoading]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile || activities.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % activities.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isMobile, activities.length]);

  const metrics = useMemo(() => {
    if (carsLoading || requestsLoading) return { today: 0, week: 0 };

    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const weekStart = new Date(now.setDate(now.getDate() - 7));

    const todayEvents = [
      ...cars.filter(c => c.createdAt && new Date(c.createdAt) >= todayStart),
      ...requests.filter(r => r.timestamp && new Date(r.timestamp) >= todayStart)
    ].length;

    const weekEvents = [
      ...cars.filter(c => c.createdAt && new Date(c.createdAt) >= weekStart),
      ...requests.filter(r => r.timestamp && new Date(r.timestamp) >= weekStart)
    ].length;

    return { today: todayEvents, week: weekEvents };
  }, [cars, requests, carsLoading, requestsLoading]);

  return (
    <section className="py-2 space-y-8 w-full max-w-[100vw] overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-7xl mx-auto">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="relative flex h-1.5 w-1.5">
              <span className="animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] absolute inline-flex h-full w-full rounded-full bg-emerald-500/50"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-600/60"></span>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500/70">Live Stream</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Operational Intelligence</h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-xl font-medium">
            Real-time insights into showroom inventory lifecycle and client procurement activity.
          </p>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 relative z-10">
          <div className="flex-1 sm:flex-none bg-zinc-50/50 shadow-none dark:bg-zinc-900/30 backdrop-blur-2xl px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-500">
            <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-tight">Daily Volume</p>
            <p className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">{metrics.today} <span className="text-[10px] sm:text-xs font-semibold text-zinc-400 tracking-tight">units</span></p>
          </div>
          <div className="flex-1 sm:flex-none bg-zinc-50/50 shadow-none dark:bg-zinc-900/30 backdrop-blur-2xl px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-500">
            <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-tight">Weekly Throughput</p>
            <p className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">{metrics.week} <span className="text-[10px] sm:text-xs font-semibold text-zinc-400 tracking-tight">units</span></p>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Timeline */}
      <div className="relative w-full pb-4">
        {!carsLoading && activities.length > 0 ? (
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {/* Start Spacer to align with container */}
            <div className="w-0 sm:w-1 lg:w-4 flex-shrink-0" />
            {activities.map((activity, index) => (
              <ActivityCard key={activity.id} activity={activity} index={index} />
            ))}
            {/* End Spacer */}
            <div className="w-4 sm:w-8 flex-shrink-0" />
          </div>
        ) : !carsLoading && (
          <div className="max-w-7xl mx-auto py-12 bg-zinc-50/30 dark:bg-zinc-900/10 rounded-[2rem] border border-dashed border-zinc-200/60 dark:border-zinc-800/50 flex flex-col items-center justify-center text-center">
            <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-3">
              <span className="w-1.5 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
            </div>
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">Awaiting Operational Synchronization</p>
          </div>
        )}
      </div>
    </section>
  );
}

function ActivityCard({ activity, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex-shrink-0 w-[260px] sm:w-[280px] snap-center sm:snap-start group cursor-default"
    >
      <div className="h-full bg-white/60 dark:bg-zinc-900/20 backdrop-blur-3xl p-4 rounded-2xl border border-zinc-200/40 dark:border-zinc-800/40 hover:border-zinc-300 dark:hover:border-zinc-700/60 transition-all duration-[600ms] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-1.5 rounded-xl border ${activity.colorClass} flex-shrink-0 transition-colors duration-500`}>
            {activity.icon}
          </div>
          <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
            <Clock className="h-3 w-3 opacity-60" />
            {activity.timestamp}
          </span>
        </div>

        <div className="space-y-1.5 mb-6">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors duration-[600ms] line-clamp-1 tracking-tight">
            {activity.vehicle}
          </h3>
          <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-500">
            <div className="h-4 w-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200/50 dark:border-zinc-700/50">
              <User className="h-2 w-2 text-zinc-400" />
            </div>
            <span className="font-semibold tracking-wide truncate">{activity.customer}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/40 flex items-center justify-between">
          <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest border transition-colors duration-500 ${activity.badgeClass}`}>
            {activity.status}
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-900 dark:group-hover:text-zinc-400 transition-colors duration-500" />
        </div>
      </div>
    </motion.div>
  );
}
