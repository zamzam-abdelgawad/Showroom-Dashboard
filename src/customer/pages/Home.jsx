import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomerCars } from "../context/CustomerCarsContext";
import { CardContent } from "../../shared/components/ui/Card";
import { Input } from "../../shared/components/ui/Input";
import { Skeleton } from "../../shared/components/ui/Skeleton";
import { StaggeredGrid, StaggeredCard } from "../../shared/components/animations/StaggeredGrid";
import { Search, Filter, Car, Calendar, ArrowRight, Sparkles, Package, CheckCircle2 } from "lucide-react";
import { useCustomerRequests } from "../context/CustomerRequestsContext";
import { useAuth } from "../../shared/context/AuthContext";

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
      <div className="relative overflow-hidden bg-zinc-950 py-24 sm:py-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-brand-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute -bottom-[10%] -right-[5%] w-[50%] h-[50%] bg-brand-primary/5 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary mb-8 border border-white/10 shadow-2xl">
            <Sparkles className="h-4 w-4" />
            Quality Cars · Best Selection
          </div>
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter leading-none">
            FIND YOUR <br />
            <span className="text-brand-primary">DREAM CAR</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base mt-8 max-w-xl mx-auto leading-relaxed font-medium uppercase tracking-wide">
            Browse our collection of hand-picked vehicles. Every car is thoroughly inspected to ensure it's in perfect condition.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Search & Filter */}
        <div className="flex flex-row gap-3 items-center justify-between bg-white dark:bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-2xl p-5 -mt-16 relative z-10">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="SEARCH BY MODEL OR NOMENCLATURE..."
              className="pl-6 md:pl-12 h-12 w-full rounded-xl border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-brand-primary text-[11px] font-black tracking-widest placeholder:text-zinc-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Custom Filter Dropdown */}
          <div className="relative flex-shrink-0" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-center gap-3 bg-zinc-50 dark:bg-zinc-950 px-4 h-12 rounded-xl border border-zinc-100 dark:border-zinc-800 w-12 md:w-36 text-[11px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100 hover:border-brand-primary/40 transition-all duration-300"
            >
              <Filter className="h-4 w-4 text-brand-primary flex-shrink-0" />
              <span className="hidden md:block flex-1 text-left">
                {statusFilter === 'all' ? 'All Assets' : statusFilter === 'available' ? 'Available' : 'Sold'}
              </span>
              <svg
                className={`hidden md:block h-3 w-3 text-zinc-400 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isFilterOpen && (
              <div className="absolute top-full mt-2 right-0 left-auto w-36 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50">
                {[
                  { value: 'all', label: 'All Assets' },
                  { value: 'available', label: 'Available' },
                  { value: 'sold', label: 'Sold' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setStatusFilter(opt.value); setIsFilterOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all duration-200 text-left
              ${statusFilter === opt.value
                        ? 'bg-brand-primary/10 text-brand-primary'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                      }`}
                  >
                    {statusFilter === opt.value && (
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-primary flex-shrink-0" />
                    )}
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

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
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100">Zero matches found</h3>
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 mt-2 uppercase tracking-widest leading-relaxed">
              Adjust your deployment parameters <br /> to refine inventory results.
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
                    <span className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md border border-white/10 ${
                      (car.status === 'Available' && (car.count ?? 0) > 0)
                        ? 'bg-brand-primary text-white'
                        : 'bg-zinc-900 text-zinc-400'
                      }`}>
                      {(car.status === 'Available' && (car.count ?? 0) > 0) ? 'Available' : 'Sold Out'}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md text-zinc-900 dark:text-zinc-100 font-black text-[10px] uppercase px-4 py-2 rounded-lg shadow-2xl tracking-[0.1em] border border-zinc-100 dark:border-zinc-800">
                      View
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-700" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-brand-primary uppercase tracking-[0.2em]">{car.brand}</p>
                      <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100 group-hover:text-brand-primary transition-colors duration-500 tracking-tight uppercase">{car.name}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-zinc-400 dark:text-zinc-600 bg-zinc-50 dark:bg-zinc-900/50 px-2.5 py-1.5 rounded-md border border-zinc-100 dark:border-zinc-800 uppercase tracking-widest">
                      <Calendar className="h-3 w-3" />
                      {car.modelYear}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-5 border-t border-zinc-50 dark:border-zinc-900">
                    <div className="space-y-0.5">
                      <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Price</p>
                      <p className="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">${car.sellingPrice?.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                        (car.count ?? 0) > 0
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50'
                          : 'bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400 border border-red-100 dark:border-red-900/50'
                      }`}>
                        <Package className="h-2.5 w-2.5" />
                        {(car.count ?? 0) > 0 ? `${car.count} in stock` : 'Sold Out'}
                      </span>
                      {(user && requests.some(r => r.carId === car.id && r.status === 'pending')) ? (
                        <span className="text-[9px] font-black text-emerald-500 flex items-center gap-2 uppercase tracking-[0.2em]">
                          Pending <CheckCircle2 className="h-3.5 w-3.5" />
                        </span>
                      ) : (
                        <span className="text-[9px] font-black text-brand-primary flex items-center gap-2 uppercase tracking-[0.2em] group-hover:gap-3 transition-all duration-500">
                          View <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </StaggeredCard>
            ))}
          </StaggeredGrid>
        )}
      </div>
    </div>
  );
}