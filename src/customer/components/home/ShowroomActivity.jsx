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
    <section className="py-2 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Live Activity Feed</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Operational Intelligence</h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-xl font-medium">
            Real-time insights into showroom inventory lifecycle and client procurement activity.
          </p>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex-1 sm:flex-none bg-white dark:bg-zinc-900/50 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all duration-500">
            <p className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-tight">Daily Volume</p>
            <p className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">{metrics.today} <span className="text-[10px] sm:text-xs font-medium text-zinc-400 tracking-tight">units processed</span></p>
          </div>
          <div className="flex-1 sm:flex-none bg-white dark:bg-zinc-900/50 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all duration-500">
            <p className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-tight">Weekly Throughput</p>
            <p className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">{metrics.week} <span className="text-[10px] sm:text-xs font-medium text-zinc-400 tracking-tight">completed assets</span></p>
          </div>
        </div>
      </div>

      {/* Activity Feed Container */}
      <div className="relative overflow-hidden">
        {/* Desktop View (Grid) */}
        {!carsLoading && activities.length > 0 ? (
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 m-4">
            {activities.map((activity, index) => (
              <ActivityCard key={activity.id} activity={activity} index={index} />
            ))}
          </div>
        ) : !carsLoading && (
          <div className="py-12 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-[2.5rem] border border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center">
            <Activity className="h-10 w-10 text-zinc-300 dark:text-zinc-700 mb-4" />
            <p className="text-xs font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">Awaiting Operational Synchronisation</p>
          </div>
        )}

        {/* Mobile View (Auto-swipe Carousel) */}
        <div className="md:hidden relative h-[220px]">
          <AnimatePresence mode="wait">
            {!carsLoading && activities.length > 0 && (
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <ActivityCard activity={activities[activeIndex]} index={activeIndex} isMobile />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Indicators (Mobile only) */}
        <div className="flex justify-center gap-1.5 mt-4 md:hidden">
          {activities.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-6 bg-brand-primary' : 'w-1.5 bg-zinc-200 dark:bg-zinc-800'
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ActivityCard({ activity, index, isMobile = false }) {
  return (
    <motion.div
      initial={!isMobile ? { opacity: 0, y: 12 } : {}}
      animate={!isMobile ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
      className="h-full group"
    >
      <div className="h-full bg-white dark:bg-zinc-900/40 backdrop-blur-xl p-5 rounded-[2rem] border border-zinc-100 dark:border-zinc-800/50 hover:border-brand-primary/20 hover:bg-white dark:hover:bg-zinc-900/60 transition-all duration-500 shadow-sm hover:shadow-xl">
        <div className="flex items-center justify-between mb-5 gap-3">
          <div className={`p-2.5 rounded-2xl border flex-shrink-0 ${activity.colorClass}`}>
            {activity.icon}
          </div>
          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800/50 px-2.5 py-1 rounded-lg border border-transparent dark:border-zinc-700/30 whitespace-nowrap transition-colors duration-500">
            <Clock className="h-3 w-3" />
            {activity.timestamp}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-[15px] sm:text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-brand-primary transition-colors duration-300 line-clamp-1 leading-snug tracking-tight">
            {activity.vehicle}
          </h3>
          <div className="flex items-center gap-2 text-[13px] text-zinc-500 dark:text-zinc-400">
            <div className="h-5 w-5 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 overflow-hidden">
              <User className="h-2.5 w-2.5 text-zinc-500" />
            </div>
            <span className="font-medium tracking-tight truncate">{activity.customer}</span>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-zinc-50 dark:border-zinc-800/50 flex items-center justify-between">
          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-colors duration-300 ${activity.badgeClass}`}>
            {activity.status}
          </span>
          <div className="h-8 w-8 rounded-full flex items-center justify-center text-zinc-400 group-hover:text-brand-primary group-hover:bg-brand-primary/5 transition-all duration-300 border border-transparent group-hover:border-brand-primary/10">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
