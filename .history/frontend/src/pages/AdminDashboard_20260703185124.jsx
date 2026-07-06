// AdminDashboard.jsx (Part 1)

import { useEffect, useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  CalendarDays,
  Shield,
  RefreshCcw,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { motion } from "framer-motion";

import Navbar from "../components/Navbar";
import api from "../services/api";

import DataTable from "../components/table/DataTable";
import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

function Skeleton({ className }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200 dark:bg-gray-700 ${className}`}
    />
  );
}

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  const [stats, setStats] = useState({
    totalMembers: 0,
    pendingApprovals: 0,
    totalComplaints: 0,
    resolvedComplaints: 0,
    totalEvents: 0,
    totalPolls: 0,
    totalGuards: 0,
    totalNotices: 0,
  });

  const [recentComplaints, setRecentComplaints] = useState([]);
  const [recentResidents, setRecentResidents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const [complaintSearch, setComplaintSearch] = useState("");
  const [residentSearch, setResidentSearch] = useState("");

  const [complaintPage, setComplaintPage] = useState(1);
  const [residentPage, setResidentPage] = useState(1);

  const rowsPerPage = 5;

  useEffect(() => {
    fetchDashboard();

    const interval = setInterval(() => {
      fetchDashboard(false);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboard = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);

      const res = await api.get("/dashboard/stats");
      const data = res.data || {};

      setStats({
        totalMembers: data.totalMembers || 0,
        pendingApprovals: data.pendingApprovals || 0,
        totalComplaints: data.totalComplaints || 0,
        resolvedComplaints: data.resolvedComplaints || 0,
        totalEvents: data.totalEvents || 0,
        totalPolls: data.totalPolls || 0,
        totalGuards: data.totalGuards || 0,
        totalNotices: data.totalNotices || 0,
      });

      setRecentComplaints(
        Array.isArray(data.recentComplaints)
          ? data.recentComplaints
          : []
      );

      setRecentResidents(
        Array.isArray(data.recentResidents)
          ? data.recentResidents
          : []
      );

      setUpcomingEvents(
        Array.isArray(data.upcomingEvents)
          ? data.upcomingEvents
          : []
      );

      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error(err);
      setRecentComplaints([]);
      setRecentResidents([]);
      setUpcomingEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: "Residents",
      value: stats.totalMembers,
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      trend: "+8%",
      positive: true,
    },
    {
      title: "Pending Approvals",
      value: stats.pendingApprovals,
      icon: UserCheck,
      gradient: "from-orange-500 to-yellow-500",
      trend: "-2%",
      positive: false,
    },
    {
      title: "Open Complaints",
      value:
        stats.totalComplaints - stats.resolvedComplaints,
      icon: AlertTriangle,
      gradient: "from-red-500 to-pink-500",
      trend: "+5%",
      positive: false,
    },
    {
      title: "Resolved",
      value: stats.resolvedComplaints,
      icon: CheckCircle2,
      gradient: "from-green-500 to-emerald-500",
      trend: "+14%",
      positive: true,
    },
    {
      title: "Events",
      value: stats.totalEvents,
      icon: CalendarDays,
      gradient: "from-purple-500 to-indigo-500",
      trend: "+3%",
      positive: true,
    },
    {
      title: "Guards",
      value: stats.totalGuards,
      icon: Shield,
      gradient: "from-slate-700 to-slate-900",
      trend: "0%",
      positive: true,
    },
  ];

  const chartData = useMemo(
    () => [
      {
        name: "Members",
        value: stats.totalMembers,
      },
      {
        name: "Complaints",
        value: stats.totalComplaints,
      },
      {
        name: "Events",
        value: stats.totalEvents,
      },
      {
        name: "Notices",
        value: stats.totalNotices,
      },
    ],
    [stats]
  );

  const pieData = [
    {
      name: "Resolved",
      value: stats.resolvedComplaints,
    },
    {
      name: "Pending",
      value:
        stats.totalComplaints -
        stats.resolvedComplaints,
    },
  ];

  const COLORS = ["#22c55e", "#ef4444"];
  