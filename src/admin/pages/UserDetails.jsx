import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUsers } from "../context/UsersContext";
import { useAuth } from "../../shared/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/components/ui/Card";
import { Button } from "../../shared/components/ui/Button";
import { Skeleton } from "../../shared/components/ui/Skeleton";
import { useToast } from "../../shared/context/ToastContext";
import { UserFormModal } from "../components/users/UserFormModal";
import { DeleteConfirmModal } from "../../shared/components/ui/DeleteConfirmModal";
import {
  ArrowLeft, Mail, User, Edit2, Trash2,
  Shield, Calendar, CheckCircle2, XCircle,
} from "lucide-react";

// ── Firestore timestamp → JS Date ─────────────────────────────────────────────
function parseTimestamp(raw) {
  if (!raw) return null;
  if (raw?.seconds) return new Date(raw.seconds * 1000);
  return new Date(raw);
}

// ── Small label/value row ─────────────────────────────────────────────────────
function Field({ icon, label, value, accent }) {
  return (
    <div className="space-y-1.5">
      <dt className="text-xs font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-2">
        {icon} {label}
      </dt>
      <dd className={`text-sm font-semibold tracking-tight ${accent ? "text-brand-primary" : "text-zinc-900 dark:text-zinc-100"}`}>
        {value || "—"}
      </dd>
    </div>
  );
}

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user: authUser } = useAuth();
  const isAdmin = authUser?.role === "admin";
  const { users, loading: contextLoading, updateUser, deleteUser } = useUsers();

  const [user,        setUser]        = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [isFormOpen,  setIsFormOpen]  = useState(false);
  const [isDeleteOpen,setIsDeleteOpen]= useState(false);
  const [isSubmitting,setIsSubmitting]= useState(false);

  useEffect(() => {
    if (!contextLoading) {
      const found = users.find(u => String(u.id) === id || u.firestoreId === id);
      if (found) {
        setUser(found);
      } else {
        addToast("User not found", "error");
        navigate("/admin/users");
      }
      setLoading(false);
    }
  }, [id, users, contextLoading, addToast, navigate]);

  const handleEditSubmit = async (data) => {
    setIsSubmitting(true);
    await updateUser(user.firestoreId || user.id, data);
    setIsSubmitting(false);
    setIsFormOpen(false);
    addToast("User updated successfully", "success");
  };

  const handleDeleteConfirm = async () => {
    setIsSubmitting(true);
    await deleteUser(user.firestoreId || user.id);
    setIsSubmitting(false);
    setIsDeleteOpen(false);
    addToast("User deleted successfully", "success");
    navigate("/admin/users");
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading || contextLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-32 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 border-zinc-100 dark:border-zinc-900 dark:bg-zinc-950 flex flex-col items-center text-center pt-8 rounded-2xl">
            <Skeleton className="h-32 w-32 rounded-full mb-6" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-8" />
          </Card>
          <Card className="col-span-1 md:col-span-2 border-zinc-100 dark:border-zinc-900 dark:bg-zinc-950 rounded-2xl">
            <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
            <CardContent className="space-y-6 p-8">
              {[1,2,3,4].map(i => <Skeleton key={i} className="h-4 w-full" />)}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const fullName    = user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown User";
  const createdAt   = parseTimestamp(user.createdAt);
  const isActive    = user.status === "Active";

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in">

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="text-zinc-500 dark:text-zinc-400 hover:text-brand-primary dark:hover:text-brand-primary font-bold text-xs transition-all group uppercase tracking-widest"
          onClick={() => navigate("/admin/users")}
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
        </Button>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsFormOpen(true)} className="rounded-xl shadow-lg shadow-brand-primary/10 text-xs">
              <Edit2 className="h-4 w-4 mr-2" /> Edit User
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsDeleteOpen(true)}
              className="rounded-xl text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-100 dark:border-red-900/40"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ── Profile card ──────────────────────────────────────────────────── */}
        <Card className="col-span-1 border border-zinc-100 dark:border-zinc-900 dark:bg-zinc-950 rounded-3xl shadow-sm overflow-hidden">
          {/* Dark banner */}
          <div className="h-24 bg-zinc-950 relative">
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-brand-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-brand-primary/10 rounded-full blur-2xl" />
          </div>

          <CardContent className="pt-0 -mt-12 flex flex-col items-center text-center pb-8 px-6">
            {/* Avatar */}
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-4 border-white dark:border-zinc-950 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center overflow-hidden shadow-2xl z-10 relative">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={fullName}
                    className="h-full w-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <User className="h-10 w-10 text-zinc-300 dark:text-zinc-700" />
                )}
              </div>
              {/* Online dot */}
              <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-white dark:border-zinc-950 z-20 shadow-lg
                ${isActive ? 'bg-emerald-500' : 'bg-zinc-400'}" />
            </div>

            <h2 className="mt-4 text-xl font-bold text-zinc-950 dark:text-zinc-100 leading-tight tracking-tight">
              {fullName}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">{user.email}</p>

            {/* Role + Status badges */}
            <div className="mt-5 flex items-center gap-2 flex-wrap justify-center">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                <Shield className="h-3 w-3" /> {user.role || "user"}
              </span>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40"
                  : "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 border-red-100 dark:border-red-900/40"
              }`}>
                {isActive
                  ? <><CheckCircle2 className="h-3 w-3" /> Active</>
                  : <><XCircle      className="h-3 w-3" /> Inactive</>
                }
              </span>
            </div>

            {/* Member since */}
            {createdAt && (
              <p className="mt-5 text-[10px] text-zinc-400 dark:text-zinc-500 font-medium flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                Member since {createdAt.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            )}
          </CardContent>
        </Card>

        {/* ── Dossier card ──────────────────────────────────────────────────── */}
        <Card className="col-span-1 md:col-span-2 border border-zinc-100 dark:border-zinc-900 dark:bg-zinc-950 h-fit rounded-3xl shadow-sm">
          <CardHeader className="border-b border-zinc-100 dark:border-zinc-900 pb-4 pt-6 px-8">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">

              <Field
                icon={<User    className="h-3.5 w-3.5 opacity-70" />}
                label="First Name"
                value={user.firstName || "—"}
              />
              <Field
                icon={<User    className="h-3.5 w-3.5 opacity-70" />}
                label="Last Name"
                value={user.lastName || "—"}
              />
              <Field
                icon={<Mail    className="h-3.5 w-3.5 opacity-70" />}
                label="Email Address"
                value={user.email}
              />
              {/* <Field
                icon={<Shield  className="h-3.5 w-3.5 opacity-70" />}
                label="System Role"
                value={user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User"}
                accent
              /> */}
              <Field
                icon={<CheckCircle2 className="h-3.5 w-3.5 opacity-70" />}
                label="Account Status"
                value={user.status || "Active"}
              />
              {/* <Field
                icon={<Calendar className="h-3.5 w-3.5 opacity-70" />}
                label="Registered On"
                value={createdAt
                  ? createdAt.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
                  : "—"}
              /> */}

            </dl>

            {/* User ID — helpful for admin debugging */}
            <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-900">
              <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-1">User ID</p>
              <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 break-all">
                {user.firestoreId || user.id || "—"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <UserFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={user}
        isSubmitting={isSubmitting}
      />
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isSubmitting}
        itemName={fullName}
      />
    </div>
  );
}