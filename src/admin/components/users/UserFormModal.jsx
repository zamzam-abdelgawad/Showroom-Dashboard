import { useState, useEffect } from "react";
import { Modal } from "../../../shared/components/ui/Modal";
import { Button } from "../../../shared/components/ui/Button";
import { Input } from "../../../shared/components/ui/Input";

export function UserFormModal({ isOpen, onClose, onSubmit, initialData = null, isSubmitting }) {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", status: "Active" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ firstName: initialData.firstName || "", lastName: initialData.lastName || "", email: initialData.email || "", status: initialData.status || "Active" });
      } else {
        setFormData({ firstName: "", lastName: "", email: "", status: "Active" });
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) { newErrors.email = "Email is required"; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { newErrors.email = "Invalid email format"; }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) { onSubmit(formData); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit User" : "Add New User"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">First Name</label>
            <Input value={formData.firstName} onChange={(e) => setFormData(prev => ({...prev, firstName: e.target.value}))} error={errors.firstName} placeholder="John" disabled={isSubmitting} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Last Name</label>
            <Input value={formData.lastName} onChange={(e) => setFormData(prev => ({...prev, lastName: e.target.value}))} error={errors.lastName} placeholder="Doe" disabled={isSubmitting} />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Email Address</label>
          <Input type="email" value={formData.email} onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))} error={errors.email} placeholder="john.doe@example.com" disabled={isSubmitting} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50" value={formData.status} onChange={(e) => setFormData(prev => ({...prev, status: e.target.value}))} disabled={isSubmitting}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" isLoading={isSubmitting}>{initialData ? "Save Changes" : "Create User"}</Button>
        </div>
      </form>
    </Modal>
  );
}
