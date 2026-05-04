import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUsers } from "../context/UsersContext";
import { useDebounce } from "../../shared/hooks/useDebounce";
import { useToast } from "../../shared/context/ToastContext";
import { useAuth } from "../../shared/context/AuthContext";
import { Card, CardContent, CardHeader } from "../../shared/components/ui/Card";
import { Input } from "../../shared/components/ui/Input";
import { Button } from "../../shared/components/ui/Button";
import { Skeleton } from "../../shared/components/ui/Skeleton";
import { Search, Filter, ChevronLeft, ChevronRight, Eye, Edit2, Trash2, Plus, Users as UsersIcon, User } from "lucide-react";
import { UserFormModal } from "../components/users/UserFormModal";
import { DeleteConfirmModal } from "../../shared/components/ui/DeleteConfirmModal";

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
    if (urlStatus && urlStatus !== statusFilter) setStatusFilter(urlStatus);
  }, [searchParams, statusFilter]);

  const handleFilterChange = (val) => {
    setStatusFilter(val);
    if (val === 'all') { searchParams.delete('status'); } else { searchParams.set('status', val); }
    setSearchParams(searchParams);
  };

  // Deduplicate users by email — prioritize actively synced/authentic documents
  const uniqueUsers = useMemo(() => {
    const sortedUsers = [...users].sort((a, b) => {
      const timeA = a.lastSynced?.toDate ? a.lastSynced.toDate().getTime() : 0;
      const timeB = b.lastSynced?.toDate ? b.lastSynced.toDate().getTime() : 0;
      return timeB - timeA;
    });

    const seen = new Set();
    return sortedUsers.filter(user => {
      if (!user.email) return true;
      const key = user.email.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [users]);

  const filteredUsers = useMemo(() => {
    return uniqueUsers.filter(user => {
      const firstName = user.firstName || user.name || "";
      const lastName = user.lastName || "";
      const status = user.status || "Active";
      const matchName = firstName.toLowerCase().includes(debouncedSearch.toLowerCase()) || lastName.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchStatus = statusFilter === 'all' || status.toLowerCase() === statusFilter;
      return matchName && matchStatus;
    });
  }, [uniqueUsers, debouncedSearch, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  useEffect(() => { setCurrentPage(1); }, [debouncedSearch, statusFilter]);

  const handleAddSubmit = async (data) => { setIsSubmitting(true); await addUser(data); setIsSubmitting(false); setIsFormOpen(false); addToast("User created successfully", "success"); };
  const handleEditSubmit = async (data) => { setIsSubmitting(true); await updateUser(selectedUser.firestoreId || selectedUser.id, data); setIsSubmitting(false); setIsFormOpen(false); addToast("User updated successfully", "success"); };
  const handleDeleteConfirm = async () => { setIsSubmitting(true); await deleteUser(selectedUser.firestoreId || selectedUser.id); setIsSubmitting(false); setIsDeleteOpen(false); setSelectedUser(null); addToast("User deleted successfully", "success"); };
  const openAddModal = () => { setSelectedUser(null); setIsFormOpen(true); };
  const openEditModal = (user) => { setSelectedUser(user); setIsFormOpen(true); };
  const openDeleteModal = (user) => { setSelectedUser(user); setIsDeleteOpen(true); };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg shadow-indigo-200">
            <UsersIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm text-gray-500">{uniqueUsers.length} total users</p>
          </div>
        </div>
        {isAdmin && (
          <Button onClick={openAddModal} className="rounded-xl shadow-lg shadow-indigo-200">
            <Plus className="h-4 w-4 mr-2" /> Add User
          </Button>
        )}
      </div>
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between pb-4 bg-gray-50/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="Search users..." className="pl-10 h-10 w-full rounded-xl border-gray-200" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select className="h-10 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow" value={statusFilter} onChange={(e) => handleFilterChange(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50/80 text-gray-400 font-bold uppercase tracking-wider text-[11px] border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 flex flex-row items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-5 w-32" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-5 w-48" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2"><Skeleton className="h-8 w-16" /></td>
                    </tr>
                  ))
                ) : paginatedUsers.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500"><div className="flex flex-col items-center"><Search className="h-10 w-10 text-gray-300 mb-2" /><p>No users found matching your criteria</p></div></td></tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr key={user.id || user.firestoreId} className="hover:bg-indigo-50/30 transition-all duration-200 group">
                      <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                        <div className="relative">
                          {user.image ? (
                            <img src={user.image} alt={user.name || user.firstName} className="h-10 w-10 rounded-full bg-gray-100 object-cover ring-2 ring-white shadow-sm" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center ring-2 ring-white shadow-sm"><User className="h-5 w-5 text-indigo-500" /></div>
                          )}
                          <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold">{user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>{user.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 group-hover:opacity-100 transition-opacity duration-200">
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/users/${user.firestoreId || user.id}`)} className="h-8 w-8 p-0 rounded-lg" title="View details"><Eye className="h-4 w-4" /></Button>
                          {isAdmin && (<>
                            <Button variant="ghost" size="sm" onClick={() => openEditModal(user)} className="h-8 w-8 p-0 text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Edit"><Edit2 className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => openDeleteModal(user)} className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 className="h-4 w-4" /></Button>
                          </>)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
            <span className="text-sm text-gray-500">Showing <span className="font-medium">{filteredUsers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of <span className="font-medium">{filteredUsers.length}</span> results</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1 || loading} className="rounded-lg"><ChevronLeft className="h-4 w-4" /></Button>
              <div className="text-sm font-medium text-gray-600 min-w-[5rem] text-center bg-white px-3 py-1.5 rounded-lg border border-gray-100">Page {currentPage} of {totalPages}</div>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || loading} className="rounded-lg"><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <UserFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={selectedUser ? handleEditSubmit : handleAddSubmit} initialData={selectedUser} isSubmitting={isSubmitting} />
      <DeleteConfirmModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDeleteConfirm} isDeleting={isSubmitting} itemName={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : ""} />
    </div>
  );
}
