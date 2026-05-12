import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUsers } from "../context/UsersContext";
import { useDebounce } from "../../shared/hooks/useDebounce";
import { useToast } from "../../shared/context/ToastContext";
import { useAuth } from "../../shared/context/AuthContext";
import { Card, CardContent, CardHeader } from "../../shared/components/ui/Card";
import { Input } from "../../shared/components/ui/Input";
import { Button } from "../../shared/components/ui/Button";
import { Skeleton } from "../../shared/components/ui/Skeleton";
import { Search, ChevronLeft, ChevronRight, Eye, Edit2, Trash2, Plus, Users as UsersIcon, User } from "lucide-react";
import { UserFormModal } from "../components/users/UserFormModal";
import { DeleteConfirmModal } from "../../shared/components/ui/DeleteConfirmModal";
import { Select } from "../../shared/components/ui/Select";

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
          <div className="p-2.5 bg-brand-primary rounded-xl text-white shadow-lg shadow-brand-primary/10">
            <UsersIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-950 dark:text-zinc-100 tracking-tightest leading-tight">User Management</h1>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{uniqueUsers.length} total accounts</p>
          </div>
        </div>
        {isAdmin && (
          <Button onClick={openAddModal} className="rounded-xl shadow-lg shadow-indigo-200">
            <Plus className="h-4 w-4 mr-2" /> Add User
          </Button>
        )}
      </div>
      <Card className="border border-zinc-100 dark:border-zinc-900 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row gap-4 justify-between pb-4 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <Input placeholder="Search users..." className="pl-10 h-10 w-full rounded-xl border-zinc-200 dark:border-zinc-800" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Select 
              className="w-44"
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
              value={statusFilter}
              onChange={handleFilterChange}
              placeholder="Filter Status"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-200">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-white dark:bg-zinc-950 text-zinc-500 dark:text-zinc-500 font-semibold uppercase tracking-wider text-xs border-b border-zinc-100 dark:border-zinc-900">
                <tr>
                  <th className="px-6 py-4">User Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900/50">
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
                  <tr><td colSpan="5" className="px-6 py-12 text-center text-zinc-500"><div className="flex flex-col items-center"><Search className="h-10 w-10 text-zinc-300 mb-2" /><p>No users found matching your criteria</p></div></td></tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr key={user.id || user.firestoreId} className="hover:bg-brand-primary/[0.02] dark:hover:bg-brand-primary/[0.02] transition-all duration-200 group">
                      <td className="px-6 py-4 font-bold text-zinc-950 dark:text-zinc-100 flex items-center gap-3">
                        <div className="relative">
                          {user.image ? (
                            <img src={user.image} alt={user.name || user.firstName} className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-900 object-cover ring-2 ring-white dark:ring-zinc-950 shadow-sm" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center ring-2 ring-white dark:ring-zinc-950 shadow-sm"><User className="h-5 w-5 text-zinc-400 dark:text-zinc-600" /></div>
                          )}
                          <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-zinc-950 ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-600'}`} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm tracking-tightest leading-tight">{user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-500 dark:text-zinc-500 font-medium">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${
                          user.role === 'admin' ? 'bg-brand-primary/10 text-brand-primary' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400'
                        }`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${
                          user.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>{user.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 group-hover:opacity-100 transition-opacity duration-200">
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/users/${user.firestoreId || user.id}`)} className="h-8 w-8 p-0" title="View details"><Eye className="h-4 w-4" /></Button>
                          {isAdmin && (<>
                            <Button variant="ghost" size="sm" onClick={() => openEditModal(user)} className="h-8 w-8 p-0 text-brand-primary hover:bg-brand-primary/10" title="Edit"><Edit2 className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => openDeleteModal(user)} className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" title="Delete"><Trash2 className="h-4 w-4" /></Button>
                          </>)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-50/30 dark:bg-zinc-900/30">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider"> {filteredUsers.length} accounts found</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1 || loading} className="h-8 w-8 p-0 min-w-0"><ChevronLeft className="h-4 w-4" /></Button>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 min-w-[5rem] text-center bg-white dark:bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">Page {currentPage} of {totalPages}</div>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || loading} className="h-8 w-8 p-0 min-w-0"><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <UserFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={selectedUser ? handleEditSubmit : handleAddSubmit} initialData={selectedUser} isSubmitting={isSubmitting} />
      <DeleteConfirmModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDeleteConfirm} isDeleting={isSubmitting} itemName={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : ""} />
    </div>
  );
}
