import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  User,
  Bell,
  Menu,
  FileText,
  ClipboardList,
  CreditCard,
  FolderOpen,
  Phone,
  CalendarDays,
  Users,
  ArrowRight,
} from "lucide-react";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [user, setUser] = useState({});
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);

    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found. Please log in again.");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    const endpoint =
      storedUser.role === "admin"
        ? "http://localhost:5000/api/dashboard/admin"
        : "http://localhost:5000/api/dashboard/resident";

    try {
      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log("Dashboard Data:", data);
      setDashboard(data);
    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return "☀️ Good Morning";
    if (hour >= 12 && hour < 17) return "🌤️ Good Afternoon";
    if (hour >= 17 && hour < 21) return "🌆 Good Evening";
    return "🌙 Good Night";
  };

  const firstName = user.name?.split(" ")[0] || "Resident";

  const statIcons = {
    "Registered Residents": <Users size={24} />,
    "Pending Approvals": <FileText size={24} />,
    "Visitors Today": <User size={24} />,
    "Open Complaints": <ClipboardList size={24} />,
    "Maintenance Due": <CreditCard size={24} />,
    "Active Notices": <Bell size={24} />,
    "Upcoming Events": <CalendarDays size={24} />,
    "Security Guards": <Users size={24} />,
  };

  const residentCards = [
    {
      title: "Notices",
      subtitle: "Latest society updates",
      icon: <Bell size={28} />,
      color: "bg-blue-100 text-blue-600",
      link: "/notices",
    },
    {
      title: "Complaints",
      subtitle: "Raise or track complaints",
      icon: <ClipboardList size={28} />,
      color: "bg-red-100 text-red-600",
      link: "/complaints",
    },
    {
      title: "Maintenance",
      subtitle: "Bills & Payments",
      icon: <CreditCard size={28} />,
      color: "bg-amber-100 text-amber-600",
      link: "/maintenance",
    },
    {
      title: "Documents",
      subtitle: "Society documents",
      icon: <FolderOpen size={28} />,
      color: "bg-indigo-100 text-indigo-600",
      link: "/documents",
    },
    {
      title: "Contacts",
      subtitle: "Emergency contacts",
      icon: <Phone size={28} />,
      color: "bg-cyan-100 text-cyan-600",
      link: "/contacts",
    },
    {
      title: "Profile",
      subtitle: "Manage account",
      icon: <User size={28} />,
      color: "bg-emerald-100 text-emerald-600",
      link: "/profile",
    },
  ];

  const adminCards = [
    {
      title: "Residents",
      icon: <Users size={28} />,
      link: "/admin-residents",
    },
    {
      title: "Approvals",
      icon: <FileText size={28} />,
      link: "/admin-approvals",
    },
    {
      title: "Visitors",
      icon: <User size={28} />,
      link: "/admin-visitors",
    },
    {
      title: "Complaints",
      icon: <ClipboardList size={28} />,
      link: "/admin-complaints",
    },
        {
      title: "Maintenance",
      icon: <CreditCard size={28} />,
      link: "/admin-maintenance",
    },
    {
      title: "Notices",
      icon: <Bell size={28} />,
      link: "/admin-notices",
    },
    {
      title: "Documents",
      icon: <FolderOpen size={28} />,
      link: "/admin-documents",
    },
    {
      title: "Events",
      icon: <CalendarDays size={28} />,
      link: "/admin-events",
    },
    {
      title: "Payments",
      icon: <CreditCard size={28} />,
      link: "/admin-payments",
    },
    {
      title: "Notifications",
      icon: <Bell size={28} />,
      link: "/notifications",
    },
    {
      title: "Reports",
      icon: <FileText size={28} />,
      link: "/admin-reports",
    },
    {
      title: "Settings",
      icon: <Menu size={28} />,
      link: "/admin-settings",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-10">

        {/* Hero */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 text-white shadow-xl mb-10">

          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative">

            <div>

              <p className="text-lg text-white/90">
                {getGreeting()}
              </p>

              <h1 className="text-5xl font-bold mt-2">
                {firstName} 👋
              </h1>

              <p className="mt-3 text-white/90 text-lg">
                Welcome back to Diamond Square
              </p>

              <p className="text-white/70 mt-2">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              <div className="flex flex-wrap gap-3 mt-6">

                <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur">
                  {user.role === "admin"
                    ? "🛡 Administrator"
                    : "👤 Resident"}
                </span>

                <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur">
                  🏠 Flat{" "}
                  {user.flat_number ||
                    user.flatNumber ||
                    user.flat ||
                    "--"}
                </span>

              </div>

            </div>

            <Link
              to="/profile"
              className="h-28 w-28 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:scale-105 transition duration-300"
            >
              <User size={60} />
            </Link>

          </div>

        </div>

        {/* Society Overview */}

        <h2 className="text-2xl font-bold mb-5 dark:text-white">
          Society Overview
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {(dashboard?.stats || []).map((item) => (
            <div
              key={item.title}
              className="group bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-5">

                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  {statIcons[item.title]}
                </div>

              </div>

              <h3 className="text-3xl font-bold dark:text-white">
                {loading ? "..." : item.value}
              </h3>

              <p className="mt-2 text-gray-500 dark:text-gray-400 font-medium">
                {item.title}
              </p>

            </div>
          ))}
        </div>
        