import { useAuth } from "../../shared/context/AuthContext";
import { useCustomerRequests } from "../context/CustomerRequestsContext";
import { useCustomerCars } from "../context/CustomerCarsContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/components/ui/Card";
import { Skeleton } from "../../shared/components/ui/Skeleton";
import { User, Mail, Shield, Calendar, Clock, Car, BadgeCheck, XCircle, ShoppingCart, CheckCircle, AlertCircle, Edit2, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../shared/components/ui/Modal";
import { Input } from "../../shared/components/ui/Input";
import { Button } from "../../shared/components/ui/Button";
import { useToast } from "../../shared/context/ToastContext";
import { useState } from "react";

export default function Profile() {
  const { user, updateUserProfile } = useAuth();
  const { requests, loading: reqLoading } = useCustomerRequests();
  const { cars } = useCustomerCars();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: "", image: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return null;

  const handleOpenEdit = () => {
setEditFormData({ name: user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "", image: user.image || "" });
    setImageFile(null);
    setImagePreview("");
    setIsEditModalOpen(true);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 250;
          const MAX_HEIGHT = 250;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
          } else {
            if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = error => reject(error);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let updatedData = { ...editFormData };
      
      if (imageFile) {
        const base64Image = await compressImage(imageFile);
        updatedData.image = base64Image;
      }

      await updateUserProfile(user.uid || user.firestoreId || user.id, updatedData);
      addToast("Profile updated successfully!", "success");
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Profile update error:", error);
      addToast(error.message || "Failed to update profile", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const enrichedRequests = requests.map(req => {
    const car = cars.find(c => c.id === req.carId);
    return { ...req, carName: car?.name || "Unknown Vehicle", carBrand: car?.brand || "N/A" };
  });

  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5"><BadgeCheck className="h-3.5 w-3.5" /> Approved</span>;
      case 'rejected': return <span className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5"><XCircle className="h-3.5 w-3.5" /> Rejected</span>;
      default: return <span className="bg-brand-primary/5 dark:bg-brand-primary/10 text-brand-primary px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Pending</span>;
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(enrichedRequests.length / itemsPerPage) || 1;
  const paginatedRequests = enrichedRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-in bg-zinc-50/30 dark:bg-zinc-950/30 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight">Personal Profile</h1>
        <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-200/50 dark:border-zinc-800 tracking-widest uppercase">
          Access Level: <span className="text-brand-primary ml-1">{user.role}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="md:col-span-1 border border-zinc-100 dark:border-zinc-900 shadow-2xl overflow-hidden bg-white dark:bg-zinc-950 rounded-3xl">
          <div className="h-32 bg-zinc-950 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05]" />
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-brand-primary/10 rounded-full blur-2xl" />
          </div>
          <CardContent className="pt-0 -mt-16 flex flex-col items-center text-center pb-10">
            <div className="relative">
              <div className="h-32 w-32 rounded-full border-4 border-white dark:border-zinc-950 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center overflow-hidden shadow-2xl relative z-10 transition-transform duration-700 group-hover:scale-105">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="h-full w-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all" />
                ) : (
                  <User className="h-16 w-16 text-zinc-300 dark:text-zinc-700" />
                )}
              </div>
              <div className="absolute bottom-2 right-2 h-6 w-6 rounded-full border-4 border-white dark:border-zinc-950 bg-brand-primary z-20 shadow-xl" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight leading-tight">{user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email}</h2>
            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-500 mt-2 uppercase tracking-widest">{user.role} Account</p>
          </CardContent>
        </Card>

        {/* Account Details Card */}
        <Card className="md:col-span-2 border border-zinc-100 dark:border-zinc-900 shadow-2xl bg-white dark:bg-zinc-950 rounded-3xl">
          <CardHeader className="pb-4 pt-8 px-8 flex flex-row items-center justify-between border-b border-zinc-100 dark:border-zinc-900">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Identification Info</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleOpenEdit} className="text-brand-primary hover:bg-brand-primary/5 text-xs font-bold uppercase tracking-widest px-4 rounded-xl border border-brand-primary/20">
              <Edit2 className="h-3.5 w-3.5 mr-2" /> Modify
            </Button>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-2"><User className="h-3.5 w-3.5 text-brand-primary opacity-70" /> Identity Name</label>
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-900/50 px-5 py-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-900 shadow-inner tracking-tight">{user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email}</div>
              </div>
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-brand-primary opacity-70" /> Mailing Address</label>
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-900/50 px-5 py-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-900 shadow-inner tracking-tight">{user.email}</div>
              </div>
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Shield className="h-3.5 w-3.5 text-brand-primary opacity-70" /> Clearance Level</label>
                <div className="text-sm font-bold text-brand-primary bg-brand-primary/5 px-5 py-4 rounded-2xl border border-brand-primary/10 transition-all hover:bg-brand-primary/10 shadow-inner tracking-tight uppercase">{user.role}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

{/* Stats Row */}
<div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
  <Card className="border border-zinc-100 dark:border-zinc-900 shadow-xl bg-white dark:bg-zinc-950 rounded-2xl">
    <CardContent className="p-6 flex items-center gap-5">
      <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-2xl shadow-inner group transition-all hover:bg-brand-primary/10">
        <ShoppingCart className="h-5 w-5 text-zinc-400 dark:text-zinc-600 group-hover:text-brand-primary" />
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight leading-none">{requests.length}</p>
        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-2">Request Log</p>
      </div>
    </CardContent>
  </Card>

  <Card className="border border-zinc-100 dark:border-zinc-900 shadow-xl bg-white dark:bg-zinc-950 rounded-2xl">
    <CardContent className="p-6 flex items-center gap-5">
      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl shadow-inner">
        <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
      </div>
      <div>
        <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-500 tracking-tightest leading-none">{approvedCount}</p>
        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-2">Accepted</p>
      </div>
    </CardContent>
  </Card>

  <Card className="border border-zinc-100 dark:border-zinc-900 shadow-xl bg-white dark:bg-zinc-950 rounded-2xl">
    <CardContent className="p-6 flex items-center gap-5">
      <div className="p-4 bg-brand-primary/5 dark:bg-brand-primary/10 rounded-2xl shadow-inner">
        <AlertCircle className="h-5 w-5 text-brand-primary" />
      </div>
      <div>
        <p className="text-3xl font-bold text-brand-primary tracking-tightest leading-none">{pendingCount}</p>
        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-2">Pending</p>
      </div>
    </CardContent>
  </Card>

  <Card className="border border-zinc-100 dark:border-zinc-900 shadow-xl bg-white dark:bg-zinc-950 rounded-2xl">
    <CardContent className="p-6 flex items-center gap-5">
      <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-2xl shadow-inner">
        <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
      </div>
      <div>
        <p className="text-3xl font-bold text-red-600 dark:text-red-400 tracking-tightest leading-none">{rejectedCount}</p>
        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-2">Rejected</p>
      </div>
    </CardContent>
  </Card>
</div>

      {/* My Requests */}
      <Card className="border border-zinc-100 dark:border-zinc-900 shadow-2xl bg-white dark:bg-zinc-950 rounded-3xl overflow-hidden">
        <CardHeader className="px-8 py-8 border-b border-zinc-50 dark:border-zinc-900 flex flex-row items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/30">
          <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-3 text-zinc-500">
            <Car className="h-4 w-4 text-brand-primary opacity-80" /> Interaction Log
          </CardTitle>
          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{requests.length} interactions</span>
        </CardHeader>
        <CardContent className="p-0">
          {reqLoading ? (
            <div className="p-10 space-y-6">
              {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-900" />)}
            </div>
          ) : enrichedRequests.length === 0 ? (
            <div className="text-center py-24 px-8">
              <div className="bg-zinc-50 dark:bg-zinc-900/50 p-8 rounded-full inline-block mb-6 shadow-inner">
                <Car className="h-16 w-16 text-zinc-200 dark:text-zinc-800" />
              </div>
              <p className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">No activities recorded</p>
              <p className="text-xs text-zinc-400/80 font-normal mt-2">Explore the <button onClick={() => navigate('/')} className="text-brand-primary font-semibold hover:underline underline-offset-4">Asset Catalog</button> to initiate procurement.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="bg-zinc-50/80 dark:bg-zinc-900/80 text-xs font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800">
                    <tr>
                      <th className="px-8 py-5">Vehicle Inventory</th>
                      <th className="px-8 py-5">Request Date</th>
                      <th className="px-8 py-5">Operational Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                    {paginatedRequests.map(req => (
                      <tr key={req.firestoreId} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all duration-300 cursor-pointer" onClick={() => navigate(`/cars/${req.carId}`)}>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-brand-primary transition-colors tracking-tight">{req.carName}</span>
                            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider mt-1">{req.carBrand}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-xs font-black text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-brand-primary/50" />
                          {new Date(req.timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-6">
                          {req.status === 'approved' && <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border border-emerald-100 dark:border-emerald-900/50">Approved</span>}
                          {req.status === 'rejected' && <span className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border border-red-100 dark:border-red-900/50">Rejected</span>}
                          {req.status === 'pending' && <span className="bg-brand-primary/5 dark:bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border border-brand-primary/20">Pending</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Controls */}
              <div className="px-8 py-5 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between bg-zinc-50/30 dark:bg-zinc-900/30">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Page {currentPage} of {totalPages}</span>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                    disabled={currentPage === 1}
                    className="h-9 w-9 p-0 rounded-xl border-zinc-200 dark:border-zinc-800"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                    disabled={currentPage === totalPages}
                    className="h-9 w-9 p-0 rounded-xl border-zinc-200 dark:border-zinc-800"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Modify Profile Intelligence">
        <form onSubmit={handleSaveProfile} className="space-y-8 py-4">
          <div className="space-y-3">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Account Identity Name</label>
            <Input 
              value={editFormData.name} 
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} 
              placeholder="Full Name"
              required
              className="rounded-2xl h-14 bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-sm font-medium focus:ring-brand-primary"
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Profile Portrait</label>
            <div className="flex items-center gap-6 p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-inner">
              <div className="h-20 w-20 rounded-full bg-white dark:bg-zinc-950 flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-zinc-200 dark:border-zinc-800 shadow-xl">
                {imagePreview || editFormData.image ? (
                  <img src={imagePreview || editFormData.image} alt="Profile preview" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-10 w-10 text-zinc-300 dark:text-zinc-700" />
                )}
              </div>
              <div className="flex-1 space-y-3">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="block w-full text-xs text-zinc-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-semibold file:uppercase file:bg-brand-primary file:text-white hover:file:opacity-90 transition-all cursor-pointer"
                  />
                  <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide">JPG, PNG, GIF formats supported.</p>
              </div>
            </div>
          </div>
          <div className="pt-8 flex justify-end gap-4 border-t border-zinc-100 dark:border-zinc-900">
            <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)} className="text-xs font-semibold uppercase tracking-wider">Cancel</Button>
            <Button type="submit" isLoading={isSaving} className="bg-brand-primary hover:bg-brand-primary/90 text-white shadow-2xl shadow-brand-primary/20 text-xs font-semibold uppercase tracking-wider px-8 rounded-xl h-12">Update Profile</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
