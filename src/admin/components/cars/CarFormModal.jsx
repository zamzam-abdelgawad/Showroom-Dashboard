import { useState, useEffect } from "react";
import { Modal } from "../../../shared/components/ui/Modal";
import { Button } from "../../../shared/components/ui/Button";
import { Input } from "../../../shared/components/ui/Input";

export function CarFormModal({ isOpen, onClose, onSubmit, initialData = null, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: "", brand: "", officialPrice: "", sellingPrice: "",
    modelYear: "", status: "Available", engine: "", color: "", mileage: "", count: 1
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || "", brand: initialData.brand || "",
          officialPrice: initialData.officialPrice || "", sellingPrice: initialData.sellingPrice || "",
          count: initialData.count ?? 1,
          modelYear: initialData.modelYear || "", status: initialData.status || "Available",
          engine: initialData.specs?.engine || "", color: initialData.specs?.color || "",
          mileage: initialData.specs?.mileage || ""
        });
      } else {
        setFormData({ name: "", brand: "", officialPrice: "", sellingPrice: "", modelYear: "", status: "Available", engine: "", color: "", mileage: "", count: 1 });
      }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const count = Number(formData.count);
      onSubmit({
        name: formData.name, brand: formData.brand,
        officialPrice: Number(formData.officialPrice), sellingPrice: Number(formData.sellingPrice),
        modelYear: Number(formData.modelYear), status: count === 0 ? "Sold" : "Available",
        count,
        specs: { engine: formData.engine, color: formData.color, mileage: formData.mileage }
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Car" : "Add New Car"}>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5 cursor-default">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Asset Nomenclature</label>
            <Input value={formData.name} onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))} error={errors.name} placeholder="e.g. M3 Competition" disabled={isSubmitting} />
          </div>
          <div className="space-y-1.5 cursor-default">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Manufacturer</label>
            <Input value={formData.brand} onChange={(e) => setFormData(prev => ({...prev, brand: e.target.value}))} error={errors.brand} placeholder="e.g. BMW" disabled={isSubmitting} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5 cursor-default">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Market Value ($)</label>
            <Input type="number" value={formData.officialPrice} onChange={(e) => setFormData(prev => ({...prev, officialPrice: e.target.value}))} error={errors.officialPrice} placeholder="48000" disabled={isSubmitting} />
          </div>
          <div className="space-y-1.5 cursor-default">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Acquisition Price ($)</label>
            <Input type="number" value={formData.sellingPrice} onChange={(e) => setFormData(prev => ({...prev, sellingPrice: e.target.value}))} error={errors.sellingPrice} placeholder="50000" disabled={isSubmitting} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5 cursor-default">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Lifecycle Year</label>
            <Input type="number" value={formData.modelYear} onChange={(e) => setFormData(prev => ({...prev, modelYear: e.target.value}))} error={errors.modelYear} placeholder="2024" disabled={isSubmitting} />
          </div>
          <div className="space-y-1.5 cursor-default">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Available Units</label>
            <Input type="number" min="0" value={formData.count} onChange={(e) => setFormData(prev => ({...prev, count: e.target.value}))} error={errors.count} placeholder="e.g. 5" disabled={isSubmitting} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5 cursor-default">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Engine Specs</label>
            <Input value={formData.engine} onChange={(e) => setFormData(prev => ({...prev, engine: e.target.value}))} placeholder="e.g. 3.0L V6" disabled={isSubmitting} />
          </div>
          <div className="space-y-1.5 cursor-default">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Mileage Status</label>
            <Input value={formData.mileage} onChange={(e) => setFormData(prev => ({...prev, mileage: e.target.value}))} placeholder="e.g. 10,000" disabled={isSubmitting} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5 cursor-default">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Exterior Finish</label>
            <Input value={formData.color} onChange={(e) => setFormData(prev => ({...prev, color: e.target.value}))} placeholder="e.g. Alpine White" disabled={isSubmitting} />
          </div>
        </div>
        <div className="space-y-1.5 cursor-default">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Inventory Status</label>
          <select className="flex h-12 w-full rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50 transition-all shadow-inner" value={formData.status} onChange={(e) => setFormData(prev => ({...prev, status: e.target.value}))} disabled={isSubmitting}>
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
          </select>
        </div>
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-900 mt-8">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="rounded-xl px-6">Cancel</Button>
          <Button type="submit" isLoading={isSubmitting} className="rounded-xl px-8 shadow-xl shadow-brand-primary/10">{initialData ? "Apply Changes" : "Confirm Addition"}</Button>
        </div>
      </form>
    </Modal>
  );
}
