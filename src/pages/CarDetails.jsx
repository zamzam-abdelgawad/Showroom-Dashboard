import { useParams, useNavigate } from "react-router-dom";
import { useCars } from "../context/CarsContext";
import { useAuth } from "../context/AuthContext";
import { useRequests } from "../context/RequestsContext";
import { useToast } from "../context/ToastContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ChevronLeft, Car, Fuel, Calendar, Gauge, Palette, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars } = useCars();
  const { user } = useAuth();
  const { addRequest, requests } = useRequests();
  const { addToast } = useToast();
  
  const car = cars.find(c => c.id === parseInt(id));
  const isAdmin = user?.role === 'admin';
  const [submitting, setSubmitting] = useState(false);

  if (!car) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Car className="h-16 w-16 text-gray-200" />
        <h2 className="text-2xl font-bold text-gray-900">Vehicle Not Found</h2>
        <p className="text-gray-500 text-center max-w-xs">We couldn't find the car you were looking for. It might have been removed or sold recently.</p>
        <Button onClick={() => navigate('/cars')}>Back to Inventory</Button>
      </div>
    );
  }

  const userRequest = requests.find(r => r.carId === car.id && r.userId === user?.id);
  const isPending = userRequest?.status === 'pending';
  const isApproved = userRequest?.status === 'approved';
  // A user is blocked if they have a pending or approved request. 
  // If their request was rejected, they can try again.
  const isBlocked = isPending || isApproved;

  const handleBuyRequest = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setSubmitting(true);
    try {
      await addRequest(user.id, car.id);
      addToast("Request submitted successfully! Our sales team will contact you shortly.", "success");
    } catch (err) {
      addToast("Failed to submit request. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const specs = [
    { label: "Engine", value: car.specs?.engine || "N/A", icon: <Fuel className="h-4 w-4" /> },
    { label: "Model Year", value: car.modelYear, icon: <Calendar className="h-4 w-4" /> },
    { label: "Mileage", value: car.specs?.mileage || "0" + " km", icon: <Gauge className="h-4 w-4" /> },
    { label: "Color", value: car.specs?.color || "N/A", icon: <Palette className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6 animate-in">
      <button 
        onClick={() => navigate('/cars')}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Inventory
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image & Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-none shadow-lg">
            <div className="relative aspect-video bg-gray-100 group">
              <img 
                src={car.images?.[0] || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200"} 
                alt={car.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${
                  car.status === 'Available' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
                }`}>
                  {car.status}
                </span>
                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                  {car.brand}
                </span>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-md bg-white">
              <CardHeader className="pb-2 border-b border-gray-50 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Technical Specifications</CardTitle>
                <Car className="h-5 w-5 text-indigo-500" />
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-2 gap-y-6 gap-x-4">
                {specs.map((spec, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-xs text-gray-400 font-semibold uppercase flex items-center gap-1.5">
                      {spec.icon} {spec.label}
                    </p>
                    <p className="font-bold text-gray-900 truncate">{spec.value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-indigo-900 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck className="h-24 w-24" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-indigo-100">Dealership Certified</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-indigo-200">
                  Every vehicle in our showroom undergoes a 150-point inspection by factory-trained technicians to guarantee peak performance and safety.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="h-4 w-4 text-green-400" /> 12-Month/Unlimited Warranty
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="h-4 w-4 text-green-400" /> Roadside Assistance Included
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="h-4 w-4 text-green-400" /> Clean History Report
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="space-y-6">
          <Card className="border-none shadow-xl bg-white sticky top-6">
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-1">
                <h1 className="text-3xl font-black text-gray-900">{car.name}</h1>
                <p className="text-gray-500 text-sm font-medium">{car.brand} • {car.modelYear} Model</p>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="flex justify-between items-end mb-1">
                  <p className="text-sm text-gray-400 font-semibold uppercase">Selling Price</p>
                  {isAdmin && (
                    <p className="text-xs text-indigo-600 font-medium px-2 py-0.5 bg-indigo-50 rounded italic">MSRP: ${car.officialPrice?.toLocaleString()}</p>
                  )}
                </div>
                <p className="text-4xl font-extrabold text-indigo-600 tracking-tight">
                  ${car.sellingPrice?.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-2 font-medium bg-gray-50 p-2 rounded flex items-center gap-2">
                   Tax and registration fees calculated at checkout.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {!isAdmin && (
                  <Button 
                    className="w-full text-lg py-6 shadow-indigo-200 shadow-lg" 
                    size="lg"
                    disabled={car.status !== 'Available' || isBlocked || submitting}
                    onClick={handleBuyRequest}
                    isLoading={submitting}
                  >
                    {isApproved ? 'Successfully Purchased' :
                     car.status !== 'Available' ? 'Successfully Sold' : 
                     isPending ? 'Request Pending' : 
                     'Submit Purchase Request'}
                    {car.status === 'Available' && !isBlocked && <ArrowRight className="h-5 w-5 ml-2" />}
                  </Button>
                )}
                
                {isAdmin && (
                  <Button className="w-full text-lg py-6" size="lg" onClick={() => navigate('/cars')}>
                    Manage Inventory
                  </Button>
                )}
                
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
