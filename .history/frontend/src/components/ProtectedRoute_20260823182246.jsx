import { Navigate, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { toast } from "react-toastify";

function ProtectedRoute({
  children,
  adminOnly = false,
  guardOnly = false,
  allowedRoles = [],
}) {
  const location = useLocation();

  const token = localStorage.getItem("token");

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const role =
    localStorage.getItem("role") ||
    user.role ||
    "resident";

  if (!token) {
    toast.dismiss();
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location }}
      />
    );
  }

  if (adminOnly && role !== "admin") {
    toast.dismiss();
    toast.error("Access denied");
    return <Navigate to="/dashboard" replace />;
  }

  if (guardOnly && role !== "guard") {
    toast.dismiss();
    toast.error("Access denied");
    return <Navigate to="/dashboard" replace />;
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(role)
  ) {
    toast.dismiss();
    toast.error("Access denied");
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;