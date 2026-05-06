import { useNavigate } from "react-router-dom";
import { useCars } from "../context/CarsContext";
import { useRequests } from "../context/RequestsContext";
import { useUsers } from "../context/UsersContext";
import { useTheme } from "../../shared/context/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/components/ui/Card";
import { Car, DollarSign, Activity, CheckCircle, BarChart3, ArrowRight, Clock, User, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "../../shared/components/ui/Skeleton";

const chartData = [
  { name: "Jan", sales: 40000 },
  { name: "Feb", sales: 30000 },
  { name: "Mar", sales: 55000 },
  { name: "Apr", sales: 48000 },
  { name: "May", sales: 70000 },
  { name: "Jun", sales: 85000 },
];

const statCardStyles = [
  { border: "border-brand-primary/20", iconBg: "bg-brand-primary/10", iconColor: "text-brand-primary", shadowColor: "shadow-brand-primary/5" },
  { border: "border-emerald-500/20", iconBg: "bg-emerald-100 dark:bg-emerald-900/30", iconColor: "text-emerald-600 dark:text-emerald-400", shadowColor: "shadow-emerald-500/5" },
  { border: "border-brand-secondary/20", iconBg: "bg-brand-secondary/10", iconColor: "text-brand-secondary", shadowColor: "shadow-brand-secondary/5" },
  { border: "border-zinc-500/20", iconBg: "bg-zinc-100 dark:bg-zinc-800", iconColor: "text-zinc-600 dark:text-zinc-400", shadowColor: "shadow-zinc-500/5" },
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
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
        </div>
        <Skeleton className="h-[400px] w-full rounded-2xl mt-6" />
      </div>
    );
  }

  const availableCarsCount = cars.filter(c => c.status === "Available").length;
  const soldCarsCount = cars.filter(c => c.status === "Sold").length;
  const totalSalesValue = cars.filter(c => c.status === "Sold").reduce((acc, curr) => acc + (curr.sellingPrice || 0), 0);
  
  const recentRequests = requests.slice(0, 5).map(req => {
    const user = users.find(u => u.id === req.userId);
    const car = cars.find(c => c.id === req.carId);
    return { ...req, userName: user ? `${user.firstName} ${user.lastName}` : "User", carName: car?.name || "Vehicle" };
  });

  const statCards = [
    { title: "Total Vehicles", value: cars.length, icon: <Car className="h-5 w-5" />, trend: "+12%", onClick: () => navigate('/admin/cars') },
    { title: "Available", value: availableCarsCount, icon: <Activity className="h-5 w-5" />, trend: "+5%", onClick: () => navigate('/admin/cars?status=available') },
    { title: "Sold", value: soldCarsCount, icon: <CheckCircle className="h-5 w-5" />, trend: "+10%", onClick: () => navigate('/admin/cars?status=sold') },
    { title: "Revenue", value: `$${totalSalesValue.toLocaleString()}`, icon: <DollarSign className="h-5 w-5" />, trend: "+18%", onClick: () => navigate('/admin/cars?status=sold') },
  ];

  return (
    <div className="space-y-8 animate-in px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">ShowroomElite Dashboard</h1>
          <p className="text-gray-500 dark:text-zinc-500 mt-1 text-sm font-medium">Welcome back, here's what's happening with your business today.</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 bg-white dark:bg-zinc-900 px-3 py-2 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm w-fit uppercase tracking-widest">
          <Clock className="h-3 w-3" /> System Sync: Today, 10:45 AM
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
                <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-[0.1em]">{stat.title}</p>
                <h4 className="text-2xl font-black text-gray-900 dark:text-zinc-100 mt-1">{stat.value}</h4>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-2 flex items-center gap-1 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded w-fit">
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

      {/* Charts + Recent Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-gray-100 dark:border-zinc-900 shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-50 dark:border-zinc-900 pb-4 bg-gray-50/30 dark:bg-zinc-900/20">
            <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-500"><BarChart3 className="h-4 w-4 text-brand-primary" /> Sales Trajectory</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#18181b' : '#f3f4f6'} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: theme === 'dark' ? '#52525b' : '#94a3b8', fontSize: 11, fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: theme === 'dark' ? '#52525b' : '#94a3b8', fontSize: 11, fontWeight: 600}} tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #27272a', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px 16px', backgroundColor: theme === 'dark' ? '#09090b' : '#ffffff', color: theme === 'dark' ? '#f1f5f9' : '#0f172a' }} 
                    cursor={{stroke: theme === 'dark' ? '#27272a' : '#e2e8f0', strokeWidth: 1}} 
                    formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} 
                  />
                  <Area type="monotone" dataKey="sales" stroke="#7c3aed" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-zinc-100 dark:border-zinc-900 shadow-xl bg-white dark:bg-zinc-950 overflow-hidden h-fit">
          <CardHeader className="border-b border-zinc-50 dark:border-zinc-900 flex flex-row items-center justify-between pb-6 pt-7 bg-zinc-50/50 dark:bg-zinc-900/20 px-6">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 text-zinc-400"><Activity className="h-4 w-4 text-brand-primary" /> Recent Requests</CardTitle>
            <button onClick={() => navigate('/admin/requests')} className="text-brand-primary hover:text-brand-primary/80 transition-colors">
              <ArrowRight className="h-4 w-4" />
            </button>
          </CardHeader>
          <CardContent className="px-3 pt-6 pb-6">
            {recentRequests.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center px-4">
                <div className="bg-zinc-50 dark:bg-zinc-900 p-5 rounded-full mb-6 shadow-inner"><Clock className="h-8 w-8 text-zinc-200 dark:text-zinc-800" /></div>
                <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">No requests yet</p>
                <p className="text-[10px] text-zinc-400/70 font-medium uppercase tracking-widest mt-2 px-10">Await operational interactions to populate intelligence.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentRequests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all duration-300 cursor-pointer group border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800" onClick={() => navigate('/admin/requests')}>
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="bg-zinc-950/5 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 transition-colors group-hover:bg-brand-primary/10 group-hover:border-brand-primary/20">
                        <User className="h-4 w-4 text-brand-primary" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[11px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight group-hover:text-brand-primary transition-colors truncate">{req.userName}</span>
                        <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase flex items-center gap-1.5 mt-1 tracking-widest"><Car className="h-2.5 w-2.5" /> {req.carName}</span>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
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
