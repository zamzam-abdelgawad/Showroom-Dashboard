import { useNavigate } from "react-router-dom";
import { useCars } from "../context/CarsContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Car, DollarSign, Activity, CheckCircle, BarChart3 } from "lucide-react";
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
  const totalSalesValue = cars.filter(c => c.status === "Sold").reduce((acc, curr) => acc + curr.price, 0);

  const statCards = [
    { title: "Total Cars", value: cars.length, icon: <Car className="h-5 w-5 text-indigo-600" />, trend: "+12%", onClick: () => navigate('/cars') },
    { title: "Available Cars", value: availableCarsCount, icon: <Activity className="h-5 w-5 text-green-600" />, trend: "+5%", onClick: () => navigate('/cars?status=available') },
    { title: "Sold Cars", value: soldCarsCount, icon: <CheckCircle className="h-5 w-5 text-purple-600" />, trend: "+10%", onClick: () => navigate('/cars?status=sold') },
    { title: "Total Sales", value: `$${totalSalesValue.toLocaleString()}`, icon: <DollarSign className="h-5 w-5 text-blue-600" />, trend: "+18%", onClick: () => navigate('/cars?status=sold') },
  ];

  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Showroom Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">Welcome back. Here is your inventory and sales performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <Card 
            key={idx} 
            className="transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer" 
            onClick={stat.onClick}
            role="button"
            tabIndex={0}
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h4 className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</h4>
                <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                  {stat.trend} <span className="text-gray-400 font-normal">from last month</span>
                </p>
              </div>
              <div className="p-3 bg-indigo-50/50 rounded-full border border-indigo-100">
                {stat.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
          <CardTitle className="flex items-center gap-2">
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
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#6b7280', fontSize: 12}} 
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4'}}
                  formatter={(value) => [`$${value.toLocaleString()}`, "Sales"]}
                />
                <Area type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
