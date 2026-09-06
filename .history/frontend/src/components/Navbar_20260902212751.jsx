import { useState, useMemo, useRef, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Building2,
  LogOut,
  Bell,
  Settings,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

import DarkModeToggle from "./DarkModeToggle";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  const user = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "{}"),
    []
  );

  const role =
    localStorage.getItem("role") ||
    user.role ||
    "resident";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

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
    { to: "/notices", label: "Notices" },
    { to: "/maintenance", label: "Maintenance" },
    { to: "/complaints", label: "Complaints" },
    { to: "/polls", label: "Polls" },
    { to: "/contacts", label: "Contacts" },
    { to: "/notifications", label: "Notifications" },
    { to: "/profile", label: "Profile" },
  ];

  const adminLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/admin-approvals", label: "Approvals" },
    { to: "/admin-residents", label: "Residents" },
    { to: "/admin-notices", label: "Notices" },
    { to: "/admin-complaints", label: "Complaints" },
    { to: "/admin-maintenance", label: "Maintenance" },
    { to: "/admin-events", label: "Events" },
    { to: "/admin-payments", label: "Payments" },
    { to: "/admin-visitors", label: "Visitors" },
    { to: "/admin-guards", label: "Guards" },
    { to: "/admin-documents", label: "Documents" },
    { to: "/admin-polls", label: "Polls" },
    { to: "/admin-contacts", label: "Contacts" },
    { to: "/profile", label: "Profile" },
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
  <nav className="z-50 border-b border-white/10 bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 shadow-xl dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
      <NavLink
        to="/dashboard"
        className="flex items-center gap-3"
      >
        <div className="rounded-2xl bg-white/15 p-2">
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

      <div className="hidden lg:flex items-center gap-2">
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

        <button className="relative rounded-xl bg-white/10 p-2 text-white transition hover:bg-white/20">
          <Bell size={20} />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        <div
          ref={profileRef}
          className="relative"
        >
          <button
            onClick={() =>
              setProfileOpen((prev) => !prev)
            }
            className="flex items-center gap-3 rounded-2xl bg-white/10 px-3 py-2 transition hover:bg-white/20"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold uppercase text-emerald-700">
              {(user.name || "U").charAt(0)}
            </div>

            <div className="hidden xl:block text-left">
              <p className="text-sm font-semibold text-white">
                {user.name || "Resident"}
              </p>

              <p className="text-xs capitalize text-emerald-100">
                {role}
              </p>
            </div>
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                }}
                className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
              >
                <button
                  onClick={() => {
                    navigate("/profile");
                    setProfileOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  <User size={18} />
                  Profile
                </button>

                <button
                  onClick={() => {
                    navigate("/settings");
                    setProfileOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  <Settings size={18} />
                  Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
    