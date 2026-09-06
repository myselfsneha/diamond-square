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