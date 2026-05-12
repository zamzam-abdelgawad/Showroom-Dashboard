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
        let defaultFirst = initialData.firstName || "";
        let defaultLast = initialData.lastName || "";
        if (initialData.name && !initialData.firstName) {
          const parts = initialData.name.split(' ');
          defaultFirst = parts[0] || "";
          defaultLast = parts.slice(1).join(' ') || "";
        }
        setFormData({ firstName: defaultFirst, lastName: defaultLast, email: initialData.email || "", status: initialData.status || "Active" });
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
    if (validate()) { 
      onSubmit({
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim()
      }); 
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit User" : "Add New User"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5 cursor-default">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Identity Name</label>
            <Input value={formData.firstName} onChange={(e) => setFormData(prev => ({...prev, firstName: e.target.value}))} error={errors.firstName} placeholder="John" disabled={isSubmitting} className="rounded-xl h-11" />
          </div>
          <div className="space-y-1.5 cursor-default">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Full Surname</label>
            <Input value={formData.lastName} onChange={(e) => setFormData(prev => ({...prev, lastName: e.target.value}))} error={errors.lastName} placeholder="Doe" disabled={isSubmitting} className="rounded-xl h-11" />
          </div>
        </div>
        <div className="space-y-1.5 cursor-default">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Email Channel</label>
          <Input type="email" value={formData.email} onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))} error={errors.email} placeholder="john.doe@example.com" disabled={isSubmitting} className="rounded-xl h-11" />
        </div>
        <div className="space-y-1.5 cursor-default">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Account Lifecycle</label>
          <select className="flex h-11 w-full rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50 transition-all shadow-inner" value={formData.status} onChange={(e) => setFormData(prev => ({...prev, status: e.target.value}))} disabled={isSubmitting}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-900 mt-8">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="rounded-xl px-6">Cancel</Button>
          <Button type="submit" isLoading={isSubmitting} className="rounded-xl px-8 shadow-xl shadow-brand-primary/10">{initialData ? "Apply Changes" : "Confirm Entry"}</Button>
        </div>
      </form>
    </Modal>
  );
}
