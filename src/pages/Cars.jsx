import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCars } from "../context/CarsContext";
import { useDebounce } from "../hooks/useDebounce";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { Search, Filter, Edit2, Trash2, Plus, CheckCircle, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { CarFormModal } from "../components/cars/CarFormModal";
import { DeleteConfirmModal } from "../components/ui/DeleteConfirmModal";

export default function Cars() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { cars, loading, addCar, updateCar, deleteCar, markAsSold } = useCars();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || "all"); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const urlStatus = searchParams.get('status');
    if (urlStatus && urlStatus !== statusFilter) {
      setStatusFilter(urlStatus);
    }
  }, [searchParams, statusFilter]);

  const handleFilterChange = (val) => {
    setStatusFilter(val);
    if (val === 'all') {
      searchParams.delete('status');
    } else {
      searchParams.set('status', val);
    }
    setSearchParams(searchParams);
  };

  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const matchName = car.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
                        car.brand.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchStatus = statusFilter === 'all' || car.status.toLowerCase() === statusFilter;
      return matchName && matchStatus;
    });
  }, [cars, debouncedSearch, statusFilter]);

  const totalPages = Math.ceil(filteredCars.length / itemsPerPage) || 1;
  const paginatedCars = filteredCars.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter]);

  const handleAddSubmit = async (data) => {
    setIsSubmitting(true);
    await addCar(data);
    setIsSubmitting(false);
    setIsFormOpen(false);
    addToast("Car added successfully", "success");
  };

  const handleEditSubmit = async (data) => {
    setIsSubmitting(true);
    await updateCar(selectedCar.id, data);
    setIsSubmitting(false);
    setIsFormOpen(false);
    addToast("Car updated successfully", "success");
  };

  const handleDeleteConfirm = async () => {
    setIsSubmitting(true);
    await deleteCar(selectedCar.id);
    setIsSubmitting(false);
    setIsDeleteOpen(false);
    setSelectedCar(null);
    addToast("Car deleted successfully", "success");
  };

  const handleMarkAsSold = async (car) => {
    await markAsSold(car.id);
    addToast(`Marked ${car.brand} ${car.name} as Sold`, "success");
  };

  const openAddModal = () => {
    setSelectedCar(null);
    setIsFormOpen(true);
  };

  const openEditModal = (car) => {
    setSelectedCar(car);
    setIsFormOpen(true);
  };

  const openDeleteModal = (car) => {
    setSelectedCar(car);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Cars Inventory</h1>
        {isAdmin && (
          <Button onClick={openAddModal}>
            <Plus className="h-4 w-4 mr-2" /> Add Car
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between pb-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search cars by name or brand..." 
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
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
            </select>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50/80 text-gray-500 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Brand & Name</th>
                  <th className="px-6 py-4">Model Year</th>
                  <th className="px-6 py-4">Selling Price</th>
                  {isAdmin && <th className="px-6 py-4">Official Price</th>}
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right transform mr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><Skeleton className="h-5 w-32" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-5 w-16" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-5 w-24" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2"><Skeleton className="h-8 w-16" /></td>
                    </tr>
                  ))
                ) : paginatedCars.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <Search className="h-10 w-10 text-gray-300 mb-2" />
                        <p>No cars found matching your criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedCars.map((car) => (
                    <tr key={car.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {car.brand} {car.name}
                      </td>
                      <td className="px-6 py-4 text-gray-500">{car.modelYear}</td>
                      <td className="px-6 py-4 font-bold text-indigo-600">${car.sellingPrice?.toLocaleString()}</td>
                      {isAdmin && <td className="px-6 py-4 text-gray-400 italic">${car.officialPrice?.toLocaleString()}</td>}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          car.status === 'Available' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {car.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => navigate(`/cars/${car.id}`)} 
                          className="h-8 w-8 p-0 text-gray-400 hover:text-indigo-600" 
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {car.status === 'Available' && isAdmin && (
                          <Button variant="ghost" size="sm" onClick={() => handleMarkAsSold(car)} className="h-8 w-8 p-0 text-green-600 hover:bg-green-50" title="Mark as Sold">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {isAdmin && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => openEditModal(car)} className="h-8 w-8 p-0 text-indigo-600 hover:bg-indigo-50" title="Edit">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openDeleteModal(car)} className="h-8 w-8 p-0 text-red-600 hover:bg-red-50" title="Delete">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-gray-500">
              Showing <span className="font-medium">{filteredCars.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredCars.length)}</span> of <span className="font-medium">{filteredCars.length}</span> results
            </span>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1 || loading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium text-gray-600 min-w-[5rem] text-center">Page {currentPage} of {totalPages}</div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || loading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <CarFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={selectedCar ? handleEditSubmit : handleAddSubmit} 
        initialData={selectedCar} 
        isSubmitting={isSubmitting} 
      />
      <DeleteConfirmModal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        onConfirm={handleDeleteConfirm} 
        isDeleting={isSubmitting} 
        itemName={selectedCar ? `${selectedCar.brand} ${selectedCar.name}` : ""} 
      />
    </div>
  );
}
