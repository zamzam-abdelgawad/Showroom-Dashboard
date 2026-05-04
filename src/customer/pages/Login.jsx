import { useState } from "react";
import { useAuth } from "../../shared/context/AuthContext";
import { useToast } from "../../shared/context/ToastContext";
import { Input } from "../../shared/components/ui/Input";
import { Button } from "../../shared/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/components/ui/Card";
import { Navigate, useLocation, useNavigate, Link } from "react-router-dom";
import { Shield } from "lucide-react";

export default function Login() {
  const { login, user, isAdmin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 dark:bg-slate-950 p-4 transition-colors duration-300">
      <Card className="w-full max-w-md shadow-xl border-gray-100 dark:border-slate-800 dark:bg-slate-900">
        <CardHeader className="text-center space-y-2 border-b-0 pb-0 mt-4">
          <div className="mx-auto bg-indigo-100 dark:bg-indigo-900/40 p-3 rounded-full w-fit mb-2">
            <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <CardTitle className="text-2xl font-bold dark:text-gray-100">Welcome Back</CardTitle>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Log in to your account</p>
        </CardHeader>
        <CardContent className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <Input
                type="email"
                placeholder="admin@admin.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" isLoading={loading}>
              Sign In
            </Button>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-semibold">
                Sign Up
              </Link>
            </p>
            <div className="text-left text-xs text-gray-600 dark:text-gray-400 mt-4 bg-gray-50 dark:bg-slate-800 p-4 rounded-lg border border-gray-100 dark:border-slate-700 flex flex-col gap-2">
              <p className="font-semibold text-gray-900 dark:text-gray-100 border-b dark:border-slate-700 pb-1">Demo Credentials:</p>
              <div className="flex justify-between items-center">
                <span><span className="font-medium text-indigo-600 dark:text-indigo-400">Admin</span> (Full Access):</span>
                <span className="font-mono text-[11px] bg-white dark:bg-slate-900 px-2 py-1 border dark:border-slate-700 rounded shadow-sm">admin@admin.com / admin123</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span><span className="font-medium text-gray-700 dark:text-gray-300">User</span> (Customer):</span>
                <span className="font-mono text-[11px] bg-white dark:bg-slate-900 px-2 py-1 border dark:border-slate-700 rounded shadow-sm">user@user.com / user123</span>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
