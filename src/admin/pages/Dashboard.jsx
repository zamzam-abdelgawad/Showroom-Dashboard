import { useNavigate } from "react-router-dom";
import { useCars } from "../context/CarsContext";
import { useRequests } from "../context/RequestsContext";
import { useUsers } from "../context/UsersContext";
import { useTheme } from "../../shared/context/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/components/ui/Card";
import { Car, DollarSign, Activity, CheckCircle, BarChart3, ArrowRight, Clock, User, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "../../shared/components/ui/Skeleton";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const statCardStyles = [
  { border: "border-zinc-100 dark:border-zinc-800", iconBg: "bg-brand-primary/5",       iconColor: "text-brand-primary",                       shadowColor: "shadow-sm" },
  { border: "border-zinc-100 dark:border-zinc-800", iconBg: "bg-emerald-500/5",          iconColor: "text-emerald-600 dark:text-emerald-400",    shadowColor: "shadow-sm" },
  { border: "border-zinc-100 dark:border-zinc-800", iconBg: "bg-amber-500/5",            iconColor: "text-amber-600",                            shadowColor: "shadow-sm" },
  { border: "border-zinc-100 dark:border-zinc-800", iconBg: "bg-zinc-100 dark:bg-zinc-800", iconColor: "text-zinc-600 dark:text-zinc-400",      shadowColor: "shadow-sm" },
];

export default function Dashboard() {
  const { cars, loading } = useCars();
  const { requests } = useRequests();
  const { users } = useUsers();
  const { theme } = useTheme();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-6">
        <div><Skeleton className="h-8 w-48 mb-2" /><Skeleton className="h-4 w-64" /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
        </div>
        <Skeleton className="h-[400px] w-full rounded-2xl mt-6" />
      </div>
    );
  }

  // ── Stat card values ───────────────────────────────────────────────────────
  const availableCarsCount = cars.filter(c => c.status === "Available" && c.count > 0).length;
  const soldCarsCount      = cars.filter(c => c.status === "Sold").length;

  // Revenue = sum of approved requests' car prices
  // Consistent with the chart so both numbers always agree
  const totalSalesValue = requests
    .filter(r => r.status === "approved")
    .reduce((acc, req) => {
      const car = cars.find(c => String(c.id) === String(req.carId));
      return acc + (car?.sellingPrice || req.delivery?.totalPrice || 0);
    }, 0);

  const currentYear = new Date().getFullYear();

  // ── Chart: monthly revenue ─────────────────────────────────────────────────
  // Primary source: approved requests (always have a timestamp).
  // Secondary: cars with soldAt field (written by newer CarsContext versions).
  // This ensures the chart works even before soldAt was added to your schema.
  const chartData = (() => {
    const monthlySales = Array(12).fill(0);

    // Helper: parse any timestamp form → JS Date
    const toDate = (raw) => {
      if (!raw) return null;
      if (raw?.toDate) return raw.toDate();          // Firestore Timestamp object
      if (raw?.seconds) return new Date(raw.seconds * 1000); // plain { seconds }
      const d = new Date(raw);
      return isNaN(d) ? null : d;
    };

    // Use approved requests as the primary revenue signal
    requests
      .filter(r => r.status === "approved")
      .forEach(req => {
        const date = toDate(req.timestamp);
        if (!date || date.getFullYear() !== currentYear) return;

        // Find the car's selling price for this request
        const car = cars.find(c => String(c.id) === String(req.carId));
        const price = car?.sellingPrice || req.delivery?.totalPrice || 0;
        monthlySales[date.getMonth()] += price;
      });

    // Also include cars with soldAt (for future-proofing once you add it)
    cars
      .filter(c => c.status === "Sold" && c.soldAt)
      .forEach(car => {
        const date = toDate(car.soldAt);
        if (!date || date.getFullYear() !== currentYear) return;

        // Only add if this car doesn't already have a matching approved request
        // (avoids double-counting)
        const alreadyCounted = requests.some(
          r => r.status === "approved" && String(r.carId) === String(car.id)
        );
        if (!alreadyCounted) {
          monthlySales[date.getMonth()] += car.sellingPrice || 0;
        }
      });

    return monthlySales.map((sales, i) => ({ name: MONTH_NAMES[i], sales }));
  })();

  // ── Recent requests enriched with user & car names ─────────────────────────
  const recentRequests = requests.slice(0, 5).map(req => {
    const user = users.find(u => u.id === req.userId || u.firestoreId === req.userId);
    const car  = cars.find(c => String(c.id) === String(req.carId));
    return {
      ...req,
      userName: user
        ? `${user.firstName || user.name || ""} ${user.lastName || ""}`.trim() || "User"
        : "Unknown User",
      carName: car?.name || "Vehicle",
    };
  });

  const statCards = [
    { title: "Total Vehicles",  value: cars.length,                    icon: <Car          className="h-5 w-5" />, trend: `${cars.length} total`,           onClick: () => navigate('/admin/cars') },
    { title: "Available",       value: availableCarsCount,             icon: <Activity     className="h-5 w-5" />, trend: `${availableCarsCount} in stock`,  onClick: () => navigate('/admin/cars?status=available') },
    { title: "Sold",            value: soldCarsCount,                  icon: <CheckCircle  className="h-5 w-5" />, trend: `${soldCarsCount} units`,          onClick: () => navigate('/admin/cars?status=sold') },
    { title: "Revenue",         value: `$${totalSalesValue.toLocaleString()}`, icon: <DollarSign className="h-5 w-5" />, trend: `${currentYear}`, onClick: () => navigate('/admin/cars?status=sold') },
  ];

  return (
    <div className="space-y-8 animate-in px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-950 dark:text-zinc-100 tracking-tighter leading-tight">Dashboard</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1.5 text-sm font-medium">Performance metrics and operational overview.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <Card
            key={idx}
            className={`transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer border ${statCardStyles[idx].border} bg-white dark:bg-zinc-950 shadow-sm ${statCardStyles[idx].shadowColor}`}
            onClick={stat.onClick}
            role="button"
            tabIndex={0}
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none">{stat.title}</p>
                <h4 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50 mt-4 tracking-tighter leading-none">{stat.value}</h4>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-4 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-lg w-fit border border-emerald-100/50 dark:border-emerald-900/30 tracking-wider">
                  <TrendingUp className="h-3 w-3" />
                  {stat.trend}
                </p>
              </div>
              <div className={`p-4 ${statCardStyles[idx].iconBg} rounded-2xl ${statCardStyles[idx].iconColor}`}>
                {stat.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart + Recent Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-zinc-100 dark:border-zinc-900 shadow-sm overflow-hidden bg-white dark:bg-zinc-950">
          <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4 bg-zinc-50/30 dark:bg-zinc-900/20">
            <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
              <BarChart3 className="h-4 w-4 text-brand-primary" /> Sales Trajectory — {currentYear}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {chartData.every(d => d.sales === 0) ? (
              <div className="h-[350px] flex flex-col items-center justify-center text-center px-8">
                <div className="bg-zinc-50 dark:bg-zinc-900 p-5 rounded-full mb-6 shadow-inner">
                  <BarChart3 className="h-8 w-8 text-zinc-200 dark:text-zinc-800" />
                </div>
                <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">No sales data yet</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium mt-2 leading-relaxed max-w-xs">
                  Monthly revenue will appear once requests are approved.
                </p>
              </div>
            ) : (
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#18181b' : '#f3f4f6'} />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: theme === 'dark' ? '#52525b' : '#94a3b8', fontSize: 11, fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: theme === 'dark' ? '#52525b' : '#94a3b8', fontSize: 11, fontWeight: 600 }}
                      tickFormatter={value => `$${value / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #27272a',
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                        padding: '12px 16px',
                        backgroundColor: theme === 'dark' ? '#09090b' : '#ffffff',
                        color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
                      }}
                      cursor={{ stroke: theme === 'dark' ? '#27272a' : '#e2e8f0', strokeWidth: 1 }}
                      formatter={value => [`$${value.toLocaleString()}`, "Revenue"]}
                    />
                    <Area type="monotone" dataKey="sales" stroke="#7c3aed" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-zinc-100 dark:border-zinc-900 shadow-xl bg-white dark:bg-zinc-950 overflow-hidden h-fit">
          <CardHeader className="border-b border-zinc-50 dark:border-zinc-900 flex flex-row items-center justify-between pb-6 pt-7 bg-zinc-50/50 dark:bg-zinc-900/20 px-6">
            <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-3 text-zinc-500">
              <Activity className="h-4 w-4 text-brand-primary" /> Recent Requests
            </CardTitle>
            <button onClick={() => navigate('/admin/requests')} className="text-brand-primary hover:text-brand-primary/80 transition-colors">
              <ArrowRight className="h-4 w-4" />
            </button>
          </CardHeader>
          <CardContent className="px-3 pt-6 pb-6">
            {recentRequests.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center px-4">
                <div className="bg-zinc-50 dark:bg-zinc-900 p-5 rounded-full mb-6 shadow-inner">
                  <Clock className="h-8 w-8 text-zinc-200 dark:text-zinc-800" />
                </div>
                <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">No requests yet</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium mt-2 px-10 leading-relaxed">
                  Operational interactions will populate here once customers begin their journey.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentRequests.map(req => (
                  <div
                    key={req.id || req.firestoreId}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all duration-300 cursor-pointer group border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800"
                    onClick={() => navigate('/admin/requests')}
                  >
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="bg-zinc-950/5 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 transition-colors group-hover:bg-brand-primary/10 group-hover:border-brand-primary/20">
                        <User className="h-4 w-4 text-brand-primary" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-brand-primary transition-colors truncate tracking-tight">{req.userName}</span>
                        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mt-1 tracking-wider uppercase">
                          <Car className="h-3 w-3" /> {req.carName}
                        </span>
                      </div>
                    </div>
                    <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${
                      req.status === 'approved' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-100/50' :
                      req.status === 'rejected' ? 'bg-red-50 dark:bg-red-950/20 text-red-600 border-red-100/50' :
                      'bg-brand-primary/5 dark:bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                    }`}>
                      {req.status === 'approved' ? 'Approved' : req.status === 'rejected' ? 'Rejected' : 'Pending'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}