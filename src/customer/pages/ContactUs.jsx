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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-in bg-zinc-50/30 dark:bg-zinc-950/30 min-h-screen">
      {/* Hero */}
      <div className="text-center mb-16 px-4">
        <div className="inline-flex p-4 bg-zinc-950 dark:bg-zinc-100 rounded-2xl text-brand-primary shadow-2xl border border-white/5 dark:border-zinc-900/5 mb-8">
          <MessageSquare className="h-8 w-8" />
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight leading-tight">
          Contact <span className="text-brand-primary">Us</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-base sm:text-lg mt-6 max-w-xl mx-auto leading-relaxed font-medium">
          Have a question? Send us a message and we'll get back to you as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border border-zinc-200 dark:border-zinc-900 shadow-2xl bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white overflow-hidden rounded-3xl relative">
            <CardContent className="p-10 relative">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-brand-primary/5 rounded-full blur-[80px] pointer-events-none" />
              
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-10 relative">Contact Info</h3>
              <div className="space-y-8 relative">
                <div className="flex items-center gap-5">
                  <div className="p-3 bg-zinc-100 dark:bg-white/5 rounded-xl border border-zinc-200 dark:border-white/10 backdrop-blur-md">
                    <Mail className="h-4 w-4 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-500 font-bold uppercase tracking-widest mb-1">Mailing</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">info@showcase.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="p-3 bg-zinc-100 dark:bg-white/5 rounded-xl border border-zinc-200 dark:border-white/10 backdrop-blur-md">
                    <MessageSquare className="h-4 w-4 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-500 font-bold uppercase tracking-widest mb-1">Tele-Line</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">+20 111 111 1111</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="p-3 bg-zinc-100 dark:bg-white/5 rounded-xl border border-zinc-200 dark:border-white/10 backdrop-blur-md">
                    <FileText className="h-4 w-4 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-500 font-bold uppercase tracking-widest mb-1">HQ Location</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">Cairo, Egypt</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-10 border-t border-zinc-200 dark:border-white/5">
                <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-8 font-bold uppercase tracking-widest">Operating Schedule</p>
                <div className="space-y-5 text-xs font-bold uppercase tracking-widest">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 dark:text-zinc-500">Business Days</span>
                    <span className="text-zinc-900 dark:text-white border-b border-brand-primary/40">09:00 — 18:00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 dark:text-zinc-500">Sunday Ops</span>
                    <span className="text-zinc-900 dark:text-white border-b border-brand-primary/40">10:00 — 16:00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 dark:text-zinc-500">Fridays</span>
                    <span className="text-zinc-600 dark:text-zinc-600">Restricted</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-3">
          <Card className="border border-zinc-100 dark:border-zinc-900 shadow-2xl overflow-hidden bg-white dark:bg-zinc-950 rounded-3xl">
            <CardContent className="p-10">
              {isSuccess && (
                <div className="mb-10 bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 rounded-2xl p-6 flex items-center gap-5 animate-in slide-in-from-top-4">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest">Inquiry Received</p>
                    <p className="text-xs font-medium text-emerald-600/80 dark:text-emerald-500/80 mt-1 leading-relaxed">Our personnel will finalize a response within the next 24 business hours.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-brand-primary opacity-70" /> Name
                    </label>
                    <Input
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      error={errors.name}
                      className="rounded-xl h-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-sm font-semibold tracking-tight focus:ring-brand-primary placeholder:text-zinc-400"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-brand-primary opacity-70" /> Email
                    </label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      error={errors.email}
                      className="rounded-xl h-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-sm font-semibold tracking-tight focus:ring-brand-primary placeholder:text-zinc-400"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-brand-primary opacity-70" /> Subject
                  </label>
                  <Input
                    placeholder="Enter your subject"
                    value={formData.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    error={errors.subject}
                    className="rounded-xl h-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-sm font-semibold tracking-tight focus:ring-brand-primary placeholder:text-zinc-400"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare className="h-3.5 w-3.5 text-brand-primary opacity-70" /> Message
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Detail your message.."
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    className={`flex w-full rounded-2xl border ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-zinc-100 dark:border-zinc-800 focus:ring-brand-primary'} bg-zinc-50 dark:bg-zinc-900 px-5 py-4 text-sm font-semibold tracking-tight placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none shadow-inner leading-relaxed`}
                  />
                  {errors.message && <p className="text-xs font-medium text-red-500">{errors.message}</p>}
                </div>

                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full rounded-2xl h-16 text-xs font-bold uppercase tracking-widest shadow-2xl shadow-brand-primary/20 transition-all duration-500 hover:scale-[1.01] active:scale-[0.99] bg-brand-primary hover:bg-brand-primary/90"
                >
                  <Send className="h-4 w-4 mr-3" />
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