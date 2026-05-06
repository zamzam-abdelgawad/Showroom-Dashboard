import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUsers } from "../context/UsersContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/components/ui/Card";
import { Button } from "../../shared/components/ui/Button";
import { Skeleton } from "../../shared/components/ui/Skeleton";
import { useToast } from "../../shared/context/ToastContext";
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, User } from "lucide-react";

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
        <Skeleton className="h-10 w-32 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 border-zinc-100 dark:border-zinc-900 dark:bg-zinc-950 flex flex-col items-center text-center pt-8 rounded-2xl"><Skeleton className="h-32 w-32 rounded-full mb-6" /><Skeleton className="h-6 w-3/4 mb-2" /><Skeleton className="h-4 w-1/2 mb-8" /></Card>
          <Card className="col-span-1 md:col-span-2 border-zinc-100 dark:border-zinc-900 dark:bg-zinc-950 rounded-2xl"><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /></CardContent></Card>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in">
      <Button variant="ghost" className="mb-4 text-zinc-400 dark:text-zinc-600 hover:text-brand-primary dark:hover:text-brand-primary font-black text-[10px] uppercase tracking-widest transition-all group" onClick={() => navigate("/admin/users")}>
        <ArrowLeft className="h-3.5 w-3.5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Users
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 border border-zinc-100 dark:border-zinc-900 dark:bg-zinc-950 flex flex-col items-center text-center pt-10 pb-4 rounded-2xl shadow-sm">
          {user.image ? (
            <div className="p-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-full shadow-inner">
              <img src={user.image} alt={user.name || user.firstName} className="h-32 w-32 rounded-full object-cover shadow-sm grayscale-[0.5] hover:grayscale-0 transition-all duration-500" />
            </div>
          ) : (
            <div className="h-32 w-32 rounded-full border border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center shadow-inner">
              <User className="h-12 w-12 text-zinc-300 dark:text-zinc-700" />
            </div>
          )}
          <CardContent className="mt-6 w-full px-6">
            <h2 className="text-xl font-black text-gray-900 dark:text-zinc-100 leading-tight tracking-tight uppercase">{user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User'}</h2>
            {user.username && <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 mt-1 uppercase tracking-widest">{"@"}{user.username}</p>}
            <div className="mt-8 pt-6 border-t border-zinc-50 dark:border-zinc-900 w-full flex justify-center">
              <span className={`inline-flex items-center px-4 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>{user.status}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1 md:col-span-2 border border-zinc-100 dark:border-zinc-900 dark:bg-zinc-950 h-fit rounded-2xl shadow-sm">
          <CardHeader className="border-b border-zinc-50 dark:border-zinc-900 pb-4 pt-6 px-6"><CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-400">Personnel Dossier</CardTitle></CardHeader>
          <CardContent className="p-8">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
              <div className="space-y-1.5"><dt className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Mail className="h-3 w-3" /> Communication</dt><dd className="text-sm text-gray-900 dark:text-zinc-100 font-bold">{user.email}</dd></div>
              <div className="space-y-1.5"><dt className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Phone className="h-3 w-3" /> Secure Line</dt><dd className="text-sm text-gray-900 dark:text-zinc-100 font-bold">{user.phone || "N/A"}</dd></div>
              <div className="space-y-1.5"><dt className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Briefcase className="h-3 w-3" /> Functional Designation</dt><dd className="text-sm text-brand-primary font-black uppercase tracking-tight">{user.company?.title || "N/A"}</dd></div>
              <div className="space-y-1.5"><dt className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-2"><MapPin className="h-3 w-3" /> Registered Locale</dt><dd className="text-sm text-gray-900 dark:text-zinc-100 font-bold leading-relaxed">{user.address ? (<>{user.address.address}, <br />{user.address.city}, {user.address.state} {user.address.postalCode}</>) : "N/A"}</dd></div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
