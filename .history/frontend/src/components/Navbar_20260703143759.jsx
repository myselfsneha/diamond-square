import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DarkModeToggle from "./DarkModeToggle";

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
    localStorage.clear();

    toast.success("Logged out successfully");

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const navClass = ({ isActive }) =>
    `px-3 py-2 rounded-md transition ${
      isActive
        ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-white font-semibold"
: "text-white hover:bg-blue-700 dark:hover:bg-gray-800"
    }`;

  return (
    <nav className="bg-blue-600 dark:bg-gray-900 text-white shadow-lg transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
        <NavLink
          to={
            role === "admin"
              ? "/admin-dashboard"
              : "/dashboard"
          }
          className="text-2xl font-bold"
        >
          Diamond Square
        </NavLink>

        <div className="flex flex-wrap items-center gap-2">
          {role !== "admin" && (
            <>
              <NavLink to="/dashboard" className={navClass}>
                Dashboard
              </NavLink>

              <NavLink to="/profile" className={navClass}>
                Profile
              </NavLink>

              <NavLink to="/notices" className={navClass}>
                Notices
              </NavLink>

              <NavLink to="/complaints" className={navClass}>
                Complaints
              </NavLink>

              <NavLink to="/maintenance" className={navClass}>
                Maintenance
              </NavLink>

              <NavLink to="/contacts" className={navClass}>
                Contacts
              </NavLink>

              <NavLink to="/notifications" className={navClass}>
                Notifications
              </NavLink>

              <NavLink to="/polls" className={navClass}>
                Polls
              </NavLink>
            </>
          )}

          {role === "admin" && (
            <>
              <NavLink to="/admin-dashboard" className={navClass}>
                Dashboard
              </NavLink>

              <NavLink to="/admin-complaints" className={navClass}>
                Complaints
              </NavLink>

              <NavLink to="/admin-notices" className={navClass}>
                Notices
              </NavLink>

              <NavLink to="/admin-maintenance" className={navClass}>
                Maintenance
              </NavLink>

              <NavLink to="/admin-residents" className={navClass}>
                Residents
              </NavLink>

              <NavLink to="/admin-approvals" className={navClass}>
                Approvals
              </NavLink>

              <NavLink to="/admin-contacts" className={navClass}>
                Contacts
              </NavLink>

              <NavLink to="/admin-events" className={navClass}>
                Events
              </NavLink>

              <NavLink to="/admin-payments" className={navClass}>
                Payments
              </NavLink>

              <NavLink to="/admin-visitors" className={navClass}>
                Visitors
              </NavLink>

              <NavLink to="/admin-guards" className={navClass}>
                Guards
              </NavLink>

              <NavLink to="/admin-documents" className={navClass}>
                Documents
              </NavLink>

              <NavLink to="/admin-polls" className={navClass}>
                Polls
              </NavLink>
            </>
          )}

          <DarkModeToggle />

<button
  onClick={handleLogout}
  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
>
  Logout
</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;