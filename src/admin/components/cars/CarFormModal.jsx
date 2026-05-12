import { useState, useEffect, useRef } from "react";
import { Modal } from "../../../shared/components/ui/Modal";
import { Button } from "../../../shared/components/ui/Button";
import { Input } from "../../../shared/components/ui/Input";
import { storage } from "../../../shared/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ImagePlus, X, Loader2 } from "lucide-react";

import { Select } from "../../../shared/components/ui/Select";

export function CarFormModal({ isOpen, onClose, onSubmit, initialData = null, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: "", brand: "", officialPrice: "", sellingPrice: "",
    modelYear: "", status: "Available", engine: "", color: "", mileage: "", count: 1, images: []
  });
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || "", brand: initialData.brand || "",
          officialPrice: initialData.officialPrice || "", sellingPrice: initialData.sellingPrice || "",
          count: initialData.count ?? 1,
          modelYear: initialData.modelYear || "", status: initialData.status || "Available",
          engine: initialData.specs?.engine || "", color: initialData.specs?.color || "",
          mileage: initialData.specs?.mileage || "",
          images: initialData.images || []
        });
        if (initialData.images?.[0]) setImagePreview(initialData.images[0]);
      } else {
        setFormData({ name: "", brand: "", officialPrice: "", sellingPrice: "", modelYear: "", status: "Available", engine: "", color: "", mileage: "", count: 1, images: [] });
        setImagePreview(null);
      }
      setImageFile(null);
      setIsUploading(false);
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.brand.trim()) newErrors.brand = "Brand is required";
    if (!formData.officialPrice || isNaN(formData.officialPrice) || formData.officialPrice <= 0) newErrors.officialPrice = "Valid official price is required";
    if (!formData.sellingPrice || isNaN(formData.sellingPrice) || formData.sellingPrice <= 0) newErrors.sellingPrice = "Valid selling price is required";
    if (!formData.modelYear || isNaN(formData.modelYear) || formData.modelYear < 1900) newErrors.modelYear = "Valid year is required";
    if (formData.count === "" || isNaN(formData.count) || Number(formData.count) < 0) newErrors.count = "Valid count is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsUploading(true);
      let imageUrls = [...formData.images];

      try {
        if (imageFile) {
          const storageRef = ref(storage, `cars/${Date.now()}_${imageFile.name}`);
          const snapshot = await uploadBytes(storageRef, imageFile);
          const downloadURL = await getDownloadURL(snapshot.ref);
          imageUrls = [downloadURL]; // For now, we support one main image
        }

        const count = Number(formData.count);
        onSubmit({
          name: formData.name, brand: formData.brand,
          officialPrice: Number(formData.officialPrice), sellingPrice: Number(formData.sellingPrice),
          modelYear: Number(formData.modelYear), status: count === 0 ? "Sold" : "Available",
          count,
          images: imageUrls,
          specs: { engine: formData.engine, color: formData.color, mileage: formData.mileage }
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        // Handle error (maybe show a toast)
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Car" : "Add New Car"}>
      <form onSubmit={handleSubmit} className="space-y-8 max-h-[75vh] overflow-y-auto px-2 scrollbar-thin pr-3">
        <div className="space-y-3 cursor-default">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600">Vehicle Visualization</label>
          <div 
            onClick={() => !isUploading && !isSubmitting && fileInputRef.current?.click()}
            className={`relative aspect-video rounded-3xl border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center cursor-pointer group overflow-hidden
              ${imagePreview ? 'border-transparent bg-zinc-100/50 dark:bg-zinc-900/50 shadow-inner' : 'border-zinc-200 dark:border-zinc-800 hover:border-brand-primary bg-zinc-50/50 dark:bg-zinc-900/50'}
              ${(isUploading || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-white shadow-2xl scale-90 group-hover:scale-100 transition-transform"><ImagePlus className="h-6 w-6" /></div>
                  <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(); }} className="bg-red-500/90 backdrop-blur-md p-3 rounded-2xl text-white hover:bg-red-600 transition-colors shadow-2xl scale-90 group-hover:scale-100 transition-transform"><X className="h-6 w-6" /></button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center py-10">
                <div className="h-16 w-16 rounded-[2rem] bg-brand-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl shadow-brand-primary/5">
                  <ImagePlus className="h-8 w-8 text-brand-primary" />
                </div>
                <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em] mb-1">Select Media Assets</p>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">JPG, PNG, WEBP — High Resolution Preferred</p>
              </div>
            )}
            
            {(isUploading || isSubmitting) && (
              <div className="absolute inset-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md flex flex-col items-center justify-center z-10">
                <Loader2 className="h-10 w-10 text-brand-primary animate-spin mb-3" />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-primary animate-pulse">Synchronizing Data...</p>
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
              disabled={isUploading || isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 cursor-default">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 ml-1">Asset Nomenclature</label>
              <Input value={formData.name} onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))} error={errors.name} placeholder="e.g. M3 Competition" disabled={isSubmitting} className="rounded-2xl h-12 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-900" />
            </div>
            <div className="space-y-2 cursor-default">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 ml-1">Manufacturer</label>
              <Input value={formData.brand} onChange={(e) => setFormData(prev => ({...prev, brand: e.target.value}))} error={errors.brand} placeholder="e.g. BMW" disabled={isSubmitting} className="rounded-2xl h-12 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-900" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 cursor-default">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 ml-1">Market Value ($)</label>
              <Input type="number" value={formData.officialPrice} onChange={(e) => setFormData(prev => ({...prev, officialPrice: e.target.value}))} error={errors.officialPrice} placeholder="48000" disabled={isSubmitting} className="rounded-2xl h-12 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-900" />
            </div>
            <div className="space-y-2 cursor-default">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 ml-1">Acquisition Price ($)</label>
              <Input type="number" value={formData.sellingPrice} onChange={(e) => setFormData(prev => ({...prev, sellingPrice: e.target.value}))} error={errors.sellingPrice} placeholder="50000" disabled={isSubmitting} className="rounded-2xl h-12 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-900" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 cursor-default">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 ml-1">Lifecycle Year</label>
              <Input type="number" value={formData.modelYear} onChange={(e) => setFormData(prev => ({...prev, modelYear: e.target.value}))} error={errors.modelYear} placeholder="2024" disabled={isSubmitting} className="rounded-2xl h-12 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-900" />
            </div>
            <div className="space-y-2 cursor-default">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 ml-1">Available Units</label>
              <Input type="number" min="0" value={formData.count} onChange={(e) => setFormData(prev => ({...prev, count: e.target.value}))} error={errors.count} placeholder="e.g. 5" disabled={isSubmitting} className="rounded-2xl h-12 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-900" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 cursor-default">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 ml-1">Engine Specs</label>
              <Input value={formData.engine} onChange={(e) => setFormData(prev => ({...prev, engine: e.target.value}))} placeholder="e.g. 3.0L V6" disabled={isSubmitting} className="rounded-2xl h-12 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-900" />
            </div>
            <div className="space-y-2 cursor-default">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 ml-1">Mileage Status</label>
              <Input value={formData.mileage} onChange={(e) => setFormData(prev => ({...prev, mileage: e.target.value}))} placeholder="e.g. 10,000" disabled={isSubmitting} className="rounded-2xl h-12 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-900" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 cursor-default">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 ml-1">Exterior Finish</label>
              <Input value={formData.color} onChange={(e) => setFormData(prev => ({...prev, color: e.target.value}))} placeholder="e.g. Alpine White" disabled={isSubmitting} className="rounded-2xl h-12 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-900" />
            </div>
            <div className="space-y-2 cursor-default">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 ml-1">Inventory Status</label>
              <Select 
                options={[
                  { value: "Available", label: "Available" },
                  { value: "Sold", label: "Sold" }
                ]}
                value={formData.status}
                onChange={(val) => setFormData(prev => ({...prev, status: val}))}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-900 mt-8">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting || isUploading} className="rounded-xl px-6">Cancel</Button>
          <Button type="submit" isLoading={isSubmitting || isUploading} className="rounded-xl px-8 shadow-xl shadow-brand-primary/10">{initialData ? "Apply Changes" : "Confirm Addition"}</Button>
        </div>
      </form>
    </Modal>
  );
}
