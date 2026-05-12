import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCars } from "../context/CarsContext";
import { useDebounce } from "../../shared/hooks/useDebounce";
import { useToast } from "../../shared/context/ToastContext";
import { useAuth } from "../../shared/context/AuthContext";
import { Card, CardContent, CardHeader } from "../../shared/components/ui/Card";
import { Input } from "../../shared/components/ui/Input";
import { Button } from "../../shared/components/ui/Button";
import { Skeleton } from "../../shared/components/ui/Skeleton";
import { Search, Filter, Edit2, Trash2, Plus, CheckCircle, ChevronLeft, ChevronRight, Eye, ChevronDown } from "lucide-react";
import { CarFormModal } from "../components/cars/CarFormModal";
import { DeleteConfirmModal } from "../../shared/components/ui/DeleteConfirmModal";

export default function Cars() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { cars, loading, addCar, updateCar, deleteCar, markAsSold, buyCar } = useCars();
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

  useEffect(() => {
    const urlStatus = searchParams.get('status');
    if (urlStatus && urlStatus !== statusFilter) setStatusFilter(urlStatus);
  }, [searchParams, statusFilter]);

  const handleFilterChange = (val) => {
    setStatusFilter(val);
    if (val === 'all') { searchParams.delete('status'); } else { searchParams.set('status', val); }
    setSearchParams(searchParams);
  };

  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const matchName = car.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || car.brand.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchStatus = statusFilter === 'all' || car.status.toLowerCase() === statusFilter;
      return matchName && matchStatus;
    });
  }, [cars, debouncedSearch, statusFilter]);

  const totalPages = Math.ceil(filteredCars.length / itemsPerPage) || 1;
  const paginatedCars = filteredCars.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [debouncedSearch, statusFilter]);

  const handleAddSubmit = async (data) => { setIsSubmitting(true); await addCar(data); setIsSubmitting(false); setIsFormOpen(false); addToast("Car added successfully", "success"); };
  const handleEditSubmit = async (data) => { setIsSubmitting(true); await updateCar(selectedCar.id, data); setIsSubmitting(false); setIsFormOpen(false); addToast("Car updated successfully", "success"); };
  const handleDeleteConfirm = async () => { setIsSubmitting(true); await deleteCar(selectedCar.id); setIsSubmitting(false); setIsDeleteOpen(false); setSelectedCar(null); addToast("Car deleted successfully", "success"); };
  const handleMarkAsSold = async (car) => {
    const currentCount = car.count ?? 1;
    const newCount = currentCount - 1;
    if (newCount === 0) {
      await buyCar(car.id);
      addToast(`${car.brand} ${car.name} is now Sold Out`, "success");
    } else {
      await buyCar(car.id);
      addToast(`${car.brand} ${car.name} — stock decreased to ${newCount}`, "success");
    }
  };
  const openAddModal = () => { setSelectedCar(null); setIsFormOpen(true); };
  const openEditModal = (car) => { setSelectedCar(car); setIsFormOpen(true); };
  const openDeleteModal = (car) => { setSelectedCar(car); setIsDeleteOpen(true); };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Cars Inventory</h1>
        {isAdmin && (<Button onClick={openAddModal}><Plus className="h-4 w-4 mr-2" /> Add Car</Button>)}
      </div>
      <Card>
        <CardHeader className="border-b border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between pb-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="Search cars by name or brand..." className="pl-10 h-10 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-shrink-0" ref={filterRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center justify-center gap-3 bg-white dark:bg-zinc-950 px-4 h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 w-40 text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100 hover:border-brand-primary transition-all duration-300 shadow-sm"
              >
                <Filter className="h-3.5 w-3.5 text-brand-primary flex-shrink-0" />
                <span className="flex-1 text-left">
                  {statusFilter === 'all' ? 'All Status' : statusFilter === 'available' ? 'Available' : 'Sold'}
                </span>
                <ChevronDown className={`h-3 w-3 text-zinc-400 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {isFilterOpen && (
                <div className="absolute top-full mt-2 right-0 w-40 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
                  {[
                    { value: 'all', label: 'All Status' },
                    { value: 'available', label: 'Available' },
                    { value: 'sold', label: 'Sold' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { handleFilterChange(opt.value); setIsFilterOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-200 text-left
                        ${statusFilter === opt.value
                          ? 'bg-brand-primary/10 text-brand-primary'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
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
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-200">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 font-bold border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-4 uppercase tracking-wider text-[10px]">Brand & Name</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-[10px]">Model Year</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-[10px]">Selling Price</th>
                  {isAdmin && <th className="px-6 py-4 uppercase tracking-wider text-[10px]">Official Price</th>}
                  <th className="px-6 py-4 uppercase tracking-wider text-[10px]">Status</th>
                  <th className="px-6 py-4 uppercase tracking-wider text-[10px]">Stock</th>
                  <th className="px-6 py-4 text-right uppercase tracking-wider text-[10px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
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
                  <tr><td colSpan="7" className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400"><div className="flex flex-col items-center"><Search className="h-10 w-10 text-zinc-300 dark:text-zinc-700 mb-2" /><p>No cars found matching your criteria</p></div></td></tr>
                ) : (
                  paginatedCars.map((car) => (
                    <tr key={car.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-zinc-100">
                        <button
                          onClick={() => navigate(`/admin/cars/${car.id}`)}
                          className="hover:text-brand-primary transition-colors cursor-pointer text-left"
                        >
                          {car.brand} {car.name}
                        </button>
                      </td>                      
                      <td className="px-6 py-4 text-zinc-500 dark:text-zinc-500">{car.modelYear}</td>
                      <td className="px-6 py-4 font-black text-brand-primary">${car.sellingPrice?.toLocaleString()}</td>
                      {isAdmin && <td className="px-6 py-4 text-zinc-400 dark:text-zinc-600 italic font-medium">${car.officialPrice?.toLocaleString()}</td>}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${car.status === 'Available' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400'}`}>{car.status}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-md text-[10px] font-black ${
                          (car.count ?? 0) > 0
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : 'bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400'
                        }`}>{car.count ?? 0}</span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/cars/${car.id}`)} className="h-8 w-8 p-0 text-zinc-400 hover:text-brand-primary" title="View Details"><Eye className="h-4 w-4" /></Button>
                        {car.status === 'Available' && (car.count ?? 0) > 0 && isAdmin && (<Button variant="ghost" size="sm" onClick={() => handleMarkAsSold(car)} className="h-8 w-8 p-0 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30" title={`Buy 1 (${(car.count ?? 0)} left)`}><CheckCircle className="h-4 w-4" /></Button>)}
                        {isAdmin && (<>
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(car)} className="h-8 w-8 p-0 text-brand-primary hover:bg-brand-primary/10" title="Edit"><Edit2 className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => openDeleteModal(car)} className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" title="Delete"><Trash2 className="h-4 w-4" /></Button>
                        </>)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-500 italic">Showing {filteredCars.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCars.length)} of {filteredCars.length} results</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1 || loading} className="h-8 w-8 p-0 min-w-0"><ChevronLeft className="h-4 w-4" /></Button>
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 min-w-[5rem] text-center">Page {currentPage} of {totalPages}</div>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || loading} className="h-8 w-8 p-0 min-w-0"><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <CarFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={selectedCar ? handleEditSubmit : handleAddSubmit} initialData={selectedCar} isSubmitting={isSubmitting} />
      <DeleteConfirmModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDeleteConfirm} isDeleting={isSubmitting} itemName={selectedCar ? `${selectedCar.brand} ${selectedCar.name}` : ""} />
    </div>
  );
}
