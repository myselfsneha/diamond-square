// src/components/Navbar.jsx

import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const role =
    localStorage.getItem("role") ||
    user.role ||
    "resident";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    toast.success("Logged out successfully");

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <nav className="bg-blue-600 text-white shadow">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to={
            role === "admin"
              ? "/admin-dashboard"
              : "/dashboard"
          }
          className="text-2xl font-bold"
        >
          Diamond Square
        </Link>

        <div className="flex items-center gap-4 flex-wrap">
          {role !== "admin" && (
            <>
              <Link to="/dashboard">
                Dashboard
              </Link>

              <Link to="/profile">
                Profile
              </Link>

              <Link to="/notices">
                Notices
              </Link>

              <Link to="/complaints">
                Complaints
              </Link>

              <Link to="/maintenance">
                Maintenance
              </Link>

              <Link to="/contacts">
                Contacts
              </Link>

              <Link to="/notifications">
                Notifications
              </Link>

              <Link to="/polls">
                Polls
              </Link>
            </>
          )}

          {role === "admin" && (
            <>
              <Link to="/admin-dashboard">
                Dashboard
              </Link>

              <Link to="/admin-complaints">
                Complaints
              </Link>

              <Link to="/admin-notices">
                Notices
              </Link>

              <Link to="/admin-maintenance">
                Maintenance
              </Link>

              <Link to="/admin-residents">
                Residents
              </Link>

              <Link to="/admin-approvals">
                Approvals
              </Link>

              <Link to="/admin-contacts">
                Contacts
              </Link>

              <Link to="/admin-events">
                Events
              </Link>

              <Link to="/admin-payments">
                Payments
              </Link>

              <Link to="/admin-visitors">
                Visitors
              </Link>

              <Link to="/admin-guards">
                Guards
              </Link>

              <Link to="/admin-documents">
                Documents
              </Link>

              <Link to="/admin-polls">
                Polls
              </Link>
            </>
          )}

          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;