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
  Cake,
  Sparkles,
  MapPin,
  Send,
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
      console.error("No token found.");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    const endpoint =
      storedUser.role === "admin"
        ? "http://localhost:5000/api/dashboard/admin"
        : "http://localhost:5000/api/dashboard/resident";

    try {
      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      setDashboard(data);
    } catch (err) {
      console.error(err);
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
    "Registered Residents": <Users size={22} />,
    "Pending Approvals": <FileText size={22} />,
    "Visitors Today": <User size={22} />,
    "Open Complaints": <ClipboardList size={22} />,
    "Maintenance Due": <CreditCard size={22} />,
    "Active Notices": <Bell size={22} />,
    "Upcoming Events": <CalendarDays size={22} />,
    "Security Guards": <Users size={22} />,
    "My Complaints": <ClipboardList size={22} />,
    "Pending Complaints": <ClipboardList size={22} />,
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
      icon: <Users size={26} />,
      link: "/admin-residents",
    },
    {
      title: "Approvals",
      icon: <FileText size={26} />,
      link: "/admin-approvals",
    },
    {
      title: "Visitors",
      icon: <User size={26} />,
      link: "/admin-visitors",
    },
    {
      title: "Complaints",
      icon: <ClipboardList size={26} />,
      link: "/admin-complaints",
    },
    {
      title: "Maintenance",
      icon: <CreditCard size={26} />,
      link: "/admin-maintenance",
    },
    {
      title: "Notices",
      icon: <Bell size={26} />,
      link: "/admin-notices",
    },
    {
      title: "Documents",
      icon: <FolderOpen size={26} />,
      link: "/admin-documents",
    },
    {
      title: "Events",
      icon: <CalendarDays size={26} />,
      link: "/admin-events",
    },
    {
      title: "Payments",
      icon: <CreditCard size={26} />,
      link: "/admin-payments",
    },
    {
      title: "Notifications",
      icon: <Bell size={26} />,
      link: "/notifications",
    },
    {
      title: "Reports",
      icon: <FileText size={26} />,
      link: "/admin-reports",
    },
    {
      title: "Settings",
      icon: <Menu size={26} />,
      link: "/admin-settings",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-10">

        {/* Hero */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white shadow-xl mb-8">

          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-40 w-40 rounded-full bg-cyan-300/10 blur-2xl" />

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">

            <div>

              <p className="text-lg text-white/90">
                {getGreeting()}
              </p>

              <h1 className="text-5xl font-bold mt-2">
                {firstName} 👋
              </h1>

              <p className="mt-3 text-lg text-white/90">
                Welcome back to Diamond Square
              </p>

              <p className="mt-2 text-sm text-white/70">
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
              className="h-28 w-28 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:scale-105 transition"
            >
              <User size={60} />
            </Link>

          </div>

        </div>

        {/* What's New Today */}

        <div className="grid lg:grid-cols-2 gap-6 mb-8">

          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-md p-6">

            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="text-emerald-600" />
              <h2 className="text-xl font-bold dark:text-white">
                What's New
              </h2>
            </div>

            {(dashboard?.latestNotices || []).length > 0 ? (
              <div className="space-y-3">
                {dashboard.latestNotices.slice(0, 3).map((notice) => (
                  <div
                    key={notice.id}
                    className="flex gap-3 rounded-xl bg-slate-50 dark:bg-slate-700 p-4"
                  >
                    <Bell className="text-emerald-600 mt-1" size={18} />
                    <div>
                      <h3 className="font-medium dark:text-white">
                        {notice.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {new Date(notice.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                Nothing new today.
              </p>
            )}

          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-md p-6">

            <div className="flex items-center gap-2 mb-5">
              <Cake className="text-pink-500" />
              <h2 className="text-xl font-bold dark:text-white">
                Today's Celebrations
              </h2>
            </div>

            {(dashboard?.celebrations || []).length > 0 ? (
              <div className="space-y-4">
                {dashboard.celebrations.map((person) => (
                  <div
                    key={person.id}
                    className="rounded-2xl bg-pink-50 dark:bg-slate-700 p-4"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold dark:text-white">
                          {person.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {person.type}
                        </p>
                      </div>

                      <button className="flex items-center gap-2 rounded-lg bg-pink-500 px-4 py-2 text-white hover:bg-pink-600 transition">
                        <Send size={16} />
                        Wish
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No celebrations today 🎉
              </p>
            )}

          </div>

        </div>
        