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

  const residentCards = [
    {
      title: "Notices",
      subtitle: "Latest society updates",
      icon: <Bell size={30} />,
      link: "/notices",
    },
    {
      title: "Complaints",
      subtitle: "Raise or track complaints",
      icon: <ClipboardList size={30} />,
      link: "/complaints",
    },
    {
      title: "Maintenance",
      subtitle: "Bills & Payments",
      icon: <CreditCard size={30} />,
      link: "/maintenance",
    },
    {
      title: "Documents",
      subtitle: "Society documents",
      icon: <FolderOpen size={30} />,
      link: "/documents",
    },
    {
      title: "Contacts",
      subtitle: "Emergency contacts",
      icon: <Phone size={30} />,
      link: "/contacts",
    },
    {
      title: "Profile",
      subtitle: "Manage account",
      icon: <User size={30} />,
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

        {/* Welcome */}

        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white shadow-xl mb-8">

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

            <div>

              <p className="text-lg opacity-90">
                {getGreeting()}
              </p>

              <h1 className="text-4xl md:text-5xl font-bold mt-2">
                {firstName} 👋
              </h1>

              <p className="mt-3 text-lg opacity-90">
                Welcome back to Diamond Square
              </p>

              <div className="flex flex-wrap gap-3 mt-6">

                <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur">
                  {user.role === "admin" ? "🛡 Administrator" : "👤 Resident"}
                </span>

                <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur">
                  🏠 Flat {user.flat_number || user.flatNumber || user.flat || "--"}
                </span>

              </div>

            </div>

            <Link
              to="/profile"
              className="h-32 w-32 rounded-full bg-white/20 flex items-center justify-center hover:scale-105 transition"
            >
              <User size={64} />
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
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.title}
              </p>

              <h3 className="text-3xl font-bold dark:text-white">
                {loading ? "..." : item.value}
              </h3>
            </div>
          ))}
        </div>

        {/* Quick Access */}

        <h2 className="text-2xl font-bold mb-5 dark:text-white">
          Quick Access
        </h2>
        