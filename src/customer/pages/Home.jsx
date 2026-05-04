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
    <div className="animate-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-20 sm:py-28">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm text-indigo-300 font-medium mb-6 border border-white/10">
            <Sparkles className="h-3.5 w-3.5" />
            Premium Selection · 150-Point Inspection
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Find Your Perfect <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Vehicle</span>
          </h1>
          <p className="text-gray-400 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
            Browse our curated collection of premium vehicles. Every car undergoes a rigorous 150-point inspection for your peace of mind.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/60 dark:border-slate-800 shadow-sm p-4 -mt-8 relative z-5">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or brand..."
              className="pl-10 h-10 w-full rounded-xl dark:border-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                className="h-10 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow dark:text-gray-100"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Cars</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-bold text-gray-900 dark:text-gray-100">{filteredCars.length}</span> vehicles
          </p>
        </div>

        {/* Car Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-80 w-full rounded-2xl" />
            ))}
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-2xl inline-block mb-4">
              <Car className="h-12 w-12 text-gray-300 dark:text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">No vehicles found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <StaggeredGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <StaggeredCard
                key={car.id}
                className="p-0 border-none shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer group overflow-hidden rounded-2xl dark:bg-slate-900"
                onClick={() => navigate(`/cars/${car.id}`)}
              >
                <div className="relative aspect-[16/10] bg-gray-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={car.images?.[0] || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=600"}
                    alt={car.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm backdrop-blur-sm ${car.status === 'Available' ? 'bg-emerald-500/90 text-white' : 'bg-gray-800/70 text-white'
                      }`}>
                      {car.status}
                    </span>
                  </div>
                  {/* Price badge */}
                  <div className="absolute bottom-3 right-3">
                    <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-gray-900 dark:text-gray-100 font-extrabold text-sm px-3 py-1.5 rounded-xl shadow-lg">
                      ${car.sellingPrice?.toLocaleString()}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">{car.brand}</p>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">{car.name}</h3>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-800 px-2 py-1 rounded-lg">
                      <Calendar className="h-3 w-3" />
                      {car.modelYear}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-800">
                    <p className="text-xl font-extrabold text-gray-900 dark:text-gray-100">${car.sellingPrice?.toLocaleString()}</p>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300">
                      View Details <ArrowRight className="h-3 w-3" />
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
