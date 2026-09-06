import { useState, useMemo, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Building2,
  LogOut,
  User,
  Bell,
  ChevronDown,
  MoreHorizontal,
  Settings,
  FileText,
  Users,
  Shield,
  CreditCard,
  Phone,
  FolderOpen,
} from "lucide-react";
import { toast } from "react-toastify";
import DarkModeToggle from "./DarkModeToggle";

function Navbar() {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const profileRef = useRef(null);
  const moreRef = useRef(null);

  const user = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "{}"),
    []
  );

  const role =
    localStorage.getItem("role") ||
    user.role ||
    "resident";

  const firstName =
    user.name?.split(" ")[0] || "Resident";

  useEffect(() => {
    const handleClick = (e) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setProfileOpen(false);
      }

      if (
        moreRef.current &&
        !moreRef.current.contains(e.target)
      ) {
        setMoreOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClick
      );
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const navClass = ({ isActive }) =>
    `px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
      isActive
        ? "bg-white text-blue-700 shadow"
        : "text-white hover:bg-white/10"
    }`;

  const mainLinks =
    role === "admin"
      ? [
          {
            to: "/dashboard",
            label: "Dashboard",
          },
          {
            to: "/admin-residents",
            label: "Residents",
          },
          {
            to: "/admin-complaints",
            label: "Complaints",
          },
          {
            to: "/admin-notices",
            label: "Notices",
          },
          {
            to: "/admin-maintenance",
            label: "Maintenance",
          },
          {
            to: "/admin-events",
            label: "Events",
          },
        ]
      : [
          {
            to: "/dashboard",
            label: "Dashboard",
          },
          {
            to: "/complaints",
            label: "Complaints",
          },
          {
            to: "/notices",
            label: "Notices",
          },
          {
            to: "/maintenance",
            label: "Maintenance",
          },
          {
            to: "/events",
            label: "Events",
          },
        ];

  const moreLinks =
    role === "admin"
      ? [
          {
            to: "/admin-approvals",
            label: "Approvals",
            icon: <Users size={16} />,
          },
          {
            to: "/admin-visitors",
            label: "Visitors",
            icon: <Users size={16} />,
          },
          {
            to: "/admin-payments",
            label: "Payments",
            icon: <CreditCard size={16} />,
          },
          {
            to: "/admin-documents",
            label: "Documents",
            icon: <FolderOpen size={16} />,
          },
          {
            to: "/admin-contacts",
            label: "Contacts",
            icon: <Phone size={16} />,
          },
          {
            to: "/admin-guards",
            label: "Security Guards",
            icon: <Shield size={16} />,
          },
          {
            to: "/admin-polls",
            label: "Polls",
            icon: <FileText size={16} />,
          },
        ]
      : [
          {
            to: "/documents",
            label: "Documents",
            icon: <FolderOpen size={16} />,
          },
          {
            to: "/contacts",
            label: "Contacts",
            icon: <Phone size={16} />,
          },
          {
            to: "/visitors",
            label: "Visitors",
            icon: <Users size={16} />,
          },
          {
            to: "/polls",
            label: "Polls",
            icon: <FileText size={16} />,
          },
        ];

  return (
    <nav className="sticky top-0 z-50 bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-6">

        <div className="h-16 flex items-center justify-between">

          <NavLink
            to="/dashboard"
            className="flex items-center gap-2 text-white font-bold text-xl"
          >
            <Building2 size={28} />
            Diamond Square
          </NavLink>

          <div className="hidden lg:flex items-center gap-2">

            {mainLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={navClass}
              >
                {item.label}
              </NavLink>
            ))}

            {/* PART 2 */}