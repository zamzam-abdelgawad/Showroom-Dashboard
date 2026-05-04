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
import { ChevronLeft, Car, Fuel, Calendar, Gauge, Palette, ShieldCheck, CheckCircle2, ShoppingCart } from "lucide-react";
import { useState } from "react";

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars, loading } = useCustomerCars();
  const { requests, addRequest } = useCustomerRequests();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2"><Skeleton className="h-[400px] w-full rounded-xl" /></div>
          <div><Skeleton className="h-[300px] w-full rounded-xl" /></div>
        </div>
      </div>
    );
  }

  const car = cars.find(c => String(c.id) === id);

  if (!car) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Car className="h-16 w-16 text-gray-200 dark:text-slate-800" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Vehicle Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-xs">We couldn't find the car you were looking for.</p>
        <AnimatedButton onClick={() => navigate('/')}>Back to Catalog</AnimatedButton>
      </div>
    );
  }

  const hasExistingRequest = user && requests.some(r => r.carId === car.id && r.status === 'pending');

  const handleBuyRequest = async () => {
    if (!user) {
      navigate(`/login`, { state: { from: `/cars/${id}` } });
      return;
    }

    if (hasExistingRequest) {
      addToast("You already have a pending request for this vehicle", "info");
      return;
    }

    setIsSubmitting(true);
    try {
      await addRequest(user.uid, car.id);
      addToast("Buy request submitted successfully!", "success");
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-none shadow-lg">
            <div className="relative aspect-video bg-gray-100 dark:bg-slate-800 group">
              <img
                src={car.images?.[0] || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200"}
                alt={car.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${
                  car.status === 'Available' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
                }`}>{car.status}</span>
                <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 dark:text-gray-100 shadow-sm">{car.brand}</span>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SmoothAccordion title={<span className="flex items-center gap-2"><Car className="h-5 w-5 text-indigo-500" /> Technical Specifications</span>} defaultOpen={true}>
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                {specs.map((spec, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-xs text-gray-400 font-semibold uppercase flex items-center gap-1.5">{spec.icon} {spec.label}</p>
                    <p className="font-bold text-gray-900 dark:text-gray-100 truncate">{spec.value}</p>
                  </div>
                ))}
              </div>
            </SmoothAccordion>

            <Card className="border-none shadow-md bg-indigo-900 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck className="h-24 w-24" /></div>
              <CardHeader className="pb-2"><CardTitle className="text-lg text-indigo-100">Dealership Certified</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-indigo-200">Every vehicle undergoes a 150-point inspection by factory-trained technicians.</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs"><CheckCircle2 className="h-4 w-4 text-green-400" /> 12-Month/Unlimited Warranty</div>
                  <div className="flex items-center gap-2 text-xs"><CheckCircle2 className="h-4 w-4 text-green-400" /> Roadside Assistance Included</div>
                  <div className="flex items-center gap-2 text-xs"><CheckCircle2 className="h-4 w-4 text-green-400" /> Clean History Report</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-xl bg-white dark:bg-slate-900 sticky top-24">
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-1">
                <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100">{car.name}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{car.brand} • {car.modelYear} Model</p>
              </div>
              <div className="pt-6 border-t border-gray-100 dark:border-slate-800">
                <p className="text-sm text-gray-400 font-semibold uppercase mb-1">Price</p>
                <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">${car.sellingPrice?.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-2 font-medium bg-gray-50 dark:bg-slate-800 p-2 rounded">
                  Tax and registration fees calculated at checkout.
                </p>
              </div>
              <div className="space-y-4 pt-2">
                {car.status === 'Available' ? (
                  hasExistingRequest ? (
                    <AnimatedButton className="w-full h-14 text-lg" disabled>
                      <CheckCircle2 className="h-5 w-5 mr-2" /> Request Pending
                    </AnimatedButton>
                  ) : (
                    <AnimatedButton
                      className="w-full h-14 text-lg"
                      onClick={handleBuyRequest}
                      isLoading={isSubmitting}
                      variant="primary"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" /> Buy Now
                    </AnimatedButton>
                  )
                ) : (
                  <AnimatedButton className="w-full h-14 text-lg" disabled variant="secondary">
                    Vehicle Sold
                  </AnimatedButton>
                )}
                
                {/* Floating Bottom Bar for Mobile */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-gray-100 dark:border-slate-800 z-50 animate-in slide-in-from-bottom duration-500">
                  <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total Price</span>
                      <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">${car.sellingPrice?.toLocaleString()}</span>
                    </div>
                    {car.status === 'Available' ? (
                      <AnimatedButton
                        className="flex-1 max-w-[200px]"
                        onClick={handleBuyRequest}
                        isLoading={isSubmitting}
                        disabled={hasExistingRequest}
                        variant={hasExistingRequest ? "secondary" : "primary"}
                      >
                        {hasExistingRequest ? "Pending" : "Buy Now"}
                      </AnimatedButton>
                    ) : (
                      <Button disabled variant="secondary" className="flex-1 max-w-[200px]">Sold</Button>
                    )}
                  </div>
                </div>

                <p className="text-center text-xs text-gray-400 font-medium">
                  {car.status === 'Available' ? 'Estimated delivery within 5-7 business days.' : 'This vehicle is no longer available.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
