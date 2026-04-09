import { useAuth } from "../../shared/context/AuthContext";
import { useCustomerRequests } from "../context/CustomerRequestsContext";
import { useCustomerCars } from "../context/CustomerCarsContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/components/ui/Card";
import { Skeleton } from "../../shared/components/ui/Skeleton";
import { User, Mail, Shield, Calendar, Clock, Car, BadgeCheck, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useAuth();
  const { requests, loading: reqLoading } = useCustomerRequests();
  const { cars } = useCustomerCars();
  const navigate = useNavigate();

  if (!user) return null;

  const enrichedRequests = requests.map(req => {
    const car = cars.find(c => c.id === req.carId);
    return { ...req, carName: car?.name || "Unknown Vehicle", carBrand: car?.brand || "N/A" };
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <span className="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"><BadgeCheck className="h-3 w-3" /> Approved</span>;
      case 'rejected': return <span className="bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> Rejected</span>;
      default: return <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-none shadow-md overflow-hidden bg-white">
          <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <CardContent className="pt-0 -mt-12 flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
              <User className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">{user.name || user.email}</h2>
            <p className="text-gray-500 capitalize">{user.role}</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 border-none shadow-md bg-white">
          <CardHeader className="pb-2"><CardTitle className="text-lg">Account Details</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2"><User className="h-3 w-3" /> Name</label>
                <p className="text-gray-900 font-medium">{user.name || "Not set"}</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2"><Mail className="h-3 w-3" /> Email</label>
                <p className="text-gray-900 font-medium">{user.email}</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2"><Shield className="h-3 w-3" /> Role</label>
                <p className="text-gray-900 font-medium capitalize">{user.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Requests */}
      <Card className="border-none shadow-md bg-white">
        <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Car className="h-5 w-5 text-indigo-600" /> My Buy Requests
          </CardTitle>
          <span className="text-xs text-gray-400 font-medium">{requests.length} total</span>
        </CardHeader>
        <CardContent className="p-0">
          {reqLoading ? (
            <div className="p-6 space-y-4">
              {[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : enrichedRequests.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Car className="h-12 w-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No buy requests yet</p>
              <p className="text-gray-400 text-sm mt-1">Browse our <button onClick={() => navigate('/')} className="text-indigo-600 hover:underline font-medium">catalog</button> to find your dream car.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-50/80 text-gray-400 font-bold uppercase tracking-wider text-[11px] border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Vehicle</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {enrichedRequests.map(req => (
                    <tr key={req.firestoreId} className="hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => navigate(`/cars/${req.carId}`)}>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{req.carName}</span>
                          <span className="text-[11px] text-gray-400 uppercase tracking-tighter">{req.carBrand}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-gray-300" />
                        {new Date(req.timestamp).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
