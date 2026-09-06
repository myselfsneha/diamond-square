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
    