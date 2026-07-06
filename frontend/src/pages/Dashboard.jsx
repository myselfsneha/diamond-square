import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { User, Edit, Lock } from "lucide-react";
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
      icon: "📢",
      link: "/notices",
      color: "bg-blue-500",
    },
    {
      title: "Complaints",
      icon: "📝",
      link: "/complaints",
      color: "bg-red-500",
    },
    {
      title: "Maintenance",
      icon: "💳",
      link: "/maintenance",
      color: "bg-green-500",
    },
    {
      title: "Documents",
      icon: "📂",
      link: "/documents",
      color: "bg-purple-500",
    },
    {
      title: "Contacts",
      icon: "📞",
      link: "/contacts",
      color: "bg-yellow-500",
    },
    {
      title: "Profile",
      icon: "👤",
      link: "/profile",
      color: "bg-indigo-500",
    },
  ];

  const adminCards = [
    { title: "Pending Approvals", link: "/admin-approvals" },
    { title: "Residents", link: "/admin-residents" },
    { title: "Visitors", link: "/admin-visitors" },
    { title: "Complaints", link: "/admin-complaints" },
    { title: "Maintenance", link: "/admin-maintenance" },
    { title: "Notices", link: "/admin-notices" },
    { title: "Documents", link: "/admin-documents" },
    { title: "Events", link: "/admin-events" },
    { title: "Payments", link: "/admin-payments" },
    { title: "Notifications", link: "/notifications" },
    { title: "Reports", link: "/admin-reports" },
    { title: "Settings", link: "/admin-settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 relative z-0">
      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto p-6 pt-24">

        {/* Profile Card */}
        <div className="relative z-20 mb-10 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center">

          <Link
            to="/profile"
            className="flex items-center gap-6 hover:scale-[1.02] transition cursor-pointer"
          >
            <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center">
              <User size={50} />
            </div>

            <div>
              <h1 className="text-4xl font-bold">
                {user.name || "Resident"}
              </h1>

              <p className="uppercase opacity-90 mt-2">
                {user.role || "Resident"}
              </p>

             <p className="opacity-80">
  Flat {user.flat_number || user.flatNumber || user.flat || "N/A"}
</p>
            </div>
          </Link>

          <div className="relative z-30 flex gap-4 mt-6 md:mt-0">

            <Link
              to="/profile"
              className="cursor-pointer bg-white text-blue-600 px-6 py-4 rounded-2xl font-semibold flex items-center gap-2 hover:scale-105 transition"
            >
              <Edit size={20} />
              Edit Profile
            </Link>

            <Link
              to="/change-password"
              className="cursor-pointer bg-purple-700 px-6 py-4 rounded-2xl font-semibold flex items-center gap-2 hover:bg-purple-800 transition"
            >
              <Lock size={20} />
              Change Password
            </Link>

          </div>
        </div>
                {/* Resident Services */}

        <h2 className="text-2xl font-bold mb-5 dark:text-white">
          Resident Services
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">

          {residentCards.map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className={`${card.color} rounded-2xl p-6 text-white shadow-lg hover:scale-105 transition`}
            >
              <div className="text-5xl mb-3">
                {card.icon}
              </div>

              <div className="font-semibold text-lg">
                {card.title}
              </div>
            </Link>
          ))}

        </div>

        {/* Admin Panel */}

        {user.role === "admin" && (
          <>
            <h2 className="text-2xl font-bold mt-12 mb-5 dark:text-white">
              Admin Panel
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

              {adminCards.map((card) => (
                <Link
                  key={card.title}
                  to={card.link}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow hover:bg-blue-50 dark:hover:bg-gray-700 transition hover:scale-105"
                >
                  <h3 className="font-semibold dark:text-white">
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

export default Dashboard;