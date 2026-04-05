import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function RequireAdmin({ children }) {
  const { user } = useAuth();
  if (user && user.role !== 'admin') return <Navigate to="/profile" replace />;
  return children;
}

export function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'admin' ? "/dashboard" : "/cars"} replace />;
}
