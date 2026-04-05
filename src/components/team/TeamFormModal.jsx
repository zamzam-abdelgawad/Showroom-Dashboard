import { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function TeamFormModal({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: "",
    role: "Sales Associate",
    email: "",
    phone: ""
  });
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
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Staff Member">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <Input 
            value={formData.name} 
            onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
            error={errors.name}
            placeholder="e.g. John Doe"
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Role</label>
          <select
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            value={formData.role}
            onChange={(e) => setFormData(prev => ({...prev, role: e.target.value}))}
            disabled={isSubmitting}
          >
            <option value="Sales Associate">Sales Associate</option>
            <option value="Manager">Manager</option>
            <option value="Technician">Technician</option>
            <option value="Marketing">Marketing Specialist</option>
            <option value="Customer Relations">Customer Relations</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <Input 
              type="email"
              value={formData.email} 
              onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
              error={errors.email}
              placeholder="john@showroom.com"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Phone Number</label>
            <Input 
              value={formData.phone} 
              onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
              error={errors.phone}
              placeholder="+1 555-0101"
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Confirm Staff Member
          </Button>
        </div>
      </form>
    </Modal>
  );
}
