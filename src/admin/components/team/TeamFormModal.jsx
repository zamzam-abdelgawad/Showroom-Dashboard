import { useState, useEffect } from "react";
import { Modal } from "../../../shared/components/ui/Modal";
import { Button } from "../../../shared/components/ui/Button";
import { Input } from "../../../shared/components/ui/Input";
import { Select } from "../../../shared/components/ui/Select";

export function TeamFormModal({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({ name: "", role: "Sales Associate", email: "", phone: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({ name: "", role: "Sales Associate", email: "", phone: "" });
      setErrors({});
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) { onSubmit(formData); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Staff Member">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2 cursor-default">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 ml-1">Full Name</label>
          <Input value={formData.name} onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))} error={errors.name} placeholder="e.g. John Doe" disabled={isSubmitting} className="rounded-2xl h-12 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800" />
        </div>
        <div className="space-y-2 cursor-default">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 ml-1">Role</label>
          <Select 
            options={[
              { value: "Sales Associate", label: "Sales Associate" },
              { value: "Manager", label: "Manager" },
              { value: "Technician", label: "Technician" },
              { value: "Marketing", label: "Marketing Specialist" },
              { value: "Customer Relations", label: "Customer Relations" },
            ]}
            value={formData.role}
            onChange={(val) => setFormData(prev => ({...prev, role: val}))}
            disabled={isSubmitting}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2 cursor-default">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 ml-1">Email Address</label>
            <Input type="email" value={formData.email} onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))} error={errors.email} placeholder="john@showroom.com" disabled={isSubmitting} className="rounded-2xl h-12 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800" />
          </div>
          <div className="space-y-2 cursor-default">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 ml-1">Phone Number</label>
            <Input value={formData.phone} onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))} error={errors.phone} placeholder="+1 555-0101" disabled={isSubmitting} className="rounded-2xl h-12 bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-900 mt-8">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="rounded-2xl px-8 h-12 text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900">Cancel</Button>
          <Button type="submit" isLoading={isSubmitting} className="rounded-2xl px-10 h-12 bg-brand-primary text-white shadow-xl shadow-brand-primary/20 text-[10px] font-bold uppercase tracking-widest">Confirm Staff Member</Button>
        </div>
      </form>
    </Modal>
  );
}
