import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomerCars } from "../context/CustomerCarsContext";
import { CardContent } from "../../shared/components/ui/Card";
import { Input } from "../../shared/components/ui/Input";
import { Skeleton } from "../../shared/components/ui/Skeleton";
import { StaggeredGrid, StaggeredCard } from "../../shared/components/animations/StaggeredGrid";
import { Search, Filter, Car, Calendar, ArrowRight } from "lucide-react";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
          Find Your Perfect <span className="text-indigo-600">Vehicle</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Browse our curated collection of premium vehicles. Each car undergoes a 150-point inspection.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or brand..."
            className="pl-10 h-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Cars</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-bold text-gray-900">{filteredCars.length}</span> vehicles
        </p>
      </div>

      {/* Car Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-80 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredCars.length === 0 ? (
        <div className="text-center py-20">
          <Car className="h-16 w-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900">No vehicles found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <StaggeredGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <StaggeredCard
              key={car.id}
              className="p-0 border-none shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
              onClick={() => navigate(`/cars/${car.id}`)}
            >
              <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                <img
                  src={car.images?.[0] || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=600"}
                  alt={car.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm ${car.status === 'Available' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                    }`}>
                    {car.status}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">{car.brand}</p>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{car.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar className="h-3 w-3" />
                    {car.modelYear}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <p className="text-xl font-extrabold text-gray-900">${car.sellingPrice?.toLocaleString()}</p>
                  <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Details <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </CardContent>
            </StaggeredCard>
          ))}
        </StaggeredGrid>
      )}
    </div>
  );
}
