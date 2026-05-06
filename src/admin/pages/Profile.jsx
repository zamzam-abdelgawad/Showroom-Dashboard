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
        <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">Personal Workspace</h1>
        <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Administrative credentials and security profile.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border border-zinc-100 dark:border-zinc-900 shadow-sm overflow-hidden bg-white dark:bg-zinc-950 rounded-2xl">
          <div className="h-24 bg-brand-primary"></div>
          <CardContent className="pt-0 -mt-12 flex flex-col items-center text-center px-6 pb-8">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-4 border-white dark:border-zinc-950 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center overflow-hidden shadow-md">
                {user.image ? (
                  <img src={user.image} alt={displayName} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-10 w-10 text-zinc-400 dark:text-zinc-600" />
                )}
              </div>
              <div className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white dark:border-zinc-950 bg-emerald-500"></div>
            </div>
            <h2 className="mt-4 text-xs font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">{displayName}</h2>
            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">{user.role}</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 border border-zinc-100 dark:border-zinc-900 shadow-sm bg-white dark:bg-zinc-950 rounded-2xl">
          <CardHeader className="pb-2 flex flex-row flex-wrap items-center justify-between gap-2 border-b border-zinc-50 dark:border-zinc-900 pt-6 px-6">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-zinc-400">Security Credentials</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleOpenEdit} className="text-brand-primary hover:bg-brand-primary/10 font-black text-[10px] uppercase tracking-widest px-4 rounded-xl border border-transparent hover:border-brand-primary/20 transition-all">
              <Edit2 className="h-3.5 w-3.5 mr-2" /> Update Profile
            </Button>
          </CardHeader>
          <CardContent className="space-y-8 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-1.5"><label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.1em] flex items-center gap-2"><User className="h-3 w-3" /> Full Identity</label><p className="text-sm text-gray-900 dark:text-zinc-100 font-bold">{displayName}</p></div>
              <div className="space-y-1.5"><label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.1em] flex items-center gap-2"><Mail className="h-3 w-3" /> Digital Contact</label><p className="text-sm text-gray-900 dark:text-zinc-100 font-bold">{user.email}</p></div>
              <div className="space-y-1.5"><label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.1em] flex items-center gap-2"><Shield className="h-3 w-3" /> Authority Level</label><p className="text-sm text-brand-primary font-black uppercase tracking-tight">{user.role}</p></div>
              <div className="space-y-1.5"><label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.1em] flex items-center gap-2"><Calendar className="h-3 w-3" /> Onboarding Date</label><p className="text-sm text-gray-900 dark:text-zinc-100 font-bold">{displayCreatedAt}</p></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Update Admin Profile">
        <form onSubmit={handleSaveProfile} className="space-y-6 py-2">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Admin name</label>
            <Input 
              value={editFormData.name} 
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} 
              placeholder="Full Name"
              className="rounded-xl font-bold"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Set Image</label>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-zinc-50 dark:bg-zinc-900 flex-shrink-0 flex items-center justify-center overflow-hidden border border-zinc-100 dark:border-zinc-800">
                {imagePreview || editFormData.image ? (
                  <img src={imagePreview || editFormData.image} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-8 w-8 text-zinc-300" />
                )}
              </div>
              <div className="flex-1">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="block w-full text-[10px] text-zinc-500 dark:text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:border-zinc-100 dark:file:border-zinc-800 file:text-[9px] file:font-black file:uppercase file:tracking-widest file:bg-zinc-50 dark:file:bg-zinc-900 file:text-zinc-600 dark:file:text-zinc-400 hover:file:bg-brand-primary/[0.03] hover:file:text-brand-primary transition-all cursor-pointer"
                />
                <p className="text-[9px] text-zinc-400 dark:text-zinc-600 mt-2 italic font-medium">Standardized formats: JPG, PNG, WEBP (Max 2MB).</p>
              </div>
            </div>
          </div>
          <div className="pt-6 flex justify-end gap-3 border-t border-zinc-50 dark:border-zinc-900">
            <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)} className="text-[10px] font-black uppercase tracking-widest">Cancel</Button>
            <Button type="submit" isLoading={isSaving} className="text-[10px] font-black uppercase tracking-widest px-8 rounded-xl">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
