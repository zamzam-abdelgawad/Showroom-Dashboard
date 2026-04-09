import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUsers } from "../context/UsersContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/components/ui/Card";
import { Button } from "../../shared/components/ui/Button";
import { Skeleton } from "../../shared/components/ui/Skeleton";
import { useToast } from "../../shared/context/ToastContext";
import { ArrowLeft, Mail, Phone, MapPin, Briefcase } from "lucide-react";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { users, loading: contextLoading } = useUsers();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contextLoading) {
      const contextUser = users.find(u => String(u.id) === id || u.firestoreId === id);
      if (contextUser) {
        setUser(contextUser);
      } else {
        addToast("User not found", "error");
        navigate("/admin/users");
      }
      setLoading(false);
    }
  }, [id, users, contextLoading, addToast, navigate]);

  if (loading || contextLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 border-gray-100 flex flex-col items-center text-center pt-8"><Skeleton className="h-32 w-32 rounded-full mb-6" /><Skeleton className="h-6 w-3/4 mb-2" /><Skeleton className="h-4 w-1/2 mb-8" /></Card>
          <Card className="col-span-1 md:col-span-2"><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /></CardContent></Card>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in">
      <Button variant="ghost" className="mb-4 text-gray-500 hover:text-gray-900" onClick={() => navigate("/admin/users")}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Users
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 border-gray-100 flex flex-col items-center text-center pt-8 pb-4">
          <img src={user.image} alt={user.firstName} className="h-32 w-32 rounded-full border-4 border-indigo-50 bg-gray-100 object-cover" />
          <CardContent className="mt-4 w-full">
            <h2 className="text-2xl font-bold text-gray-900">{user.firstName} {user.lastName}</h2>
            <p className="text-gray-500 mt-1">{"@"}{user.username}</p>
            <div className="mt-4 pt-4 border-t border-gray-100 w-full">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{user.status}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1 md:col-span-2 border-gray-100 h-fit">
          <CardHeader className="border-b border-gray-100 pb-4"><CardTitle>Profile Details</CardTitle></CardHeader>
          <CardContent className="p-6">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
              <div className="space-y-1"><dt className="text-sm font-medium text-gray-500 flex items-center gap-2"><Mail className="h-4 w-4" /> Email Address</dt><dd className="text-base text-gray-900">{user.email}</dd></div>
              <div className="space-y-1"><dt className="text-sm font-medium text-gray-500 flex items-center gap-2"><Phone className="h-4 w-4" /> Phone Number</dt><dd className="text-base text-gray-900">{user.phone || "N/A"}</dd></div>
              <div className="space-y-1"><dt className="text-sm font-medium text-gray-500 flex items-center gap-2"><Briefcase className="h-4 w-4" /> Job Title</dt><dd className="text-base text-gray-900 capitalize">{user.company?.title || "N/A"}</dd></div>
              <div className="space-y-1"><dt className="text-sm font-medium text-gray-500 flex items-center gap-2"><MapPin className="h-4 w-4" /> Address</dt><dd className="text-base text-gray-900">{user.address ? (<>{user.address.address}, <br />{user.address.city}, {user.address.state} {user.address.postalCode}</>) : "N/A"}</dd></div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
