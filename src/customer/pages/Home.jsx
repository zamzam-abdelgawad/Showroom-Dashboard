import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomerCars } from "../context/CustomerCarsContext";
import { CardContent } from "../../shared/components/ui/Card";
import { Input } from "../../shared/components/ui/Input";
import { Skeleton } from "../../shared/components/ui/Skeleton";
import { StaggeredGrid, StaggeredCard } from "../../shared/components/animations/StaggeredGrid";
import { Search, Filter, Car, Calendar, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  const { cars, loading } = useCustomerCars();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white dark:bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-2xl p-5 -mt-16 relative z-10">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="SEARCH BY MODEL OR NOMENCLATURE..."
              className="pl-12 h-12 w-full rounded-xl border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-brand-primary text-[11px] font-black tracking-widest placeholder:text-zinc-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-950 px-4 py-1 rounded-xl border border-zinc-100 dark:border-zinc-800 w-full md:w-auto">
              <Filter className="h-4 w-4 text-brand-primary" />
              <select
                className="h-10 bg-transparent text-[11px] font-black uppercase tracking-widest focus:outline-none transition-shadow dark:text-zinc-100 w-full"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">ALL ASSETS</option>
                <option value="available">AVAILABLE</option>
                <option value="sold">SOLD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between px-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            AVAILABLE VEHICLES <span className="text-zinc-900 dark:text-zinc-100 ml-2">{filteredCars.length}</span>
          </p>
        </div>

        {/* Car Grid */}
        {loading ? (
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
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 mt-2 uppercase tracking-widest leading-relaxed">Adjust your deployment parameters <br /> to refine inventory results.</p>
          </div>
        ) : (
          <StaggeredGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {filteredCars.map((car) => (
              <StaggeredCard
                key={car.id}
                className="p-0 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl transition-all duration-700 cursor-pointer group overflow-hidden rounded-2xl dark:bg-zinc-950 bg-white"
                onClick={() => navigate(`/cars/${car.id}`)}
              >
                <div className="relative aspect-[16/11] bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                  <img
                    src={car.images?.[0] || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=600"}
                    alt={car.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md border border-white/10 ${car.status === 'Available' ? 'bg-brand-primary text-white' : 'bg-zinc-900 text-zinc-400'
                      }`}>
                      {car.status === 'Available' ? 'Available' : 'Sold'}
                    </span>
                  </div>
                  {/* Internal badge */}
                  <div className="absolute bottom-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md text-zinc-900 dark:text-zinc-100 font-black text-[10px] uppercase px-4 py-2 rounded-lg shadow-2xl tracking-[0.1em] border border-zinc-100 dark:border-zinc-800">
                      View
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-700"></div>
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
                    <span className="text-[9px] font-black text-brand-primary flex items-center gap-2 uppercase tracking-[0.2em] group-hover:gap-3 transition-all duration-500">
                      View <ArrowRight className="h-3.5 w-3.5" />
                    </span>
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
