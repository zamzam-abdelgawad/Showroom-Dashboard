import { useAuth } from "../../shared/context/AuthContext";
import { useCustomerRequests } from "../context/CustomerRequestsContext";
import { useCustomerCars } from "../context/CustomerCarsContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/components/ui/Card";
import { Skeleton } from "../../shared/components/ui/Skeleton";
import { User, Mail, Shield, Calendar, Clock, Car, BadgeCheck, XCircle, ShoppingCart, CheckCircle, AlertCircle, Edit2 } from "lucide-react";
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
    setEditFormData({ name: user.name || user.firstName || "", image: user.image || "" });
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"><BadgeCheck className="h-3 w-3" /> Approved</span>;
      case 'rejected': return <span className="bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> Rejected</span>;
      default: return <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1 border-none shadow-md overflow-hidden bg-white">
          <div className="h-28 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative">
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
          </div>
          <CardContent className="pt-0 -mt-14 flex flex-col items-center text-center">
            <div className="relative">
              <div className="h-28 w-28 rounded-full border-4 border-white bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center overflow-hidden shadow-lg">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-14 w-14 text-gray-400" />
                )}
              </div>
              <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-white bg-emerald-500" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">{user.name || user.email}</h2>
            <p className="text-gray-500 capitalize text-sm mt-0.5">{user.role}</p>
          </CardContent>
        </Card>

        {/* Account Details Card */}
        <Card className="md:col-span-2 border-none shadow-md bg-white">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Account Details</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleOpenEdit} className="text-indigo-600 hover:bg-indigo-50 font-medium px-3 rounded-lg">
              <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5 group">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2"><User className="h-3 w-3" /> Name</label>
                <p className="text-gray-900 font-medium bg-gray-50 px-4 py-2.5 rounded-xl group-hover:bg-gray-100 transition-colors">{user.name || "Not set"}</p>
              </div>
              <div className="space-y-1.5 group">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2"><Mail className="h-3 w-3" /> Email</label>
                <p className="text-gray-900 font-medium bg-gray-50 px-4 py-2.5 rounded-xl group-hover:bg-gray-100 transition-colors">{user.email}</p>
              </div>
              <div className="space-y-1.5 group">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2"><Shield className="h-3 w-3" /> Role</label>
                <p className="text-gray-900 font-medium capitalize bg-gray-50 px-4 py-2.5 rounded-xl group-hover:bg-gray-100 transition-colors">{user.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <ShoppingCart className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{requests.length}</p>
              <p className="text-xs text-gray-500 font-medium">Total Requests</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{approvedCount}</p>
              <p className="text-xs text-gray-500 font-medium">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{pendingCount}</p>
              <p className="text-xs text-gray-500 font-medium">Pending</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Requests */}
      <Card className="border-none shadow-md bg-white">
        <CardHeader className="border-b border-gray-100 flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Car className="h-5 w-5 text-indigo-600" /> My Buy Requests
          </CardTitle>
          <span className="text-xs text-gray-400 font-medium">{requests.length} total</span>
        </CardHeader>
        <CardContent className="p-0">
          {reqLoading ? (
            <div className="p-6 space-y-4">
              {[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : enrichedRequests.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="bg-gray-50 p-4 rounded-2xl inline-block mb-4">
                <Car className="h-12 w-12 text-gray-200" />
              </div>
              <p className="text-gray-500 font-medium">No buy requests yet</p>
              <p className="text-gray-400 text-sm mt-1">Browse our <button onClick={() => navigate('/')} className="text-indigo-600 hover:underline font-medium">catalog</button> to find your dream car.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-50/80 text-gray-400 font-bold uppercase tracking-wider text-[11px] border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Vehicle</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {enrichedRequests.map(req => (
                    <tr key={req.firestoreId} className="hover:bg-indigo-50/30 transition-all duration-200 cursor-pointer" onClick={() => navigate(`/cars/${req.carId}`)}>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{req.carName}</span>
                          <span className="text-[11px] text-gray-400 uppercase tracking-tighter">{req.carBrand}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-gray-300" />
                        {new Date(req.timestamp).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Profile">
        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Display Name</label>
            <Input 
              value={editFormData.name} 
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} 
              placeholder="Your full name"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Profile Image</label>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200">
                {imagePreview || editFormData.image ? (
                  <img src={imagePreview || editFormData.image} alt="Profile preview" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors"
                />
                <p className="text-[10px] text-gray-400 mt-1">Upload a JPG, PNG, or GIF file.</p>
              </div>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
