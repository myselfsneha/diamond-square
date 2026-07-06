// AdminDashboard page
// Minor harmless comment to ensure file parses correctly
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

function Skeleton({ className }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200 ${className}`}
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
        stats.totalComplaints -
        stats.resolvedComplaints,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      <Navbar />

      {loading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-blue-600 animate-pulse z-50" />
      )}

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-7xl mx-auto px-6 py-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">

          <div>
            <h1 className="text-4xl font-bold text-slate-800">
              Admin Dashboard
            </h1>

            <p className="text-slate-500 mt-2">
              Welcome back! Here's what's happening today.
            </p>

            <p className="text-xs text-slate-400 mt-1">
              Last Updated : {lastUpdated || "--"}
            </p>
          </div>

          <button
            onClick={() => fetchDashboard()}
            className="mt-4 lg:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-3 rounded-xl shadow-lg"
          >
            <RefreshCcw
              size={18}
              className={loading ? "animate-spin" : ""}
            />
            Refresh Dashboard
          </button>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">

          {dashboardCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex justify-between items-center">

                  <div>

                    <p className="text-gray-500">
                      {card.title}
                    </p>

                    {loading ? (
                      <Skeleton className="h-10 w-24 mt-3" />
                    ) : (
                      <h2 className="text-4xl font-bold mt-3">
                        {card.value}
                      </h2>
                    )}

                    <div className="flex items-center gap-1 mt-4">

                      {card.positive ? (
                        <ArrowUpRight
                          size={18}
                          className="text-green-600"
                        />
                      ) : (
                        <ArrowDownRight
                          size={18}
                          className="text-red-600"
                        />
                      )}

                      <span
                        className={`font-semibold ${
                          card.positive
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {card.trend}
                      </span>

                    </div>

                  </div>

                  <div
                    className={`bg-gradient-to-br ${card.gradient} p-5 rounded-2xl text-white`}
                  >
                    <Icon size={34} />
                  </div>

                </div>
              </motion.div>
            );
          })}

        </div>
              <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl animate-fade-in">
          <h2 className="text-xl font-semibold mb-4">
            Society Statistics
          </h2>

          {loading ? (
            <div className="h-[300px] animate-pulse rounded-xl bg-slate-200" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="#2563eb"
                  radius={[8, 8, 0, 0]}
                  animationDuration={1200}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl animate-fade-in">
          <h2 className="text-xl font-semibold mb-4">
            Complaint Status
          </h2>

          {loading ? (
            <div className="h-[300px] animate-pulse rounded-xl bg-slate-200" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={100}
                  label
                  animationDuration={1200}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index]}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Complaints */}

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-fade-in">
        <h2 className="text-xl font-semibold mb-4">
          Recent Complaints
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-100">
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Resident</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-4">
                      <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
                    </td>
                    <td className="p-4">
                      <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : recentComplaints.length > 0 ? (
                recentComplaints.map((complaint) => (
                  <tr
                    key={complaint.id}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    <td className="p-3">{complaint.title}</td>

                    <td className="p-3">{complaint.name}</td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          complaint.status === "Resolved"
                            ? "bg-green-100 text-green-700"
                            : complaint.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </td>

                    <td className="p-3">
                      {new Date(
                        complaint.created_at
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center p-6 text-slate-500"
                  >
                    No complaints found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
            {/* Recent Complaints */}
      <div
        className={`bg-white rounded-2xl shadow-lg border border-slate-200 p-6 transition-all duration-500 ${
          loading ? "animate-pulse" : "animate-fade-in"
        }`}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-slate-800">
            Recent Complaints
          </h2>

          <span className="text-sm text-slate-500">
            {recentComplaints.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Resident</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Date</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b">
                    {[...Array(4)].map((__, j) => (
                      <td key={j} className="p-3">
                        <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : recentComplaints.length > 0 ? (
                recentComplaints.map((complaint) => (
                  <tr
                    key={complaint.id}
                    className="border-b hover:bg-slate-50 transition"
                  >
                    <td className="p-3 font-medium">
                      {complaint.title}
                    </td>

                    <td className="p-3">
                      {complaint.name}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          complaint.status === "Resolved"
                            ? "bg-green-100 text-green-700"
                            : complaint.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </td>

                    <td className="p-3">
                      {new Date(
                        complaint.created_at
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center p-6 text-slate-500"
                  >
                    No complaints available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Residents */}
      <div
        className={`bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mt-8 transition-all duration-500 ${
          loading ? "animate-pulse" : "animate-fade-in"
        }`}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-slate-800">
            Recent Residents
          </h2>

          <span className="text-sm text-slate-500">
            {recentResidents.length} Residents
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Flat</th>
                <th className="text-left p-3">Phone</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(4)].map((__, j) => (
                      <td key={j} className="p-3">
                        <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : recentResidents.length > 0 ? (
                recentResidents.map((resident) => (
                  <tr
                    key={resident.id}
                    className="border-b hover:bg-slate-50 transition"
                  >
                    <td className="p-3 font-medium">
                      {resident.name}
                    </td>

                    <td className="p-3">
                      {resident.flat_number}
                    </td>

                    <td className="p-3">
                      {resident.phone}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          resident.approval_status === "approved"
                            ? "bg-green-100 text-green-700"
                            : resident.approval_status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {resident.approval_status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center p-6 text-slate-500"
                  >
                    No residents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
            {/* Bottom Section */}
      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        {/* Upcoming Events */}
        <div
          className={`bg-white rounded-2xl shadow-lg border border-slate-200 p-6 transition-all duration-500 ${
            loading ? "animate-pulse" : "animate-fade-in"
          }`}
        >
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-slate-800">
              Upcoming Events
            </h2>

            <span className="text-sm text-slate-500">
              {upcomingEvents.length} Events
            </span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 rounded-xl bg-slate-200 animate-pulse"
                />
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex justify-between items-center p-4 rounded-xl border hover:bg-blue-50 transition-all duration-300 hover:shadow-md"
                >
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {event.title}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {event.location}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-blue-600 font-semibold">
                      {new Date(
                        event.event_date
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500">
              No upcoming events.
            </div>
          )}
        </div>

        {/* System Status */}
        <div
          className={`bg-white rounded-2xl shadow-lg border border-slate-200 p-6 transition-all duration-500 ${
            loading ? "animate-pulse" : "animate-fade-in"
          }`}
        >
          <h2 className="text-xl font-bold text-slate-800 mb-6">
            System Status
          </h2>

          <div className="space-y-5">

            <div className="flex justify-between items-center">
              <span className="text-slate-600">
                Backend API
              </span>

              <span className="flex items-center gap-2 text-green-600 font-semibold">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                Online
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-600">
                Database
              </span>

              <span className="flex items-center gap-2 text-green-600 font-semibold">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                Connected
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-600">
                Authentication
              </span>

              <span className="flex items-center gap-2 text-green-600 font-semibold">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                Active
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-600">
                Dashboard Refresh
              </span>

              <span className="text-blue-600 font-semibold">
                Every 30 sec
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-600">
                Last Updated
              </span>

              <span className="font-semibold text-slate-700">
                {lastUpdated || "--"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-600">
                Current Time
              </span>

              <span className="font-semibold text-slate-700">
                {new Date().toLocaleTimeString()}
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;