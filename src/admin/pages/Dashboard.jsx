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
  { gradient: "from-indigo-500 to-indigo-600", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", shadowColor: "shadow-indigo-100" },
  { gradient: "from-emerald-500 to-emerald-600", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", shadowColor: "shadow-emerald-100" },
  { gradient: "from-purple-500 to-purple-600", iconBg: "bg-purple-100", iconColor: "text-purple-600", shadowColor: "shadow-purple-100" },
  { gradient: "from-blue-500 to-blue-600", iconBg: "bg-blue-100", iconColor: "text-blue-600", shadowColor: "shadow-blue-100" },
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
    { title: "Total Cars", value: cars.length, icon: <Car className="h-5 w-5" />, trend: "+12%", onClick: () => navigate('/admin/cars') },
    { title: "Available", value: availableCarsCount, icon: <Activity className="h-5 w-5" />, trend: "+5%", onClick: () => navigate('/admin/cars?status=available') },
    { title: "Sold Cars", value: soldCarsCount, icon: <CheckCircle className="h-5 w-5" />, trend: "+10%", onClick: () => navigate('/admin/cars?status=sold') },
    { title: "Revenue", value: `$${totalSalesValue.toLocaleString()}`, icon: <DollarSign className="h-5 w-5" />, trend: "+18%", onClick: () => navigate('/admin/cars?status=sold') },
  ];

  return (
    <div className="space-y-8 animate-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Showroom Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Welcome back. Here is your inventory and sales performance.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-gray-400 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm">
          <Clock className="h-3 w-3" /> Updated: Today, 10:45 AM
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <Card 
            key={idx} 
            className={`transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer border-none shadow-sm ${statCardStyles[idx].shadowColor}`} 
            onClick={stat.onClick} 
            role="button" 
            tabIndex={0}
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 tracking-tight">{stat.title}</p>
                <h4 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-2">{stat.value}</h4>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-2 flex items-center gap-1 uppercase tracking-wider">
                  <TrendingUp className="h-3 w-3" />
                  {stat.trend} <span className="text-gray-400 dark:text-gray-500 font-normal normal-case">vs last min</span>
                </p>
              </div>
              <div className={`p-3.5 ${statCardStyles[idx].iconBg} rounded-2xl ${statCardStyles[idx].iconColor}`}>
                {stat.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts + Recent Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-50 dark:border-slate-800/60 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg"><BarChart3 className="h-5 w-5 text-indigo-500" /> Sales Volume Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#f3f4f6'} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: theme === 'dark' ? '#64748b' : '#94a3b8', fontSize: 11, fontWeight: 500}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: theme === 'dark' ? '#64748b' : '#94a3b8', fontSize: 11, fontWeight: 500}} tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px 16px', backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff', color: theme === 'dark' ? '#f1f5f9' : '#0f172a' }} 
                    cursor={{stroke: theme === 'dark' ? '#334155' : '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 4'}} 
                    formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} 
                  />
                  <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm h-fit">
          <CardHeader className="border-b border-gray-50 dark:border-slate-800/60 flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg flex items-center gap-2"><Activity className="h-5 w-5 text-amber-500" /> Recent Requests</CardTitle>
            <button onClick={() => navigate('/admin/requests')} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors"><ArrowRight className="h-4 w-4" /></button>
          </CardHeader>
          <CardContent className="px-2 pt-4">
            {recentRequests.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                <div className="bg-gray-50 p-3 rounded-full mb-3"><Clock className="h-6 w-6 text-gray-300" /></div>
                <p className="text-sm font-medium text-gray-500">No recent buy requests</p>
                <p className="text-xs text-gray-400 mt-1">Customer interactions will appear here.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {recentRequests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all duration-200 cursor-pointer group" onClick={() => navigate('/admin/requests')}>
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 p-2 rounded-xl group-hover:from-indigo-100 group-hover:to-purple-100 transition-colors"><User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /></div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{req.userName}</span>
                        <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase flex items-center gap-1"><Car className="h-2.5 w-2.5" /> {req.carName}</span>
                      </div>
                    </div>
                    <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      req.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                      req.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>{req.status}</div>
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
