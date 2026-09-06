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

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);
  }, []);

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
      subtitle: "Bills & payments",
      icon: <CreditCard size={30} />,
      link: "/maintenance",
    },
    {
      title: "Documents",
      subtitle: "Society files",
      icon: <FolderOpen size={30} />,
      link: "/documents",
    },
    {
      title: "Contacts",
      subtitle: "Important contacts",
      icon: <Phone size={30} />,
      link: "/contacts",
    },
    {
      title: "Profile",
      subtitle: "Manage your account",
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

        {/* Welcome Header */}

        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white p-8 shadow-xl mb-8">

          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">

            <div>

              <p className="text-lg opacity-90">
                {getGreeting()}
              </p>

              <h1 className="text-4xl md:text-5xl font-bold mt-2">
                {firstName} 👋
              </h1>

              <p className="mt-3 text-emerald-50 text-lg">
                Welcome back to <span className="font-semibold">Golden Palms Society</span>
              </p>

              <div className="flex flex-wrap gap-3 mt-6">

                <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur">
                  {user.role === "admin" ? "🛡 Administrator" : "👤 Resident"}
                </span>

                <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur">
                  🏢 D Block
                </span>

                <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur">
                  🏠 Flat {user.flat_number || user.flatNumber || user.flat || "N/A"}
                </span>

              </div>

            </div>

            <div className="h-32 w-32 rounded-full bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">

              <User size={64} />

            </div>

          </div>

        </div>

        {/* Society Overview */}

        <h2 className="text-2xl font-bold mb-5 dark:text-white">
          Society Overview
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow">
            <h3 className="text-gray-500 text-sm">Residents</h3>
            <p className="text-3xl font-bold mt-2 dark:text-white">54</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow">
            <h3 className="text-gray-500 text-sm">Visitors Today</h3>
            <p className="text-3xl font-bold mt-2 dark:text-white">8</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow">
            <h3 className="text-gray-500 text-sm">Open Complaints</h3>
            <p className="text-3xl font-bold mt-2 dark:text-white">3</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow">
            <h3 className="text-gray-500 text-sm">Maintenance Due</h3>
            <p className="text-3xl font-bold mt-2 dark:text-white">5</p>
          </div>

        </div>

        {/* Quick Access */}

        <h2 className="text-2xl font-bold mb-5 dark:text-white">
          Quick Access
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">          {residentCards.map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className="group bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition">

                {card.icon}

              </div>

              <h3 className="text-xl font-semibold dark:text-white">
                {card.title}
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                {card.subtitle}
              </p>

            </Link>
          ))}
        </div>

        {user.role === "admin" && (
          <>
            <div className="flex items-center justify-between mt-12 mb-5">

              <h2 className="text-2xl font-bold dark:text-white">
                Administration
              </h2>

              <span className="text-sm bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full">
                Admin Access
              </span>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

              {adminCards.map((card) => (
                <Link
                  key={card.title}
                  to={card.link}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >

                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-emerald-600 mb-4">

                    {card.icon}

                  </div>

                  <h3 className="font-semibold text-lg dark:text-white">
                    {card.title}
                  </h3>

                </Link>
              ))}

            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Dashboard;</div>