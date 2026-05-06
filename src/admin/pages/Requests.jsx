import { useRequests } from "../context/RequestsContext";
import { useUsers } from "../context/UsersContext";
import { useCars } from "../context/CarsContext";
import { useToast } from "../../shared/context/ToastContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/components/ui/Card";
import { Button } from "../../shared/components/ui/Button";
import { BadgeCheck, XCircle, Clock, Search, Filter, ShieldCheck, Mail, Car, Calendar, ArrowRight } from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function Requests() {
  const { requests, loading, updateRequestStatus } = useRequests();
  const { users } = useUsers();
  const { cars, markAsSold } = useCars();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const enrichedRequests = useMemo(() => {
    return requests.map(req => {
      const user = users.find(u => u.id === req.userId || u.firestoreId === req.userId);
      const car = cars.find(c => c.id === req.carId);
      return { ...req, userName: user ? `${user.firstName || user.name || ''} ${user.lastName || ''}`.trim() : "Unknown User", userEmail: user?.email || "N/A", carName: car?.name || "Unknown Vehicle", carBrand: car?.brand || "N/A" };
    });
  }, [requests, users, cars]);

  const filteredRequests = useMemo(() => {
    return enrichedRequests.filter(req => {
      const matchesSearch = req.userName.toLowerCase().includes(searchTerm.toLowerCase()) || req.carName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [enrichedRequests, searchTerm, statusFilter]);

  const handleStatusChange = async (id, newStatus, carId) => {
    try {
      await updateRequestStatus(id, newStatus);
      if (newStatus === 'approved' && carId) { await markAsSold(carId); }
      addToast(`Request ${newStatus} successfully`, "success");
    } catch (err) { addToast("Failed to update status", "error"); }
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><BadgeCheck className="h-3 w-3" /> Accepted</span>;
      case 'rejected': return <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><XCircle className="h-3 w-3" /> Rejected</span>;
      default: return <span className="bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-primary rounded-xl text-white shadow-lg shadow-brand-primary/10">
            <Car className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">Purchase Requests</h1>
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              {requests.length} total orders · <span className="text-brand-primary font-black">{pendingCount} pending review</span>
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-950 px-3 py-1.5 border border-zinc-100 dark:border-zinc-900 rounded-xl shadow-sm flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-brand-primary" />
          <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.1em]">Admin Control</span>
        </div>
      </div>
      <Card className="border border-zinc-100 dark:border-zinc-900 shadow-sm overflow-hidden bg-white dark:bg-zinc-950">
        <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row gap-4 justify-between pb-4 pt-6 px-6">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <input placeholder="Filter by user or vehicle..." className="pl-10 h-10 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary dark:text-zinc-100" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-zinc-500" />
              <select className="h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary dark:text-zinc-100" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Interactions</option>
                <option value="pending">Pending</option>
                <option value="approved">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-200 text-zinc-900 dark:text-zinc-100">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-white dark:bg-zinc-950 text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-wider text-[10px] border-b border-zinc-100 dark:border-zinc-900">
                  <tr><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Vehicle Assets</th><th className="px-6 py-4">Applied Date</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Operations</th></tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900/50">
                  {filteredRequests.length === 0 ? (
                    <tr><td colSpan="5" className="px-6 py-16 text-center text-zinc-400"><div className="flex flex-col items-center"><Clock className="h-10 w-10 text-zinc-100 dark:text-zinc-800 mb-2" /><p className="text-zinc-500 dark:text-zinc-600 font-bold uppercase tracking-widest text-[10px]">No interactions recorded.</p></div></td></tr>
                  ) : (
                    filteredRequests.map((req) => (
                      <tr key={req.id || req.firestoreId} className="hover:bg-brand-primary/[0.02] dark:hover:bg-brand-primary/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-black text-xs uppercase tracking-tight text-gray-900 dark:text-zinc-100 mb-0.5 group-hover:text-brand-primary transition-colors">
                              {req.userName}
                              {req.status === 'pending' && <span className="ml-2 bg-brand-primary/10 text-brand-primary text-[8px] px-1.5 py-0.5 rounded-md">NEW</span>}
                            </span>
                            <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 flex items-center gap-1"><Mail className="h-3 w-3" /> {req.userEmail}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4"><div className="flex flex-col"><span className="font-bold text-zinc-600 dark:text-zinc-400 hover:text-brand-primary cursor-pointer flex items-center gap-1.5 transition-colors" onClick={() => navigate(`/admin/cars/${req.carId}`)}><Car className="h-3.5 w-3.5" /> {req.carName}</span><span className="text-[10px] text-zinc-400 dark:text-zinc-600 font-black uppercase tracking-widest">{req.carBrand}</span></div></td>
                        <td className="px-6 py-4 text-zinc-500 dark:text-zinc-500 font-medium italic"><div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-700" />{new Date(req.timestamp).toLocaleDateString()}</div></td>
                        <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                        <td className="px-6 py-4 text-right">
                          {req.status === 'pending' ? (
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" className="text-emerald-600 dark:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 h-8 font-black uppercase tracking-widest text-[9px]" onClick={() => handleStatusChange(req.firestoreId || req.id, 'approved', req.carId)}>Accept</Button>
                              <Button variant="ghost" size="sm" className="text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 h-8 font-black uppercase tracking-widest text-[9px]" onClick={() => handleStatusChange(req.firestoreId || req.id, 'rejected', req.carId)}>Reject</Button>
                            </div>
                          ) : (<span className="text-[10px] text-zinc-300 dark:text-zinc-700 font-black uppercase tracking-widest italic mr-4">Resolved</span>)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
