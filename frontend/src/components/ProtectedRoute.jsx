import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const role =
    localStorage.getItem("role") ||
    user.role ||
    "resident";

  // Not logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Admin-only pages
  if (adminOnly && role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;