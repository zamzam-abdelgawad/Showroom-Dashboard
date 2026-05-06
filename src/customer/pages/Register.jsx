import { useState } from "react";
import { useAuth } from "../../shared/context/AuthContext";
import { useToast } from "../../shared/context/ToastContext";
import { Input } from "../../shared/components/ui/Input";
import { Button } from "../../shared/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/components/ui/Card";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

export default function Register() {
  const { register, user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (user) return <Navigate to="/" replace />;

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email format";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await register(email, password, name);
      addToast("Account created successfully!", "success");
      navigate("/");
    } catch (error) {
      addToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6 transition-all duration-500 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[10%] left-[20%] w-[35%] h-[35%] bg-brand-primary/5 rounded-full blur-[110px]" />
        <div className="absolute bottom-[10%] right-[20%] w-[45%] h-[45%] bg-brand-primary/10 rounded-full blur-[130px]" />
      </div>

      <Card className="w-full max-w-md shadow-2xl border-zinc-100 dark:border-zinc-900 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl rounded-3xl relative z-10">
        <CardHeader className="text-center space-y-4 pt-10 pb-4">
          <div className="mx-auto bg-zinc-950 p-4 rounded-2xl w-fit mb-2 shadow-2xl border border-white/5 group transition-transform hover:rotate-12">
            <UserPlus className="h-8 w-8 text-brand-primary" />
          </div>
          <CardTitle className="text-3xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tighter">Create Account</CardTitle>
          <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em]">Join the community</p>
        </CardHeader>
        <CardContent className="px-10 pb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
              <Input
                placeholder="User"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-[11px] font-black uppercase tracking-widest focus:ring-brand-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Email</label>
              <Input
                type="email"
                placeholder="user@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-[11px] font-black uppercase tracking-widest focus:ring-brand-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-[11px] font-black uppercase tracking-widest focus:ring-brand-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Confirm Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-[11px] font-black uppercase tracking-widest focus:ring-brand-primary"
              />
            </div>
            <Button type="submit" className="w-full h-14 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-brand-primary/20 bg-brand-primary hover:bg-brand-primary/90 mt-4" isLoading={loading}>
              Register
            </Button>
            <p className="text-center text-[10px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest pt-2">
              Already have an account?{" "}
              <Link to="/login" className="text-brand-primary hover:underline underline-offset-4 decoration-2">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
