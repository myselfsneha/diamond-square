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
                <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className={`rounded-3xl bg-gradient-to-r ${stat.color} p-6 text-white shadow-xl`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">
                    {stat.title}
                  </p>
                  <h2 className="mt-2 text-3xl font-bold">
                    {stat.value}
                  </h2>
                </div>

                <div className="rounded-2xl bg-white/20 p-4 backdrop-blur">
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 rounded-3xl border border-white/20 bg-white/70 p-8 shadow-xl backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/70"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold dark:text-white">
              Quick Actions
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Link
              to="/profile"
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
            >
              <User className="mb-4 text-blue-600" size={34} />
              <h3 className="font-bold dark:text-white">
                My Profile
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                View and update your account information.
              </p>
            </Link>

            <Link
              to="/change-password"
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
            >
              <Lock className="mb-4 text-purple-600" size={34} />
              <h3 className="font-bold dark:text-white">
                Change Password
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Keep your account secure with a new password.
              </p>
            </Link>

            <Link
              to="/complaints"
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
            >
              <FileText className="mb-4 text-red-500" size={34} />
              <h3 className="font-bold dark:text-white">
                My Complaints
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Track and manage complaint requests.
              </p>
            </Link>
          </div>
        </motion.div>

        <div className="mt-14">
          <h2 className="mb-6 text-3xl font-bold dark:text-white">
            Resident Services
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {residentCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.06 }}
              >
                <Link
                  to={card.link}
                  className={`group flex flex-col rounded-3xl bg-gradient-to-r ${card.color} p-7 text-white shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl`}
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div className="rounded-2xl bg-white/20 p-4 backdrop-blur">
                      {card.icon}
                    </div>

                    <span className="text-5xl">
                      {card.emoji}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold">
                    {card.title}
                  </h3>

                  <p className="mt-2 text-blue-100">
                    Open {card.title.toLowerCase()}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>