import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Edit,
  Lock,
  Bell,
  FileText,
  CreditCard,
  FolderOpen,
  Phone,
  Shield,
  Users,
  ClipboardList,
  CalendarDays,
  Settings,
  BarChart3,
  Wallet,
  Megaphone,
  Building2,
  BadgeCheck,
} from "lucide-react";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);
  }, []);

  const residentCards = [
    {
      title: "Notices",
      icon: <Bell size={28} />,
      emoji: "📢",
      link: "/notices",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Complaints",
      icon: <FileText size={28} />,
      emoji: "📝",
      link: "/complaints",
      color: "from-red-500 to-pink-500",
    },
    {
      title: "Maintenance",
      icon: <CreditCard size={28} />,
      emoji: "💳",
      link: "/maintenance",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Documents",
      icon: <FolderOpen size={28} />,
      emoji: "📂",
      link: "/documents",
      color: "from-purple-500 to-violet-500",
    },
    {
      title: "Contacts",
      icon: <Phone size={28} />,
      emoji: "📞",
      link: "/contacts",
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Profile",
      icon: <User size={28} />,
      emoji: "👤",
      link: "/profile",
      color: "from-indigo-500 to-blue-500",
    },
  ];

  const adminCards = [
    {
      title: "Pending Approvals",
      icon: <BadgeCheck size={24} />,
      link: "/admin-approvals",
    },
    {
      title: "Residents",
      icon: <Users size={24} />,
      link: "/admin-residents",
    },
    {
      title: "Visitors",
      icon: <Shield size={24} />,
      link: "/admin-visitors",
    },
    {
      title: "Complaints",
      icon: <ClipboardList size={24} />,
      link: "/admin-complaints",
    },
    {
      title: "Maintenance",
      icon: <Wallet size={24} />,
      link: "/admin-maintenance",
    },
    {
      title: "Notices",
      icon: <Megaphone size={24} />,
      link: "/admin-notices",
    },
    {
      title: "Documents",
      icon: <FolderOpen size={24} />,
      link: "/admin-documents",
    },
    {
      title: "Events",
      icon: <CalendarDays size={24} />,
      link: "/admin-events",
    },
    {
      title: "Payments",
      icon: <CreditCard size={24} />,
      link: "/admin-payments",
    },
    {
      title: "Notifications",
      icon: <Bell size={24} />,
      link: "/notifications",
    },
    {
      title: "Reports",
      icon: <BarChart3 size={24} />,
      link: "/admin-reports",
    },
    {
      title: "Settings",
      icon: <Settings size={24} />,
      link: "/admin-settings",
    },
  ];

  const stats = useMemo(
    () => [
      {
        title: "Role",
        value: (user.role || "Resident").toUpperCase(),
        icon: <Shield size={22} />,
        color: "from-indigo-500 to-blue-600",
      },
      {
        title: "Flat",
        value:
          user.flat_number ||
          user.flatNumber ||
          user.flat ||
          "N/A",
        icon: <Building2 size={22} />,
        color: "from-green-500 to-emerald-600",
      },
      {
        title: "Services",
        value: residentCards.length,
        icon: <FolderOpen size={22} />,
        color: "from-purple-500 to-pink-600",
      },
      {
        title: "Admin Modules",
        value: adminCards.length,
        icon: <Settings size={22} />,
        color: "from-orange-500 to-red-500",
      },
    ],
    [user]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-8 text-white shadow-2xl"
        >
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-52 w-52 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <Link
              to="/profile"
              className="flex items-center gap-6"
            >
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white/20 bg-white/10 backdrop-blur-xl">
                <User size={56} />
              </div>

              <div>
                <h1 className="text-4xl font-bold">
                  {user.name || "Resident"}
                </h1>

                <p className="mt-2 text-lg uppercase tracking-widest text-blue-100">
                  {user.role || "Resident"}
                </p>

                <p className="mt-1 text-blue-100">
                  Flat{" "}
                  {user.flat_number ||
                    user.flatNumber ||
                    user.flat ||
                    "N/A"}
                </p>
              </div>
            </Link>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-2xl bg-white px-6 py-4 font-semibold text-blue-700 shadow-lg transition hover:scale-105"
              >
                <Edit size={20} />
                Edit Profile
              </Link>

              <Link
                to="/change-password"
                className="flex items-center gap-2 rounded-2xl bg-purple-900/70 px-6 py-4 font-semibold backdrop-blur-lg transition hover:bg-purple-950"
              >
                <Lock size={20} />
                Change Password
              </Link>
            </div>
          </div>
        </motion.div>
        