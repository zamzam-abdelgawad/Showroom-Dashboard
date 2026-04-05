import { useNavigate } from "react-router-dom";
import { useCars } from "../context/CarsContext";
import { useRequests } from "../context/RequestsContext";
import { useUsers } from "../context/UsersContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Car, DollarSign, Activity, CheckCircle, BarChart3, ArrowRight, Clock, User } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "../components/ui/Skeleton";

const chartData = [
  { name: "Jan", sales: 40000 },
  { name: "Feb", sales: 30000 },
  { name: "Mar", sales: 55000 },
  { name: "Apr", sales: 48000 },
  { name: "May", sales: 70000 },
  { name: "Jun", sales: 85000 },
];

export default function Dashboard() {
  const { cars, loading } = useCars();
  const { requests } = useRequests();
  const { users } = useUsers();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-6">
        <div><Skeleton className="h-8 w-48 mb-2" /><Skeleton className="h-4 w-64" /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl mt-6" />
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
    { title: "Total Cars", value: cars.length, icon: <Car className="h-5 w-5 text-indigo-600" />, trend: "+12%", onClick: () => navigate('/cars') },
    { title: "Available Cars", value: availableCarsCount, icon: <Activity className="h-5 w-5 text-green-600" />, trend: "+5%", onClick: () => navigate('/cars?status=available') },
    { title: "Sold Cars", value: soldCarsCount, icon: <CheckCircle className="h-5 w-5 text-purple-600" />, trend: "+10%", onClick: () => navigate('/cars?status=sold') },
    { title: "Total Sales", value: `$${totalSalesValue.toLocaleString()}`, icon: <DollarSign className="h-5 w-5 text-blue-600" />, trend: "+18%", onClick: () => navigate('/cars?status=sold') },
  ];

  return (
    <div className="space-y-8 animate-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Showroom Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">Welcome back. Here is your inventory and sales performance.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
          <Clock className="h-3 w-3" /> Updated: Today, 10:45 AM
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <Card 
            key={idx} 
            className="transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer border-none shadow-sm" 
            onClick={stat.onClick}
            role="button"
            tabIndex={0}
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 tracking-tight">{stat.title}</p>
                <h4 className="text-2xl font-extrabold text-gray-900 mt-2">{stat.value}</h4>
                <p className="text-[10px] text-green-600 font-bold mt-2 flex items-center gap-1 uppercase tracking-wider">
                  {stat.trend} <span className="text-gray-400 font-normal normal-case">vs last month</span>
                </p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                {stat.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-50 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-indigo-500" />
              Sales Volume Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} dy={10} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} 
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                    cursor={{stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 4'}}
                    formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm h-fit">
          <CardHeader className="border-b border-gray-50 flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-amber-500" /> Recent Requests
            </CardTitle>
            <button onClick={() => navigate('/requests')} className="text-indigo-600 hover:text-indigo-700">
              <ArrowRight className="h-4 w-4" />
            </button>
          </CardHeader>
          <CardContent className="px-2 pt-4">
            {recentRequests.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                <div className="bg-gray-50 p-3 rounded-full mb-3">
                  <Clock className="h-6 w-6 text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-500">No recent buy requests</p>
                <p className="text-xs text-gray-400 mt-1">Customer interactions will appear here.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {recentRequests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group" onClick={() => navigate('/requests')}>
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="bg-indigo-50 p-2 rounded-lg group-hover:bg-indigo-100 transition-colors">
                        <User className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-bold text-gray-900 truncate">{req.userName}</span>
                        <span className="text-[10px] font-medium text-gray-400 uppercase flex items-center gap-1">
                          <Car className="h-2.5 w-2.5" /> {req.carName}
                        </span>
                      </div>
                    </div>
                    <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      req.status === 'approved' ? 'bg-green-100 text-green-700' : 
                      req.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {req.status}
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
