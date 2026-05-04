import { useAuth } from "../../shared/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/components/ui/Card";
import { User, Mail, Shield, Calendar, Edit2 } from "lucide-react";
import { Modal } from "../../shared/components/ui/Modal";
import { Input } from "../../shared/components/ui/Input";
import { Button } from "../../shared/components/ui/Button";
import { useToast } from "../../shared/context/ToastContext";
import { useState } from "react";

export default function Profile() {
  const { user, updateUserProfile } = useAuth();
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

  const displayName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Admin User';
  const displayCreatedAt = user.createdAt ? (user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : new Date(user.createdAt).toLocaleDateString()) : 'April 2026';

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
        <p className="text-gray-500">Your account information.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-none shadow-md overflow-hidden bg-white">
          <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <CardContent className="pt-0 -mt-12 flex flex-col items-center text-center">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden shadow-lg">
                {user.image ? (
                  <img src={user.image} alt={displayName} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-white bg-green-500"></div>
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900 leading-tight">{displayName}</h2>
            <p className="text-gray-500 capitalize">{user.role}</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 border-none shadow-md bg-white">
          <CardHeader className="pb-2 flex flex-row flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-lg">Account Details</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleOpenEdit} className="text-indigo-600 hover:bg-indigo-50 font-medium px-3 rounded-lg">
              <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2"><User className="h-3 w-3" /> Full Name</label><p className="text-gray-900 font-medium">{displayName}</p></div>
              <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2"><Mail className="h-3 w-3" /> Email Address</label><p className="text-gray-900 font-medium">{user.email}</p></div>
              <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2"><Shield className="h-3 w-3" /> Account Role</label><p className="text-gray-900 font-medium capitalize">{user.role}</p></div>
              <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2"><Calendar className="h-3 w-3" /> Member Since</label><p className="text-gray-900 font-medium">{displayCreatedAt}</p></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Admin Profile">
        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Display Name</label>
            <Input 
              value={editFormData.name} 
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} 
              placeholder="Admin Name"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Profile Image</label>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200">
                {imagePreview || editFormData.image ? (
                  <img src={imagePreview || editFormData.image} alt="Preview" className="h-full w-full object-cover" />
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
