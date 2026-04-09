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
  const { requests, updateRequestStatus } = useRequests();
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <span className="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1"><BadgeCheck className="h-3 w-3" /> Approved</span>;
      case 'rejected': return <span className="bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1"><XCircle className="h-3 w-3" /> Rejected</span>;
      default: return <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Purchase Requests</h1>
        <div className="bg-white px-4 py-2 border rounded-lg shadow-sm flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-indigo-600" />
          <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">Admin Control</span>
        </div>
      </div>
      <Card className="border-none shadow-md overflow-hidden bg-white">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between pb-4 pt-6 px-6">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input placeholder="Search by user or vehicle..." className="pl-10 h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select className="h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50/80 text-gray-400 font-bold uppercase tracking-wider text-[11px] border-b border-gray-100">
                <tr><th className="px-6 py-4">Customer Details</th><th className="px-6 py-4">Vehicle Requested</th><th className="px-6 py-4">Request Date</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRequests.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-16 text-center text-gray-400"><div className="flex flex-col items-center"><Clock className="h-12 w-12 text-gray-100 mb-2" /><p className="text-gray-500 font-medium tracking-tight">No requests found matching your filters.</p></div></td></tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr key={req.id || req.firestoreId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4"><div className="flex flex-col"><span className="font-bold text-gray-900 mb-0.5">{req.userName}</span><span className="text-xs text-gray-400 flex items-center gap-1"><Mail className="h-3 w-3" /> {req.userEmail}</span></div></td>
                      <td className="px-6 py-4"><div className="flex flex-col"><span className="font-medium text-indigo-600 hover:underline cursor-pointer flex items-center gap-1.5" onClick={() => navigate(`/admin/cars/${req.carId}`)}><Car className="h-3.5 w-3.5" /> {req.carName}</span><span className="text-[11px] text-gray-400 font-medium uppercase tracking-tighter">{req.carBrand}</span></div></td>
                      <td className="px-6 py-4 text-gray-500"><div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-gray-300" />{new Date(req.timestamp).toLocaleDateString()}</div></td>
                      <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                      <td className="px-6 py-4 text-right">
                        {req.status === 'pending' ? (
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50 h-8 font-bold" onClick={() => handleStatusChange(req.firestoreId || req.id, 'approved', req.carId)}>Approve</Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 h-8 font-bold" onClick={() => handleStatusChange(req.firestoreId || req.id, 'rejected', req.carId)}>Reject</Button>
                          </div>
                        ) : (<span className="text-xs text-gray-300 font-medium uppercase tracking-tighter italic mr-4">Processed</span>)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
