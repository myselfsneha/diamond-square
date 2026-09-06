import { useState, useMemo } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Building2,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import DarkModeToggle from "./DarkModeToggle";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

  const user = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "{}"),
    []
  );

  const role =
    localStorage.getItem("role") ||
    user.role ||
    "resident";

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) return;

    sessionStorage.clear();
    localStorage.clear();

    toast.success("Logged out successfully");

    navigate("/", {
      replace: true,
    });
  };

  const navClass = ({ isActive }) =>
    `relative flex items-center rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
      isActive
        ? "bg-white text-emerald-700 shadow-md dark:bg-slate-700 dark:text-white"
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
    ...residentLinks,
    { to: "/admin-complaints", label: "Manage Complaints" },
    { to: "/admin-notices", label: "Manage Notices" },
    { to: "/admin-maintenance", label: "Manage Maintenance" },
    { to: "/admin-residents", label: "Residents" },
    { to: "/admin-approvals", label: "Approvals" },
    { to: "/admin-contacts", label: "Manage Contacts" },
    { to: "/admin-events", label: "Events" },
    { to: "/admin-payments", label: "Payments" },
    { to: "/admin-visitors", label: "Visitors" },
    { to: "/admin-guards", label: "Guards" },
    { to: "/admin-documents", label: "Documents" },
    { to: "/admin-polls", label: "Manage Polls" },
  ];

  const guardLinks = [
    { to: "/guard/dashboard", label: "Dashboard" },
    { to: "/guard-visitors", label: "Visitors" },
    { to: "/guard-deliveries", label: "Deliveries" },
    { to: "/guard-emergency", label: "Emergency" },
    { to: "/profile", label: "Profile" },
  ];

  const links =
    role === "admin"
      ? adminLinks
      : role === "guard"
      ? guardLinks
      : residentLinks;

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 shadow-xl backdrop-blur-xl dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-3"
        >
          <div className="rounded-2xl bg-white/15 p-2 backdrop-blur">
            <Building2
              size={28}
              className="text-white"
            />
          </div>

          <div className="hidden sm:block">
            <h1 className="text-lg font-bold tracking-wide text-white">
              Diamond Square
            </h1>

            <p className="text-xs text-emerald-100">
              Society Management
            </p>
          </div>
        </NavLink>

        <div className="hidden lg:flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={navClass}
            >
              {item.label}

              {location.pathname === item.to && (
                <motion.span
                  layoutId="navbar-active"
                  className="absolute inset-0 -z-10 rounded-xl bg-white"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 35,
                  }}
                />
              )}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <DarkModeToggle />

          <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-3 py-2 backdrop-blur">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold uppercase text-emerald-700">
              {(user.name || "U").charAt(0)}
            </div>

            <div className="hidden xl:block">
              <p className="text-sm font-semibold text-white">
                {user.name || "Resident"}
              </p>

              <p className="text-xs capitalize text-emerald-100">
                {role}
              </p>
            </div>

            <ChevronDown
              size={16}
              className="text-white"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600"
          >
            <LogOut size={18} />
            Logout
          </motion.button>
        </div>

        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="rounded-xl p-2 text-white lg:hidden"
        >
          {mobileOpen ? (
            <X size={28} />
          ) : (
            <Menu size={28} />
          )}
        </button>
      </div>
      