import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Navigate } from "react-router-dom";
import { Shield } from "lucide-react";

export default function Login() {
  const { login, user } = useAuth();
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

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
    } catch (error) {
      addToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
      <Card className="w-full max-w-md shadow-xl border-gray-100">
        <CardHeader className="text-center space-y-2 border-b-0 pb-0 mt-4">
          <div className="mx-auto bg-indigo-100 p-3 rounded-full w-fit mb-2">
            <Shield className="h-8 w-8 text-indigo-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <p className="text-gray-500 text-sm">Log in to your Admin Dashboard</p>
        </CardHeader>
        <CardContent className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                placeholder="admin@admin.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
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
            <div className="text-left text-xs text-gray-600 mt-4 bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col gap-2">
              <p className="font-semibold text-gray-900 border-b pb-1">Demo Credentials:</p>
              <div className="flex justify-between items-center">
                <span><span className="font-medium text-indigo-600">Admin</span> (Full Access):</span>
                <span className="font-mono text-[11px] bg-white px-2 py-1 border rounded shadow-sm">admin@admin.com / admin123</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span><span className="font-medium text-gray-700">User</span> (Read-only):</span>
                <span className="font-mono text-[11px] bg-white px-2 py-1 border rounded shadow-sm">user@user.com / user123</span>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
