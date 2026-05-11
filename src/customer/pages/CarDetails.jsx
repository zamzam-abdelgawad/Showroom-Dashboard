import { useParams, useNavigate } from "react-router-dom";
import { useCustomerCars } from "../context/CustomerCarsContext";
import { useCustomerRequests } from "../context/CustomerRequestsContext";
import { useAuth } from "../../shared/context/AuthContext";
import { useToast } from "../../shared/context/ToastContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/components/ui/Card";
import { Button } from "../../shared/components/ui/Button";
import { Skeleton } from "../../shared/components/ui/Skeleton";
import { AnimatedButton } from "../../shared/components/animations/AnimatedButton";
import { SmoothAccordion } from "../../shared/components/animations/SmoothAccordion";
import { ChevronLeft, Car, Fuel, Calendar, Gauge, Palette, ShieldCheck, CheckCircle2, ShoppingCart, Package } from "lucide-react";
import { useState } from "react";

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, loading: carsLoading } = useCustomerCars();
  const { requests, addRequest, loading: requestsLoading } = useCustomerRequests();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (carsLoading || (user && requestsLoading)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <Skeleton className="h-4 w-32 rounded-md" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2"><Skeleton className="h-[500px] w-full rounded-2xl" /></div>
          <div><Skeleton className="h-[400px] w-full rounded-2xl" /></div>
        </div>
      </div>
    );
  }

  const car = cars.find(c => String(c.id) === id);

  if (!car) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6">
        <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-full shadow-inner">
          <Car className="h-20 w-20 text-zinc-200 dark:text-zinc-800" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tighter">Asset Displaced</h2>
        <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-[0.2em] text-center max-w-xs leading-loose">We were unable to locate the requested <br /> vehicle in our current active register.</p>
        <AnimatedButton onClick={() => navigate('/')} className="rounded-xl px-10 py-6 text-[11px] font-black uppercase tracking-[0.2em]">Return to Collection</AnimatedButton>
      </div>
    );
  }

  const hasExistingRequest = user && requests.some(r => r.carId === car.id && r.status === 'pending');
  const isOutOfStock = (car.count ?? 0) <= 0;
  const isAvailable = car.status === 'Available' && !isOutOfStock;

  const handleBuyRequest = async () => {
    if (!user) {
      navigate(`/login`, { state: { from: `/cars/${id}` } });
      return;
    }

    if (hasExistingRequest) {
      addToast("You have already submitted a request for this vehicle.", "info");
      return;
    }

    setIsSubmitting(true);
    try {
      await addRequest(user.uid, car.id);
      addToast("Request submitted successfully.", "success");
    } catch (err) {
      // error handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const specs = [
    { label: "Engine", value: car.specs?.engine || "N/A", icon: <Fuel className="h-4 w-4" /> },
    { label: "Model Year", value: car.modelYear, icon: <Calendar className="h-4 w-4" /> },
    { label: "Mileage", value: (car.specs?.mileage || "0") + " km", icon: <Gauge className="h-4 w-4" /> },
    { label: "Color", value: car.specs?.color || "N/A", icon: <Palette className="h-4 w-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-in bg-zinc-50/30 dark:bg-zinc-950/30 min-h-screen">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 hover:text-brand-primary dark:hover:text-brand-primary transition-all group">
        <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Collection
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <Card className="overflow-hidden border border-zinc-100 dark:border-zinc-900 shadow-2xl rounded-3xl">
            <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-900 group">
              <img
                src={car.images?.[0] || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200"}
                alt={car.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale-[0.2] group-hover:grayscale-0"
              />
              <div className="absolute top-6 left-6 flex gap-3">
                <span className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl backdrop-blur-md border border-white/10 ${
                  isAvailable ? 'bg-brand-primary text-white' : 'bg-zinc-900 text-zinc-400'
                }`}>{isAvailable ? 'Available' : isOutOfStock ? 'Sold Out' : 'Sold'}</span>
                <span className="bg-zinc-950/90 backdrop-blur-md px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-2xl border border-white/10">{car.brand}</span>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SmoothAccordion title={<span className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em]"><Car className="h-4 w-4 text-brand-primary" /> Technical Dossier</span>} defaultOpen={true}>
              <div className="grid grid-cols-2 gap-y-10 gap-x-6 pt-6 pb-4">
                {specs.map((spec, i) => (
                  <div key={i} className="space-y-2.5">
                    <p className="text-[9px] text-zinc-400 dark:text-zinc-600 font-black uppercase tracking-widest flex items-center gap-2">{spec.icon} {spec.label}</p>
                    <p className="font-black text-sm text-gray-900 dark:text-zinc-100 truncate tracking-tight">{spec.value}</p>
                  </div>
                ))}
              </div>
            </SmoothAccordion>

            <Card className="border border-zinc-950 bg-zinc-950 text-white overflow-hidden relative rounded-2xl shadow-xl">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none rotate-12"><ShieldCheck className="h-32 w-32" /></div>
              <CardHeader className="pb-2 pt-6 px-6"><CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-primary">Premier Certification</CardTitle></CardHeader>
              <CardContent className="space-y-6 px-6 pb-10">
                <p className="text-xs text-zinc-400 leading-relaxed font-medium uppercase tracking-wide">Validated through our 150-point technical protocol for absolute performance assurance.</p>
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-zinc-100"><CheckCircle2 className="h-3.5 w-3.5 text-brand-primary" /> Extended Protocol Warranty</div>
                  <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-zinc-100"><CheckCircle2 className="h-3.5 w-3.5 text-brand-primary" /> Elite Extraction Support</div>
                  <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-zinc-100"><CheckCircle2 className="h-3.5 w-3.5 text-brand-primary" /> Verified Origin Dossier</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-8">
          <Card className="border border-zinc-100 dark:border-zinc-900 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] bg-white dark:bg-zinc-950 sticky top-24 rounded-3xl">
            <CardContent className="pt-10 space-y-10 px-8 pb-12">
              <div className="space-y-3">
                <h1 className="text-4xl font-black text-gray-900 dark:text-zinc-100 tracking-tighter leading-tight uppercase">{car.name}</h1>
                <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em]">Brand: {car.brand} • Model Year: {car.modelYear}</p>
              </div>
              <div className="pt-10 border-t border-zinc-50 dark:border-zinc-900">
                <p className="text-[9px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3">Price</p>
                <p className="text-5xl font-black text-brand-primary tracking-tighter leading-none">${car.sellingPrice?.toLocaleString()}</p>
                <p className="text-[9px] text-zinc-400 dark:text-zinc-600 mt-6 font-bold uppercase tracking-[0.1em] bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 leading-relaxed">
                  Taxes and registration excluded.
                </p>
              </div>
              <div className="flex items-center justify-between py-4 border-t border-zinc-50 dark:border-zinc-900">
                <span className="flex items-center gap-2 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                  <Package className="h-3.5 w-3.5" /> Stock
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-black ${
                  !isOutOfStock
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                    : 'bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400'
                }`}>
                  {!isOutOfStock ? `${car.count} in stock` : 'Out of stock'}
                </span>
              </div>
              <div className="space-y-5 pt-4">
                {isAvailable ? (
                  hasExistingRequest ? (
                    <AnimatedButton className="w-full h-16 text-[11px] font-black uppercase tracking-[0.25em] rounded-2xl" disabled>
                      <CheckCircle2 className="h-4 w-4 mr-3" /> Request Pending
                    </AnimatedButton>
                  ) : (
                    <AnimatedButton
                      className="w-full h-16 text-[11px] font-black uppercase tracking-[0.25em] rounded-2xl shadow-xl shadow-brand-primary/20"
                      onClick={handleBuyRequest}
                      isLoading={isSubmitting}
                      variant="primary"
                    >
                      <ShoppingCart className="h-4 w-4 mr-3" /> Buy Now
                    </AnimatedButton>
                  )
                ) : (
                  <AnimatedButton className="w-full h-16 text-[11px] font-black uppercase tracking-[0.25em] rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 cursor-not-allowed" disabled>
                    {isOutOfStock ? 'Out of Stock' : 'Sold'}
                  </AnimatedButton>
                )}
                
                {/* Floating Bottom Bar for Mobile */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-100 dark:border-zinc-900 z-50 animate-in slide-in-from-bottom duration-700 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                  <div className="flex items-center justify-between gap-6 max-w-7xl mx-auto">
                    <div className="flex flex-col space-y-0.5">
                      <span className="text-[8px] text-zinc-400 font-black uppercase tracking-widest">Price</span>
                      <span className="text-xl font-black text-brand-primary tracking-tighter">${car.sellingPrice?.toLocaleString()}</span>
                    </div>
                    {isAvailable ? (
                      <AnimatedButton
                        className="flex-1 max-w-[220px] h-12 text-[10px] font-black uppercase tracking-widest rounded-xl"
                        onClick={handleBuyRequest}
                        isLoading={isSubmitting}
                        disabled={hasExistingRequest}
                        variant={hasExistingRequest ? "secondary" : "primary"}
                      >
                        {hasExistingRequest ? "Recorded" : "Buy Now"}
                      </AnimatedButton>
                    ) : (
                      <Button disabled variant="secondary" className="flex-1 max-w-[220px] h-12 text-[10px] font-black uppercase tracking-widest rounded-xl">
                        {isOutOfStock ? 'Out of Stock' : 'Sold'}
                      </Button>
                    )}
                  </div>
                </div>

                <p className="text-center text-[9px] font-black text-zinc-400 uppercase tracking-widest italic pt-2">
                  {isAvailable ? 'Ready for 5-7 day deployment.' : 'Asset currently unavailable for engagement.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
