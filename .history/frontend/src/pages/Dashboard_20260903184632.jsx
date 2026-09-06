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
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://diamond-square-backend.onrender.com/api/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
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