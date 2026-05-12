import { useState } from "react";
import { useAuth } from "../../shared/context/AuthContext";
import { useToast } from "../../shared/context/ToastContext";
import { Input } from "../../shared/components/ui/Input";
import { Button } from "../../shared/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/components/ui/Card";
import { Navigate, useLocation, useNavigate, Link } from "react-router-dom";
import { Shield, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login, user, isAdmin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  const from = location.state?.from || (isAdmin ? '/admin' : '/');
  if (user) return <Navigate to={from} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast("Please fill in all fields", "error");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      addToast("Successfully logged in", "success");
      // Navigation happens via the redirect above on re-render
    } catch (error) {
      addToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6 transition-all duration-500 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-brand-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-brand-primary/10 rounded-full blur-[120px]" />
      </div>
      
      <Card className="w-full max-w-md shadow-2xl border-zinc-100 dark:border-zinc-900 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl rounded-3xl relative z-10">
        <CardHeader className="text-center space-y-4 pt-10 pb-4">
          <div className="mx-auto bg-zinc-950 p-4 rounded-2xl w-fit mb-2 shadow-2xl border border-white/5 group transition-transform hover:scale-110">
            <Shield className="h-8 w-8 text-brand-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-zinc-100 tracking-tight">Welcome back</CardTitle>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Sign in to your account</p>
        </CardHeader>
        <CardContent className="px-10 pb-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest ml-1">Identity Access</label>
              <Input
                type="email"
                placeholder="user@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-sm font-semibold tracking-tight focus:ring-brand-primary placeholder:text-zinc-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest ml-1">Clearance Key</label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-sm font-semibold tracking-tight focus:ring-brand-primary placeholder:text-zinc-400"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
              />
            </div>
            <Button type="submit" className="w-full h-14 rounded-2xl text-sm font-bold uppercase tracking-widest shadow-2xl shadow-brand-primary/20 bg-brand-primary hover:bg-brand-primary/90" isLoading={loading}>
              Sign In
            </Button>
            <p className="text-center text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Don't have an account?{" "}
              <Link to="/register" className="text-brand-primary hover:underline underline-offset-4 decoration-2">
                Register
              </Link>
            </p>
            <div className="text-left bg-zinc-50 dark:bg-zinc-900/50 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex flex-col gap-3 shadow-inner">
              <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2">Technical Dossier Access</p>
              <div className="flex justify-between items-center bg-white dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Administrator</span>
                <span className="font-mono text-[10px] text-zinc-500 font-bold tracking-tight">admin@admin.com</span>
              </div>
              <div className="flex justify-between items-center bg-white dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest">Asset Client</span>
                <span className="font-mono text-[10px] text-zinc-500 font-bold tracking-tight">user@user.com</span>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
