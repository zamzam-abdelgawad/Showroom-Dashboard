import { useState } from "react";
import { useAuth } from "../../shared/context/AuthContext";
import { useToast } from "../../shared/context/ToastContext";
import { Card, CardContent } from "../../shared/components/ui/Card";
import { Input } from "../../shared/components/ui/Input";
import { Button } from "../../shared/components/ui/Button";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../shared/lib/firebase";
import { Send, MessageSquare, Mail, User, FileText, CheckCircle } from "lucide-react";

export default function ContactUs() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    else if (formData.message.trim().length < 10) newErrors.message = "Message must be at least 10 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "messages"), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        userId: user?.uid || null,
        read: false,
        createdAt: serverTimestamp(),
      });
      setIsSuccess(true);
      setFormData({ name: user?.name || "", email: user?.email || "", subject: "", message: "" });
      addToast("Message sent successfully!", "success");
      setTimeout(() => setIsSuccess(false), 4000);
    } catch (error) {
      console.error("Error sending message:", error);
      addToast("Failed to send message. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-xl shadow-indigo-200 mb-6">
          <MessageSquare className="h-8 w-8" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
          Get in <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Touch</span>
        </h1>
        <p className="text-gray-500 text-lg mt-4 max-w-xl mx-auto">
          Have a question about a vehicle or need assistance? Send us a message and our team will get back to you shortly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-md bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
            <CardContent className="p-8 relative">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl" />
              
              <h3 className="text-xl font-bold mb-6 relative">Contact Information</h3>
              <div className="space-y-5 relative">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
                    <Mail className="h-4 w-4 text-indigo-300" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Email</p>
                    <p className="text-sm font-semibold text-white">support@showroomelite.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
                    <MessageSquare className="h-4 w-4 text-indigo-300" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Phone</p>
                    <p className="text-sm font-semibold text-white">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
                    <FileText className="h-4 w-4 text-indigo-300" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Address</p>
                    <p className="text-sm font-semibold text-white">123 Elite Drive, Los Angeles</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wider">Business Hours</p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Mon – Fri</span>
                    <span className="font-semibold">9:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Saturday</span>
                    <span className="font-semibold">10:00 AM – 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Sunday</span>
                    <span className="font-medium text-gray-400">Closed</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-3">
          <Card className="border-none shadow-md overflow-hidden">
            <CardContent className="p-8">
              {isSuccess && (
                <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 animate-in">
                  <div className="p-1.5 bg-emerald-100 rounded-full">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-800">Message sent successfully!</p>
                    <p className="text-xs text-emerald-600 mt-0.5">We'll get back to you as soon as possible.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="h-3 w-3" /> Your Name
                    </label>
                    <Input
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      error={errors.name}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="h-3 w-3" /> Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      error={errors.email}
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="h-3 w-3" /> Subject
                  </label>
                  <Input
                    placeholder="How can we help you?"
                    value={formData.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    error={errors.subject}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="h-3 w-3" /> Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell us more about your inquiry..."
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    className={`flex w-full rounded-xl border ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-shadow resize-none`}
                  />
                  {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
                </div>

                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full rounded-xl h-12 text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200 transition-all duration-300"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
