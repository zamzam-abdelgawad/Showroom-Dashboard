import { useParams, useNavigate } from "react-router-dom";
import { useCars } from "../context/CarsContext";
import { useAuth } from "../../shared/context/AuthContext";
import { useRequests } from "../context/RequestsContext";
import { useToast } from "../../shared/context/ToastContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/components/ui/Card";
import { Button } from "../../shared/components/ui/Button";
import { ChevronLeft, Car, Fuel, Calendar, Gauge, Palette, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars } = useCars();
  const { user } = useAuth();

  const car = cars.find(c => String(c.id) === id);

  if (!car) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Car className="h-16 w-16 text-gray-200 dark:text-gray-700" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Vehicle Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-xs">We couldn't find the car you were looking for.</p>
        <Button onClick={() => navigate('/admin/cars')}>Back to Inventory</Button>
      </div>
    );
  }

  const specs = [
    { label: "Engine", value: car.specs?.engine || "N/A", icon: <Fuel className="h-4 w-4" /> },
    { label: "Model Year", value: car.modelYear, icon: <Calendar className="h-4 w-4" /> },
    { label: "Mileage", value: car.specs?.mileage || "0" + " km", icon: <Gauge className="h-4 w-4" /> },
    { label: "Color", value: car.specs?.color || "N/A", icon: <Palette className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6 animate-in">
      <button onClick={() => navigate('/admin/cars')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600 hover:text-brand-primary dark:hover:text-brand-primary transition-all group">
        <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Inventory
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="overflow-hidden border border-zinc-100 dark:border-zinc-900 shadow-xl rounded-2xl">
            <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-900 group">
              <img src={car.images?.[0] || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200"} alt={car.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-6 left-6 flex gap-3">
                <span className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-[0.15em] shadow-lg ${car.status === 'Available' ? 'bg-brand-primary text-white' : 'bg-brand-secondary text-white'}`}>{car.status}</span>
                <span className="bg-zinc-950/90 backdrop-blur-md px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-[0.15em] text-white shadow-lg border border-white/10">{car.brand}</span>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border border-zinc-100 dark:border-zinc-900 shadow-sm bg-white dark:bg-zinc-950 rounded-2xl">
              <CardHeader className="pb-4 border-b border-zinc-50 dark:border-zinc-900 flex flex-row items-center justify-between pt-6 px-6">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-400">Technical Attributes</CardTitle>
                <Car className="h-4 w-4 text-brand-primary" />
              </CardHeader>
              <CardContent className="pt-6 grid grid-cols-2 gap-y-8 gap-x-6 px-6 pb-8">
                {specs.map((spec, i) => (
                  <div key={i} className="space-y-2">
                    <p className="text-[9px] text-zinc-400 dark:text-zinc-600 font-black uppercase tracking-[0.1em] flex items-center gap-2">{spec.icon} {spec.label}</p>
                    <p className="font-bold text-sm text-gray-900 dark:text-zinc-100 truncate">{spec.value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border border-zinc-900 bg-zinc-950 text-white overflow-hidden relative rounded-2xl">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none rotate-12"><ShieldCheck className="h-32 w-32" /></div>
              <CardHeader className="pb-2 pt-6 px-6"><CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-brand-primary">Premier Certification</CardTitle></CardHeader>
              <CardContent className="space-y-5 px-6 pb-8">
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">Exhaustive mechanical validation and provenance verification for every showcase asset.</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-tight text-white/90"><CheckCircle2 className="h-3.5 w-3.5 text-brand-primary" /> Comprehensive Warranty</div>
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-tight text-white/90"><CheckCircle2 className="h-3.5 w-3.5 text-brand-primary" /> Elite Roadside Service</div>
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-tight text-white/90"><CheckCircle2 className="h-3.5 w-3.5 text-brand-primary" /> Verified History Dossier</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border border-zinc-100 dark:border-zinc-900 shadow-2xl bg-white dark:bg-zinc-950 sticky top-6 rounded-2xl">
            <CardContent className="pt-8 space-y-8 px-8 pb-10">
              <div className="space-y-2">
                <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-100 tracking-tighter leading-none">{car.name}</h1>
                <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">{car.brand} • {car.modelYear} Specification</p>
              </div>
              <div className="pt-8 border-t border-zinc-50 dark:border-zinc-900">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-600 font-black uppercase tracking-widest">Sailing Price</p>
                  <p className="text-[10px] text-brand-primary font-black uppercase px-2 py-0.5 bg-brand-primary/5 rounded-md border border-brand-primary/10 tracking-widest">MSRP ${car.officialPrice?.toLocaleString()}</p>
                </div>
                <p className="text-5xl font-black text-brand-primary tracking-tighter leading-none">${car.sellingPrice?.toLocaleString()}</p>
                <p className="text-[9px] text-zinc-400 dark:text-zinc-600 mt-4 font-bold uppercase tracking-widest bg-zinc-50 dark:bg-zinc-900/50 p-2.5 rounded-md flex items-center gap-2 border border-zinc-100 dark:border-zinc-800">Operational taxes and registration excluded.</p>
              </div>
              <div className="space-y-4 pt-2">
                <Button className="w-full text-[11px] font-black uppercase tracking-[0.25em] py-7 rounded-xl shadow-lg ring-1 ring-white/10" size="lg" onClick={() => navigate('/admin/cars')}>Manage Inventory</Button>
                <p className="text-center text-[9px] text-zinc-400 font-bold uppercase tracking-widest italic">
                  {car.status === 'Available' ? 'Logistics ready for immediate delivery.' : 'Asset currently unavailable for purchase.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
