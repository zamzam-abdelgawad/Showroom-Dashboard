import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomerCars } from "../context/CustomerCarsContext";
import { CardContent } from "../../shared/components/ui/Card";
import { Input } from "../../shared/components/ui/Input";
import { Skeleton } from "../../shared/components/ui/Skeleton";
import { StaggeredGrid, StaggeredCard } from "../../shared/components/animations/StaggeredGrid";
import { Search, Filter, Car, Calendar, ArrowRight, Sparkles, Package, CheckCircle2, ShieldCheck, LineChart, RefreshCw, Headset } from "lucide-react";
import { useCustomerRequests } from "../context/CustomerRequestsContext";
import { useAuth } from "../../shared/context/AuthContext";
import { ShowroomActivity } from "../components/home/ShowroomActivity";

export default function Home() {
  const { cars, loading: carsLoading } = useCustomerCars();
  const { requests, loading: requestsLoading } = useCustomerRequests();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const matchSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase()) || car.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || car.status.toLowerCase() === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [cars, searchTerm, statusFilter]);

  return (
    <div className="animate-in bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-zinc-950 py-24 sm:py-32 transition-colors duration-500">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(167,139,250,0.05),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(167,139,250,0.03),transparent_70%)] opacity-80 mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')] opacity-[0.015] mix-blend-overlay dark:opacity-[0.02]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="absolute top-[20%] right-[10%] lg:right-[15%] w-64 h-32 bg-white/5 dark:bg-white-[0.02] backdrop-blur-3xl rounded-3xl border border-black/5 dark:border-white/5 rotate-[3deg] opacity-0 animate-[fadeIn_2s_ease-in-out_forwards,float_10s_ease-in-out_infinite] pointer-events-none -z-10 flex flex-col justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="relative flex h-1.5 w-1.5">
                <span className="animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite] absolute inline-flex h-full w-full rounded-full bg-emerald-500/50"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-600/60"></span>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500/80">Network Sync</span>
            </div>
            <div className="space-y-1">
              <div className="h-1.5 w-12 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-full" />
              <div className="h-1.5 w-8 bg-zinc-200/30 dark:bg-zinc-800/30 rounded-full" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-zinc-100/50 dark:bg-white/[0.02] backdrop-blur-3xl px-5 py-2 rounded-xl text-xs font-semibold tracking-wide text-brand-primary mb-8 border border-zinc-200/50 dark:border-white/5 shadow-sm">
            <Sparkles className="h-4 w-4" />
            Quality Cars · Best Selection
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold text-zinc-950 dark:text-white tracking-luxury leading-tight relative z-10">
            Find your <br />
            <span className="text-brand-primary">Dream Car</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-base sm:text-lg mt-8 max-w-2xl mx-auto leading-relaxed font-medium tracking-tight relative z-10">
            Browse our collection of hand-picked vehicles. Every car is thoroughly inspected to ensure it's in perfect condition.
          </p>

          {/* Trust Metrics Banner */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-16">
            {[
              { label: "Vehicles Delivered", value: "1,200+" },
              { label: "Client Satisfaction", value: "98%" },
              { label: "Dealer Support", value: "24/7" },
              { label: "Premium Partners", value: "Trusted" },
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <p className="text-2xl font-bold text-zinc-950 dark:text-white tracking-tightest">{stat.value}</p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brand Showcase */}
      <div className="bg-white dark:bg-zinc-950 py-6 overflow-hidden relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {['BMW', 'Mercedes-Benz', 'Audi', 'Porsche', 'Lexus', 'Range Rover'].map((brand) => (
              <span key={brand} className="text-lg md:text-xl font-black tracking-widest text-zinc-500 opacity-60 dark:text-zinc-600 dark:opacity-50 cursor-default select-none grayscale transition-all duration-[800ms] ease-out hover:opacity-100 dark:hover:opacity-100 hover:-translate-y-[1px] hover:text-zinc-950 dark:hover:text-zinc-300">
                {brand.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Search & Filter */}
        <div className="flex flex-row gap-3 items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/20 backdrop-blur-2xl rounded-2xl border border-zinc-200/50 dark:border-zinc-800/30 p-2 md:p-3 relative z-10 mx-auto max-w-4xl transition-all duration-700 focus-within:scale-[1.005] hover:border-zinc-300 dark:hover:border-zinc-700/50">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
            <Input
              placeholder="Search by exact model or brand..."
              className="pl-6 md:pl-12 h-11 w-full rounded-xl border-transparent dark:border-transparent bg-white/60 dark:bg-zinc-950/40 focus:ring-brand-primary/20 focus:border-brand-primary/30 text-sm font-medium tracking-tight placeholder:text-zinc-400 dark:placeholder:text-zinc-500/80 transition-all duration-700 shadow-none dark:shadow-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Custom Filter Dropdown */}
          <div className="relative flex-shrink-0" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-center gap-3 bg-white/60 dark:bg-zinc-950/40 px-4 h-11 rounded-xl border border-transparent w-12 md:w-36 text-sm font-semibold tracking-wider text-zinc-700 dark:text-zinc-400 hover:text-brand-primary transition-all duration-[800ms]"
            >
              <Filter className="h-4 w-4 flex-shrink-0 opacity-70" />
              <span className="hidden md:block flex-1 text-left text-[11px] uppercase tracking-widest">
                {statusFilter === 'all' ? 'All Assets' : statusFilter === 'available' ? 'Available' : 'Sold'}
              </span>
            </button>

            {isFilterOpen && (
              <div className="absolute top-full mt-2 right-0 left-auto w-40 bg-zinc-50 dark:bg-zinc-900/90 backdrop-blur-2xl border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl shadow-xl overflow-hidden z-50 py-1">
                {[
                  { value: 'all', label: 'All Assets' },
                  { value: 'available', label: 'Available' },
                  { value: 'sold', label: 'Sold' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setStatusFilter(opt.value); setIsFilterOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-semibold tracking-widest uppercase transition-all duration-[600ms] text-left
              ${statusFilter === opt.value
                        ? 'text-brand-primary bg-brand-primary/5'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live Showroom Activity - Hidden when searching/filtering to focus on results */}
        {!searchTerm && statusFilter === 'all' && <ShowroomActivity />}

        {/* Car Grid */}
        {carsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-96 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
            ))}
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-24">
            <div className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-3xl inline-block mb-6 shadow-inner">
              <Car className="h-16 w-16 text-zinc-300 dark:text-zinc-700" />
            </div>
            <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-100 uppercase tracking-tighter">Zero matches found</h3>
            <p className="text-sm font-normal text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
              Adjust your search parameters <br /> to refine inventory results.
            </p>
          </div>
        ) : (
          <StaggeredGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {filteredCars.map((car) => (
              <StaggeredCard
                key={car.id}
                className="p-0 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl transition-all duration-700 cursor-pointer group overflow-hidden rounded-2xl dark:bg-zinc-950 bg-white"
                onClick={() => navigate(`/cars/${car.id}`)}
              >
                <div className="relative aspect-[16/11] bg-zinc-100 dark:bg-zinc-900 overflow-hidden rounded-t-2xl">
                  <img
                    src={car.images?.[0] || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=600"}
                    alt={car.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0 rounded-t-2xl"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="relative">
                      {(car.status === 'Available' && (car.count ?? 0) > 0) && (
                         <span className="absolute -top-1 -right-1 flex h-2 w-2 z-20">
                            <span className="animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
                         </span>
                      )}
                      <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-xl backdrop-blur-md border transition-all duration-700 ${
                        (car.status === 'Available' && (car.count ?? 0) > 0)
                          ? 'bg-zinc-900/80 text-white border-white/10 dark:bg-white/90 dark:text-zinc-950 dark:border-black/5'
                          : 'bg-zinc-100/90 text-zinc-400 border-black/5 dark:bg-zinc-900/80 dark:text-zinc-500 dark:border-white/5'
                        }`}>
                        {(car.status === 'Available' && (car.count ?? 0) > 0) ? 'Available' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-1000" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{car.brand}</p>
                      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-brand-primary transition-colors duration-[800ms] tracking-tight">{car.name}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-50/50 dark:bg-zinc-900/30 px-2.5 py-1 rounded-lg border border-transparent tracking-widest">
                      <Calendar className="h-3 w-3" />
                      {car.modelYear}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-5 mt-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Valuation</p>
                        <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors duration-500 ${
                          (car.count ?? 0) > 0 ? 'text-zinc-500' : 'text-zinc-400/50 dark:text-zinc-600/50'
                        }`}>
                          {(car.count ?? 0) > 0 ? `${car.count} Available` : 'Depleted'}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-zinc-950 dark:text-zinc-100 tracking-tight leading-none">${car.sellingPrice?.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2.5">
                      {(user && requests.some(r => String(r.carId) === String(car.id) && r.status === 'pending')) ? (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500/80 bg-emerald-50 dark:bg-emerald-500/5 px-4 py-2 rounded-xl flex items-center gap-2 tracking-widest uppercase transition-all duration-[600ms]">
                          Pending <CheckCircle2 className="h-3.5 w-3.5" />
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 group-hover:text-brand-primary group-hover:bg-brand-primary/5 px-4 py-2 rounded-xl border border-transparent group-hover:border-brand-primary/10 tracking-widest uppercase transition-all duration-[800ms] cursor-pointer">
                          View Asset
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </StaggeredCard>
            ))}
          </StaggeredGrid>
        )}

        {/* Why Choose Us - Operational Value */}
        <div className="pt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-50/30 to-zinc-50/50 dark:via-zinc-900/10 dark:to-zinc-900/20 pointer-events-none -mx-4 sm:-mx-8 px-4 sm:px-8 rounded-3xl" />
          {[
            { title: "Verified Inventory", desc: "Every vehicle undergoes a rigorous 150-point technical inspection.", icon: <ShieldCheck className="h-4 w-4" /> },
            { title: "Transparent Pricing", desc: "No hidden fees. Precise market-driven valuation for every asset.", icon: <LineChart className="h-4 w-4" /> },
            { title: "Real-Time Availability", desc: "Our live synchronization ensures inventory data is always accurate.", icon: <RefreshCw className="h-4 w-4" /> },
            { title: "Dedicated Support", desc: "Professional advisors available for seamless procurement.", icon: <Headset className="h-4 w-4" /> },
          ].map((item, i) => (
            <div key={i} className="space-y-4 group relative z-10">
              <div className="h-8 w-8 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-transparent flex items-center justify-center text-zinc-400 dark:text-zinc-500 group-hover:text-brand-primary transition-colors duration-[800ms]">
                {item.icon}
              </div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest leading-snug">{item.title}</h4>
              <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}