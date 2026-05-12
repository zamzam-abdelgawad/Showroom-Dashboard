import { useState, useEffect } from "react";
import { Modal } from "../../../shared/components/ui/Modal";
import { Button } from "../../../shared/components/ui/Button";
import { Input } from "../../../shared/components/ui/Input";
import { Select } from "../../../shared/components/ui/Select";

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
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit User Account" : "Register New Identity"}>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2 cursor-default">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 ml-1">Identity Name</label>
            <Input value={formData.firstName} onChange={(e) => setFormData(prev => ({...prev, firstName: e.target.value}))} error={errors.firstName} placeholder="John" disabled={isSubmitting} className="rounded-2xl h-12 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800" />
          </div>
          <div className="space-y-2 cursor-default">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 ml-1">Full Surname</label>
            <Input value={formData.lastName} onChange={(e) => setFormData(prev => ({...prev, lastName: e.target.value}))} error={errors.lastName} placeholder="Doe" disabled={isSubmitting} className="rounded-2xl h-12 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800" />
          </div>
        </div>
        <div className="space-y-2 cursor-default">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 ml-1">Email Communication Channel</label>
          <Input type="email" value={formData.email} onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))} error={errors.email} placeholder="john.doe@example.com" disabled={isSubmitting} className="rounded-2xl h-12 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800" />
        </div>
        <div className="space-y-2 cursor-default">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 ml-1">Account Lifecycle Status</label>
          <Select 
            options={[
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" }
            ]}
            value={formData.status}
            onChange={(val) => setFormData(prev => ({...prev, status: val}))}
            disabled={isSubmitting}
          />
        </div>
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-900 mt-8">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="rounded-2xl px-8 h-12 text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900">Abort</Button>
          <Button type="submit" isLoading={isSubmitting} className="rounded-2xl px-10 h-12 bg-brand-primary text-white shadow-xl shadow-brand-primary/20 text-[10px] font-bold uppercase tracking-widest">{initialData ? "Authorize Changes" : "Confirm Entry"}</Button>
        </div>
      </form>
    </Modal>
  );
}
