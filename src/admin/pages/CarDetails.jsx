import { useParams, useNavigate } from "react-router-dom";
import { useCars } from "../context/CarsContext";
import { useAuth } from "../../shared/context/AuthContext";
import { useRequests } from "../context/RequestsContext";
import { useToast } from "../../shared/context/ToastContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/components/ui/Card";
import { Button } from "../../shared/components/ui/Button";
import { ChevronLeft, Car, Fuel, Calendar, Gauge, Palette, ShieldCheck, CheckCircle2, Package, RefreshCw, DollarSign, Layers } from "lucide-react";
import { useState } from "react";
import { Modal } from "../../shared/components/ui/Modal";
import { Input } from "../../shared/components/ui/Input";

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, updateCar } = useCars();
  const { user } = useAuth();
  const { addToast } = useToast();

  const car = cars.find(c => String(c.id) === id);

  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [restockQty, setRestockQty] = useState("");
  const [restockPrice, setRestockPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRestock = async (e) => {
    e.preventDefault();
    if (!restockQty || !restockPrice) return;

    setIsSubmitting(true);
    try {
      await updateCar(car.id, {
        count: parseInt(restockQty),
        sellingPrice: parseFloat(restockPrice),
        status: "Available"
      });
      addToast("Asset restocked and selling price updated.", "success");
      setIsRestockOpen(false);
      setRestockQty("");
      setRestockPrice("");
    } catch (err) {
      addToast("Failed to restock asset.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <button onClick={() => navigate('/admin/cars')} className="flex items-center gap-2 text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-brand-primary dark:hover:text-brand-primary transition-all group uppercase tracking-widest">
        <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Inventory
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="overflow-hidden border border-zinc-100 dark:border-zinc-900 shadow-xl rounded-2xl">
            <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-900 group">
              <img src={car.images?.[0] || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200"} alt={car.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-6 left-6 flex gap-3">
                <span className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg ${car.status === 'Available' ? 'bg-brand-primary text-white' : 'bg-zinc-800 text-white'}`}>{car.status}</span>
                <span className="bg-zinc-950/90 backdrop-blur-md px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white shadow-lg border border-white/10">{car.brand}</span>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border border-zinc-100 dark:border-zinc-900 shadow-sm bg-white dark:bg-zinc-950 rounded-2xl">
              <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-900 flex flex-row items-center justify-between pt-6 px-6">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Technical Attributes</CardTitle>
                <Car className="h-4 w-4 text-brand-primary opacity-70" />
              </CardHeader>
              <CardContent className="pt-8 grid grid-cols-2 gap-y-10 gap-x-6 px-8 pb-10">
                {specs.map((spec, i) => (
                  <div key={i} className="space-y-2">
                    <p className="text-xs text-zinc-500 dark:text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-2">{spec.icon} {spec.label}</p>
                    <p className="font-bold text-sm text-gray-900 dark:text-zinc-100 truncate tracking-tight">{spec.value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border border-zinc-900 bg-zinc-950 text-white overflow-hidden relative rounded-2xl">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none rotate-12"><ShieldCheck className="h-32 w-32" /></div>
              <CardHeader className="pb-2 pt-6 px-6"><CardTitle className="text-xs font-bold uppercase tracking-widest text-brand-primary">Premier Certification</CardTitle></CardHeader>
              <CardContent className="space-y-5 px-6 pb-8">
                <p className="text-sm text-zinc-400 leading-relaxed font-normal">Exhaustive mechanical validation and provenance verification for every showcase asset.</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs font-semibold text-white/90"><CheckCircle2 className="h-3.5 w-3.5 text-brand-primary" /> Comprehensive Warranty</div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-white/90"><CheckCircle2 className="h-3.5 w-3.5 text-brand-primary" /> Elite Roadside Service</div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-white/90"><CheckCircle2 className="h-3.5 w-3.5 text-brand-primary" /> Verified History Dossier</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border border-zinc-100 dark:border-zinc-900 shadow-2xl bg-white dark:bg-zinc-950 sticky top-6 rounded-2xl">
            <CardContent className="pt-8 space-y-8 px-8 pb-10">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 tracking-tightest leading-none">{car.name}</h1>
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">{car.brand} • {car.modelYear} Specification</p>
              </div>
              <div className="pt-8 border-t border-zinc-50 dark:border-zinc-900">
                <div className="flex justify-between items-end mb-3">
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 font-bold uppercase tracking-widest">Selling Price</p>
                  <p className="text-[10px] text-brand-primary font-bold uppercase px-2 py-0.5 bg-brand-primary/10 rounded-md border border-brand-primary/20 tracking-wider">MSRP ${car.officialPrice?.toLocaleString()}</p>
                </div>
                <p className="text-5xl font-bold text-brand-primary tracking-tightest leading-none">${car.sellingPrice?.toLocaleString()}</p>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-6 font-medium bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-xl flex items-center gap-2 border border-zinc-100 dark:border-zinc-800 leading-relaxed">Taxation and registration formalities excluded from this valuation.</p>
              </div>
              <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                  <Package className="h-3.5 w-3.5 opacity-60" /> Inventory
                </span>
                <span className={`inline-flex items-center justify-center min-w-[2.5rem] px-3 py-1 rounded-lg text-xs font-semibold ${(car.count ?? 0) > 0
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'
                  }`}>
                  {(car.count ?? 0) > 0 ? `${car.count} available` : 'Sold Out'}
                </span>
              </div>
              <div className="space-y-4 pt-4">
                {car.status === "Available" ? (
                  <Button
                    className="w-full text-xs font-bold uppercase tracking-widest py-7 rounded-xl shadow-xl shadow-brand-primary/10 border border-white/10 transition-all duration-300 hover:shadow-brand-primary/20"
                    size="lg"
                    onClick={() => navigate('/admin/cars')}
                  >
                    Inventory Control
                  </Button>
                ) : (
                  <Button
                    className="w-full text-xs font-bold uppercase tracking-widest py-7 rounded-xl shadow-xl shadow-emerald-500/10 border border-emerald-500/10 bg-emerald-500 hover:bg-emerald-600 text-white transition-all duration-300"
                    size="lg"
                    onClick={() => {
                      setRestockPrice(car.sellingPrice);
                      setIsRestockOpen(true);
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin-slow" /> Restock Asset
                  </Button>
                )}
                <p className="text-center text-[10px] text-zinc-500 dark:text-zinc-500 font-bold uppercase tracking-widest">
                  {car.status === 'Available' ? 'Ready for distribution.' : 'Asset currently depleted.'}
                </p>
              </div>

                <Modal
                  isOpen={isRestockOpen}
                  onClose={() => setIsRestockOpen(false)}
                  title="Asset Replenishment"
                >
                  <form onSubmit={handleRestock} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600">Stock Number</label>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Quantity to add..."
                          value={restockQty}
                          onChange={(e) => setRestockQty(e.target.value)}
                          className="rounded-xl border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 h-12"
                          required
                          leftElement={<Layers className="h-4 w-4 text-zinc-300" />}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600">Selling Price ($)</label>
                        <Input
                          type="number"
                          placeholder="New valuation..."
                          value={restockPrice}
                          onChange={(e) => setRestockPrice(e.target.value)}
                          className="rounded-xl border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 h-12"
                          required
                          leftElement={<DollarSign className="h-4 w-4 text-zinc-300" />}
                        />
                      </div>
                    </div>
                    <div className="pt-4 flex gap-3">
                      <Button
                        type="button"
                        variant="ghost"
                        className="flex-1 rounded-xl text-[10px] font-bold uppercase tracking-widest py-6 border border-zinc-50 dark:border-zinc-900"
                        onClick={() => setIsRestockOpen(false)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="flex-[2] rounded-xl text-[10px] font-bold uppercase tracking-widest py-6 bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Processing...' : 'Authorize Restock'}
                      </Button>
                    </div>
                  </form>
                </Modal>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
