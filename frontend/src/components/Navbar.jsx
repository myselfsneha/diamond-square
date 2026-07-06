import { useState, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Building2,
  LogOut,
} from "lucide-react";
import { toast } from "react-toastify";

import DarkModeToggle from "./DarkModeToggle";

function Navbar() {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const user = useMemo(
    () =>
      JSON.parse(
        localStorage.getItem("user") || "{}"
      ),
    []
  );

  const role =
    localStorage.getItem("role") ||
    user.role ||
    "resident";

  const handleLogout = () => {
    localStorage.clear();

    toast.success("Logged out successfully");

    navigate("/");
  };
    const navClass = ({ isActive }) =>
    `flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
      isActive
        ? "bg-white text-blue-700 shadow-sm dark:bg-gray-700 dark:text-white"
        : "text-white hover:bg-white/10"
    }`;

  const residentLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/profile", label: "Profile" },
    { to: "/notices", label: "Notices" },
    { to: "/complaints", label: "Complaints" },
    { to: "/maintenance", label: "Maintenance" },
    { to: "/contacts", label: "Contacts" },
    { to: "/notifications", label: "Notifications" },
    { to: "/polls", label: "Polls" },
  ];

  const adminLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/admin-complaints", label: "Complaints" },
    { to: "/admin-notices", label: "Notices" },
    { to: "/admin-maintenance", label: "Maintenance" },
    { to: "/admin-residents", label: "Residents" },
    { to: "/admin-approvals", label: "Approvals" },
    { to: "/admin-contacts", label: "Contacts" },
    { to: "/admin-events", label: "Events" },
    { to: "/admin-payments", label: "Payments" },
    { to: "/admin-visitors", label: "Visitors" },
    { to: "/admin-guards", label: "Guards" },
    { to: "/admin-documents", label: "Documents" },
    { to: "/admin-polls", label: "Polls" },
  ];

  const links =
    role === "admin"
      ? adminLinks
      : residentLinks;

  return (
    <nav className="sticky top-0 z-40 bg-blue-600/95 dark:bg-gray-900/95 shadow-lg border-b border-white/10">

      <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-hide">

        <div className="h-16 flex items-center justify-between">

          <NavLink
            to={
              role === "admin"
                ? "/dashboard"
                : "/dashboard"
            }
            className="flex items-center gap-3 text-white font-bold text-2xl"
          >
            <Building2 size={30} />
            Diamond Square
          </NavLink>

          <button
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
            className="lg:hidden text-white"
          >
            {mobileOpen ? (
              <X size={28} />
            ) : (
              <Menu size={28} />
            )}
          </button>

          <div className="hidden lg:flex items-center gap-2 whitespace-nowrap">
            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={navClass}
              >
                {item.label}
              </NavLink>
            ))}
                        <DarkModeToggle />

            <button
              onClick={handleLogout}
              className="ml-2 flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-white font-medium transition-all duration-200 hover:scale-[1.02]"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden py-4 border-t border-white/10">

            <div className="flex flex-col gap-2">

              {links.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={navClass}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">

                <DarkModeToggle />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-white transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>

              </div>

            </div>

          </div>
        )}
      </div>
          </nav>
  );
}

export default Navbar;