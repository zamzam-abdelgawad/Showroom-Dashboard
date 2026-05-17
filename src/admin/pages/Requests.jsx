import { useRequests } from "../context/RequestsContext";
import { useUsers } from "../context/UsersContext";
import { useCars } from "../context/CarsContext";
import { useToast } from "../../shared/context/ToastContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/components/ui/Card";
import { Button } from "../../shared/components/ui/Button";
import { Skeleton } from "../../shared/components/ui/Skeleton";
import {
  BadgeCheck, XCircle, Clock, Search, Filter, ShieldCheck,
  Mail, Car, Calendar, ChevronDown, X, MapPin, Phone,
  Eye, Package, User, CreditCard, Banknote, TrendingUp,
} from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ─── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-2">
      <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      {children}
      <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
    </p>
  );
}

// ─── Delivery Details Modal ────────────────────────────────────────────────────
function DeliveryDetailsModal({ req, onClose }) {
  if (!req) return null;

  const d = req.delivery || {};

  const hasDelivery    = d.address || d.phone || d.date || d.slot;
  const paymentMode    = d.paymentMode;
  const financeTerm    = d.financeTerm;
  const monthlyPayment = d.monthlyPayment;
  const hasPayment     = !!paymentMode;

  const carPrice    = d.totalPrice && d.deliveryFee ? d.totalPrice - d.deliveryFee : null;
  const deliveryFee = d.deliveryFee ?? null;
  const totalPrice  = d.totalPrice  ?? null;

  function parseDate(raw) {
    if (!raw) return null;
    if (raw?.seconds) return new Date(raw.seconds * 1000);
    return new Date(raw);
  }

  function Row({ icon, label, value, accent }) {
    return (
      <div className="flex items-start gap-3 py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
        <div className={`p-1.5 rounded-lg flex-shrink-0 mt-0.5
          ${accent
            ? "bg-brand-primary/10"
            : "bg-zinc-100 dark:bg-zinc-800"}`}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">{label}</p>
          <p className={`text-sm font-semibold break-words
            ${accent
              ? "text-brand-primary"
              : "text-zinc-800 dark:text-zinc-200"}`}
          >
            {value || "—"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="bg-zinc-100 dark:bg-zinc-900 px-6 py-5 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
              <Package className="w-4 h-4 text-brand-primary" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-white leading-tight">
                Delivery Details
              </p>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mt-0.5 font-medium">
                {req.carBrand} · {req.carName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700
                       flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white
                       hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Status bar ─────────────────────────────────────────────────── */}
        <div className={`px-6 py-2.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest border-b
          ${req.status === 'approved'
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400'
            : req.status === 'rejected'
              ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30 text-red-500 dark:text-red-400'
              : 'bg-brand-primary/5 dark:bg-brand-primary/10 border-brand-primary/10 dark:border-brand-primary/20 text-brand-primary'}`}
        >
          {req.status === 'approved' && <BadgeCheck className="w-3.5 h-3.5" />}
          {req.status === 'rejected' && <XCircle    className="w-3.5 h-3.5" />}
          {req.status === 'pending'  && <Clock      className="w-3.5 h-3.5" />}
          Request {req.status} · {new Date(req.timestamp).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
        </div>

        {/* ── Scrollable body ─────────────────────────────────────────────── */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto bg-white dark:bg-zinc-950">

          {/* Customer */}
          <div>
            <SectionLabel>Customer</SectionLabel>
            <div className="bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl px-4 border border-zinc-100 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800">
              <Row icon={<User className="w-3.5 h-3.5 text-zinc-400" />} label="Name"  value={req.userName} />
              <Row icon={<Mail className="w-3.5 h-3.5 text-zinc-400" />} label="Email" value={req.userEmail} />
            </div>
          </div>

          {/* Delivery */}
          {hasDelivery ? (
            <div>
              <SectionLabel>Delivery</SectionLabel>
              <div className="bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl px-4 border border-zinc-100 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800">
                {d.address  && <Row icon={<MapPin   className="w-3.5 h-3.5 text-zinc-400" />} label="Address"        value={d.address} />}
                {d.phone    && <Row icon={<Phone    className="w-3.5 h-3.5 text-zinc-400" />} label="Primary Phone"   value={d.phone} />}
                {d.altPhone && <Row icon={<Phone    className="w-3.5 h-3.5 text-zinc-400" />} label="Alternate Phone" value={d.altPhone} />}
                {d.date     && <Row icon={<Calendar className="w-3.5 h-3.5 text-zinc-400" />} label="Delivery Date"  value={parseDate(d.date)?.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} />}
                {d.slot     && <Row icon={<Clock    className="w-3.5 h-3.5 text-zinc-400" />} label="Time Window"    value={d.slot} />}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 px-4 bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
              <Package className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-2" />
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">No delivery details submitted</p>
              <p className="text-[10px] text-zinc-400/70 mt-1">Customer hasn't completed the booking form yet.</p>
            </div>
          )}

          {/* Payment method */}
          {hasPayment && (
            <div>
              <SectionLabel>Payment Method</SectionLabel>
              <div className={`rounded-2xl px-4 border divide-y
                ${paymentMode === "finance"
                  ? "bg-brand-primary/5 border-brand-primary/10 divide-brand-primary/10"
                  : "bg-emerald-50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30 divide-emerald-100 dark:divide-emerald-900/30"}`}
              >
                <Row
                  icon={paymentMode === "finance"
                    ? <CreditCard className="w-3.5 h-3.5 text-brand-primary" />
                    : <Banknote   className="w-3.5 h-3.5 text-emerald-600" />}
                  label="Method"
                  value={paymentMode === "finance" ? "Financing / Installments" : "Pay in Full"}
                />
                {paymentMode === "finance" && financeTerm && (
                  <Row
                    icon={<TrendingUp className="w-3.5 h-3.5 text-brand-primary" />}
                    label="Loan Term"
                    value={`${financeTerm} months · 4.9% APR`}
                    accent
                  />
                )}
                {paymentMode === "finance" && monthlyPayment && (
                  <Row
                    icon={<TrendingUp className="w-3.5 h-3.5 text-brand-primary" />}
                    label="Est. Monthly Payment"
                    value={`$${monthlyPayment.toLocaleString()}/mo`}
                    accent
                  />
                )}
              </div>
            </div>
          )}

          {/* Order pricing */}
          {totalPrice && (
            <div>
              <SectionLabel>Order Pricing</SectionLabel>
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <div className="bg-zinc-50 dark:bg-zinc-900/60 px-4 divide-y divide-zinc-100 dark:divide-zinc-800">
                  {carPrice !== null && (
                    <Row icon={<Car     className="w-3.5 h-3.5 text-zinc-400" />} label="Vehicle Price" value={`$${carPrice.toLocaleString()}`} />
                  )}
                  {deliveryFee !== null && (
                    <Row icon={<Package className="w-3.5 h-3.5 text-zinc-400" />} label="Delivery Fee"  value={`$${deliveryFee.toLocaleString()}`} />
                  )}
                </div>

                {/* Total row — light: zinc-900 banner, dark: zinc-950 */}
                <div className="bg-zinc-100 dark:bg-zinc-950 px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Total Due</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Full payment at delivery</p>
                  </div>
                  <p className="text-2xl font-bold text-brand-primary tracking-tighter leading-none">
                    ${totalPrice.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Requests() {
  const { requests, loading, updateRequestStatus } = useRequests();
  const { users } = useUsers();
  const { cars, markAsSold } = useCars();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [searchTerm,    setSearchTerm]    = useState("");
  const [statusFilter,  setStatusFilter]  = useState("all");
  const [isFilterOpen,  setIsFilterOpen]  = useState(false);
  const [selectedReq,   setSelectedReq]   = useState(null);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setIsFilterOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const enrichedRequests = useMemo(() => {
    return requests.map(req => {
      const user = users.find(u => u.id === req.userId || u.firestoreId === req.userId);
      const car  = cars.find(c => c.id === req.carId);
      return {
        ...req,
        userName:  user ? `${user.firstName || user.name || ''} ${user.lastName || ''}`.trim() : "Unknown User",
        userEmail: user?.email || "N/A",
        carName:   car?.name   || "Unknown Vehicle",
        carBrand:  car?.brand  || "N/A",
      };
    });
  }, [requests, users, cars]);

  const filteredRequests = useMemo(() => {
    return enrichedRequests.filter(req => {
      const matchesSearch = req.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            req.carName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [enrichedRequests, searchTerm, statusFilter]);

  const handleStatusChange = async (id, newStatus, carId) => {
    try {
      await updateRequestStatus(id, newStatus);
      if (newStatus === 'approved' && carId) await markAsSold(carId);
      addToast(`Request ${newStatus} successfully`, "success");
    } catch {
      addToast("Failed to update status", "error");
    }
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return (
        <span className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/50">
          <BadgeCheck className="h-3.5 w-3.5" /> Accepted
        </span>
      );
      case 'rejected': return (
        <span className="inline-flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-red-100 dark:border-red-900/50">
          <XCircle className="h-3.5 w-3.5" /> Rejected
        </span>
      );
      default: return (
        <span className="inline-flex items-center gap-1.5 bg-brand-primary/5 text-brand-primary px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-brand-primary/20">
          <Clock className="h-3.5 w-3.5" /> Pending
        </span>
      );
    }
  };

  return (
    <>
      <div className="space-y-6 animate-in">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-primary rounded-xl text-white shadow-lg shadow-brand-primary/10">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-zinc-100 tracking-tightest leading-tight">
                Purchase Requests
              </h1>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">
                {requests.length} total orders · <span className="text-brand-primary">{pendingCount} pending review</span>
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-950 px-3 py-1.5 border border-zinc-100 dark:border-zinc-900 rounded-xl shadow-sm flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-primary" />
            <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-widest leading-none">Admin Control</span>
          </div>
        </div>

        <Card className="border border-zinc-100 dark:border-zinc-900 shadow-sm overflow-hidden bg-white dark:bg-zinc-950">

          {/* Toolbar */}
          <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row gap-4 justify-between pb-4 pt-6 px-6">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <input
                placeholder="Filter by user or vehicle..."
                className="pl-10 h-10 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary dark:text-zinc-100"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative flex-shrink-0" ref={filterRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center justify-center gap-3 bg-white dark:bg-zinc-950 px-4 h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 w-44 text-[11px] font-semibold tracking-wider text-zinc-700 dark:text-zinc-300 hover:border-brand-primary transition-all duration-300 shadow-sm"
              >
                <Filter className="h-3.5 w-3.5 text-brand-primary flex-shrink-0" />
                <span className="flex-1 text-left">
                  {statusFilter === 'all'      ? 'All Interactions'
                   : statusFilter === 'pending'  ? 'Pending'
                   : statusFilter === 'approved' ? 'Accepted'
                   : 'Rejected'}
                </span>
                <ChevronDown className={`h-3 w-3 text-zinc-400 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {isFilterOpen && (
                <div className="absolute top-full mt-2 right-0 w-44 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
                  {[
                    { value: 'all',      label: 'All Interactions' },
                    { value: 'pending',  label: 'Pending' },
                    { value: 'approved', label: 'Accepted' },
                    { value: 'rejected', label: 'Rejected' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setStatusFilter(opt.value); setIsFilterOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-semibold tracking-wider transition-all duration-200 text-left
                        ${statusFilter === opt.value
                          ? 'bg-brand-primary/10 text-brand-primary'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                    >
                      {statusFilter === opt.value && <span className="h-1.5 w-1.5 rounded-full bg-brand-primary flex-shrink-0" />}
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardHeader>

          {/* Table */}
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
              </div>
            ) : (
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-200 text-zinc-900 dark:text-zinc-100">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-white dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider text-xs border-b border-zinc-100 dark:border-zinc-900">
                    <tr>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Vehicle Asset</th>
                      <th className="px-6 py-4">Applied Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Delivery</th>
                      <th className="px-6 py-4 text-right">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900/50">
                    {filteredRequests.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-16 text-center text-zinc-400">
                          <div className="flex flex-col items-center">
                            <Clock className="h-10 w-10 text-zinc-100 dark:text-zinc-800 mb-2" />
                            <p className="text-zinc-500 dark:text-zinc-600 font-medium text-sm">No interactions recorded.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredRequests.map(req => (
                        <tr key={req.id || req.firestoreId} className="hover:bg-brand-primary/[0.02] dark:hover:bg-brand-primary/[0.02] transition-colors group">

                          {/* Customer */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-sm text-zinc-950 dark:text-zinc-100 mb-0.5 group-hover:text-brand-primary transition-colors tracking-tight">
                                {req.userName}
                                {req.status === 'pending' && (
                                  <span className="ml-2 bg-brand-primary/10 text-brand-primary text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">NEW</span>
                                )}
                              </span>
                              <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                                <Mail className="h-3 w-3 text-zinc-400" /> {req.userEmail}
                              </span>
                            </div>
                          </td>

                          {/* Vehicle */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span
                                className="font-medium text-zinc-700 dark:text-zinc-300 hover:text-brand-primary cursor-pointer flex items-center gap-1.5 transition-colors"
                                onClick={() => navigate(`/admin/cars/${req.carId}`)}
                              >
                                <Car className="h-3.5 w-3.5" /> {req.carName}
                              </span>
                              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium tracking-wide">{req.carBrand}</span>
                            </div>
                          </td>

                          {/* Date */}
                          <td className="px-6 py-4 text-zinc-500 dark:text-zinc-500 font-normal">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-700" />
                              {new Date(req.timestamp).toLocaleDateString()}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">{getStatusBadge(req.status)}</td>

                          {/* Delivery */}
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setSelectedReq(req)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all duration-200
                                ${req.delivery?.address
                                  ? "border-brand-primary/20 bg-brand-primary/5 text-brand-primary hover:bg-brand-primary/10 hover:border-brand-primary/40"
                                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-600 dark:hover:text-zinc-300"}`}
                            >
                              <Eye className="h-3 w-3" />
                              {req.delivery?.address ? "View Details" : "No Details"}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-right">
                            {req.status === 'pending' ? (
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost" size="sm"
                                  className="text-emerald-600 dark:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 h-8 font-bold uppercase tracking-widest text-[10px]"
                                  onClick={() => handleStatusChange(req.firestoreId || req.id, 'approved', req.carId)}
                                >
                                  Accept
                                </Button>
                                <Button
                                  variant="ghost" size="sm"
                                  className="text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 h-8 font-bold uppercase tracking-widest text-[10px]"
                                  onClick={() => handleStatusChange(req.firestoreId || req.id, 'rejected', req.carId)}
                                >
                                  Reject
                                </Button>
                              </div>
                            ) : (
                              <span className="text-xs text-zinc-400 dark:text-zinc-600 font-medium italic mr-4">Resolved</span>
                            )}
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

      {/* Delivery Details Modal */}
      {selectedReq && (
        <DeliveryDetailsModal req={selectedReq} onClose={() => setSelectedReq(null)} />
      )}
    </>
  );
}