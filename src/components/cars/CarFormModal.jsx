import { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function CarFormModal({ isOpen, onClose, onSubmit, initialData = null, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    officialPrice: "",
    sellingPrice: "",
    modelYear: "",
    status: "Available",
    engine: "",
    color: "",
    mileage: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || "",
          brand: initialData.brand || "",
          officialPrice: initialData.officialPrice || "",
          sellingPrice: initialData.sellingPrice || "",
          modelYear: initialData.modelYear || "",
          status: initialData.status || "Available",
          engine: initialData.specs?.engine || "",
          color: initialData.specs?.color || "",
          mileage: initialData.specs?.mileage || ""
        });
      } else {
        setFormData({ name: "", brand: "", officialPrice: "", sellingPrice: "", modelYear: "", status: "Available", engine: "", color: "", mileage: "" });
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        name: formData.name,
        brand: formData.brand,
        officialPrice: Number(formData.officialPrice),
        sellingPrice: Number(formData.sellingPrice),
        modelYear: Number(formData.modelYear),
        status: formData.status,
        specs: {
          engine: formData.engine,
          color: formData.color,
          mileage: formData.mileage
        }
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Car" : "Add New Car"}>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Car Name</label>
            <Input 
              value={formData.name} 
              onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
              error={errors.name}
              placeholder="e.g. M3 Competition"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Brand</label>
            <Input 
              value={formData.brand} 
              onChange={(e) => setFormData(prev => ({...prev, brand: e.target.value}))}
              error={errors.brand}
              placeholder="e.g. BMW"
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Official Price ($)</label>
            <Input 
              type="number"
              value={formData.officialPrice} 
              onChange={(e) => setFormData(prev => ({...prev, officialPrice: e.target.value}))}
              error={errors.officialPrice}
              placeholder="48000"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Selling Price ($)</label>
            <Input 
              type="number"
              value={formData.sellingPrice} 
              onChange={(e) => setFormData(prev => ({...prev, sellingPrice: e.target.value}))}
              error={errors.sellingPrice}
              placeholder="50000"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Model Year</label>
            <Input 
              type="number"
              value={formData.modelYear} 
              onChange={(e) => setFormData(prev => ({...prev, modelYear: e.target.value}))}
              error={errors.modelYear}
              placeholder="2024"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Engine</label>
            <Input 
              value={formData.engine} 
              onChange={(e) => setFormData(prev => ({...prev, engine: e.target.value}))}
              placeholder="e.g. 3.0L V6"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Color</label>
            <Input 
              value={formData.color} 
              onChange={(e) => setFormData(prev => ({...prev, color: e.target.value}))}
              placeholder="e.g. Alpine White"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Mileage (km)</label>
            <Input 
              value={formData.mileage} 
              onChange={(e) => setFormData(prev => ({...prev, mileage: e.target.value}))}
              placeholder="e.g. 10,000"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            value={formData.status}
            onChange={(e) => setFormData(prev => ({...prev, status: e.target.value}))}
            disabled={isSubmitting}
          >
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
          </select>
        </div>
        
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {initialData ? "Save Changes" : "Confirm Addition"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
