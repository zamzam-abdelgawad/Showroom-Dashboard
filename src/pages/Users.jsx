import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUsers } from "../context/UsersContext";
import { useDebounce } from "../hooks/useDebounce";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { Search, Filter, ChevronLeft, ChevronRight, Eye, Edit2, Trash2, Plus } from "lucide-react";
import { UserFormModal } from "../components/users/UserFormModal";
import { DeleteConfirmModal } from "../components/ui/DeleteConfirmModal";

export default function Users() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { users, loading, addUser, updateUser, deleteUser } = useUsers();
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
  const [selectedUser, setSelectedUser] = useState(null);
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

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchName = user.firstName.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
                        user.lastName.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchStatus = statusFilter === 'all' || user.status.toLowerCase() === statusFilter;
      return matchName && matchStatus;
    });
  }, [users, debouncedSearch, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter]);

  const handleAddSubmit = async (data) => {
    setIsSubmitting(true);
    await addUser(data);
    setIsSubmitting(false);
    setIsFormOpen(false);
    addToast("User created successfully", "success");
  };

  const handleEditSubmit = async (data) => {
    setIsSubmitting(true);
    await updateUser(selectedUser.id, data);
    setIsSubmitting(false);
    setIsFormOpen(false);
    addToast("User updated successfully", "success");
  };

  const handleDeleteConfirm = async () => {
    setIsSubmitting(true);
    await deleteUser(selectedUser.id);
    setIsSubmitting(false);
    setIsDeleteOpen(false);
    setSelectedUser(null);
    addToast("User deleted successfully", "success");
  };

  const openAddModal = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        {isAdmin && (
          <Button onClick={openAddModal}>
            <Plus className="h-4 w-4 mr-2" /> Add User
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between pb-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search users..." 
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/80 text-gray-500 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right transform mr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 flex flex-row items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-5 w-32" />
                      </td>
                      <td className="px-6 py-4"><Skeleton className="h-5 w-48" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2"><Skeleton className="h-8 w-16" /></td>
                    </tr>
                  ))
                ) : paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <Search className="h-10 w-10 text-gray-300 mb-2" />
                        <p>No users found matching your criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                        <img src={user.image} alt={user.firstName} className="h-8 w-8 rounded-full bg-gray-100 object-cover" />
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-6 py-4 text-gray-500">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/users/${user.id}`)} className="h-8 w-8 p-0" title="View details">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {isAdmin ? (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => openEditModal(user)} className="h-8 w-8 p-0 text-indigo-600 hover:bg-indigo-50" title="Edit">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openDeleteModal(user)} className="h-8 w-8 p-0 text-red-600 hover:bg-red-50" title="Delete">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 italic">View Only</span>
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
              Showing <span className="font-medium">{filteredUsers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of <span className="font-medium">{filteredUsers.length}</span> results
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

      <UserFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={selectedUser ? handleEditSubmit : handleAddSubmit} 
        initialData={selectedUser} 
        isSubmitting={isSubmitting} 
      />
      <DeleteConfirmModal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        onConfirm={handleDeleteConfirm} 
        isDeleting={isSubmitting} 
        itemName={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : ""} 
      />
    </div>
  );
}
