import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  TrendingDown, 
  History, 
  ArrowUpRight,
  ShieldCheck,
  User,
  Car as CarIcon
} from "lucide-react";

const ACTIVITIES = [
  {
    id: 1,
    type: "sold",
    vehicle: "BMW M5 Competition",
    customer: "Sarah L.",
    timestamp: "2 mins ago",
    status: "Completed",
    icon: <CheckCircle2 className="h-4 w-4" />,
    colorClass: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    badgeClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50"
  },
  {
    id: 2,
    type: "test_drive",
    vehicle: "Audi RS7 Sportback",
    customer: "Michael R.",
    timestamp: "15 mins ago",
    status: "Scheduled",
    icon: <Calendar className="h-4 w-4" />,
    colorClass: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    badgeClass: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-blue-100 dark:border-blue-900/50"
  },
  {
    id: 3,
    type: "new_arrival",
    vehicle: "2024 Porsche 911 GT3 RS",
    customer: "Fleet Update",
    timestamp: "1 hour ago",
    status: "Live",
    icon: <Zap className="h-4 w-4" />,
    colorClass: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    badgeClass: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-100 dark:border-amber-900/50"
  },
  {
    id: 4,
    type: "financing",
    vehicle: "Range Rover Sport",
    customer: "David K.",
    timestamp: "2 hours ago",
    status: "Approved",
    icon: <ShieldCheck className="h-4 w-4" />,
    colorClass: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    badgeClass: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50"
  },
  {
    id: 5,
    type: "price_update",
    vehicle: "Mercedes-AMG G63",
    customer: "Market Sync",
    timestamp: "Today",
    status: "Optimized",
    icon: <TrendingDown className="h-4 w-4" />,
    colorClass: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    badgeClass: "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border-rose-100 dark:border-rose-900/50"
  }
];

export function ShowroomActivity() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ACTIVITIES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isMobile]);

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
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Business Intelligence</h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-xl font-medium">
            Real-time insights into showroom operations and premium client engagements.
          </p>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex-1 sm:flex-none bg-white dark:bg-zinc-900/50 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-tight">Today</p>
            <p className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">12 <span className="text-[10px] sm:text-xs font-medium text-zinc-400">events</span></p>
          </div>
          <div className="flex-1 sm:flex-none bg-white dark:bg-zinc-900/50 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <p className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-tight">Week</p>
            <p className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">48 <span className="text-[10px] sm:text-xs font-medium text-zinc-400">units</span></p>
          </div>
        </div>
      </div>

      {/* Activity Feed Container */}
      <div className="relative overflow-hidden">
        {/* Desktop View (Grid) */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {ACTIVITIES.map((activity, index) => (
            <ActivityCard key={activity.id} activity={activity} index={index} />
          ))}
        </div>

        {/* Mobile View (Auto-swipe Carousel) */}
        <div className="md:hidden relative h-[220px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <ActivityCard activity={ACTIVITIES[activeIndex]} index={activeIndex} isMobile />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicators (Mobile only) */}
        <div className="flex justify-center gap-1.5 mt-4 md:hidden">
          {ACTIVITIES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === activeIndex ? 'w-6 bg-brand-primary' : 'w-1.5 bg-zinc-200 dark:bg-zinc-800'
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
        <div className="flex items-start justify-between mb-5">
          <div className={`p-2.5 rounded-2xl border ${activity.colorClass}`}>
            {activity.icon}
          </div>
          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800/50 px-2 py-1 rounded-lg border border-transparent dark:border-zinc-700/30">
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
