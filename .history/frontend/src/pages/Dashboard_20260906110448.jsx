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
} from "lucide-react";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [user, setUser] =useState({});
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

      console.log(data);

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

  // Demo placeholders until backend is ready
  const todayItems = [
    {
      icon: <Bell size={16} />,
      text: "Water supply maintenance from 2 PM to 4 PM",
    },
    {
      icon: <CalendarDays size={16} />,
      text: "Society Meeting this Sunday",
    },
    {
      icon: <Sparkles size={16} />,
      text: "Ganesh Festival in 3 days",
    },
  ];

  const celebrations = [
    {
      name: "Rahul Sharma",
      type: "Birthday",
    },
    {
      name: "Amit & Priya",
      type: "Anniversary",
    },
  ];