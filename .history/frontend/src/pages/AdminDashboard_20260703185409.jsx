// AdminDashboard.jsx (Part 1/2)

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

  const filteredComplaints = useMemo(() => {
    return recentComplaints.filter((item) =>
      `${item.title} ${item.name} ${item.status}`
        .toLowerCase()
        .includes(complaintSearch.toLowerCase())
    );
  }, [recentComplaints, complaintSearch]);

  const filteredResidents = useMemo(() => {
    return recentResidents.filter((item) =>
      `${item.name} ${item.flat_number} ${item.phone}`
        .toLowerCase()
        .includes(residentSearch.toLowerCase())
    );
  }, [recentResidents, residentSearch]);

  const complaintTotalPages = Math.max(
    1,
    Math.ceil(filteredComplaints.length / rowsPerPage)
  );

  const residentTotalPages = Math.max(
    1,
    Math.ceil(filteredResidents.length / rowsPerPage)
  );

  const complaintRows = filteredComplaints
    .slice(
      (complaintPage - 1) * rowsPerPage,
      complaintPage * rowsPerPage
    )
    .map((item) => ({
      title: item.title,
      resident: item.name,
      status: (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            item.status === "Resolved"
              ? "bg-green-100 text-green-700"
              : item.status === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {item.status}
        </span>
      ),
      date: new Date(item.created_at).toLocaleDateString(),
    }));

  const residentRows = filteredResidents
    .slice(
      (residentPage - 1) * rowsPerPage,
      residentPage * rowsPerPage
    )
    .map((item) => ({
      name: item.name,
      flat: item.flat_number,
      phone: item.phone,
      status: (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            item.approval_status === "approved"
              ? "bg-green-100 text-green-700"
              : item.approval_status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {item.approval_status}
        </span>
      ),
    }));

  const complaintColumns = [
    { key: "title", label: "Title" },
    { key: "resident", label: "Resident" },
    { key: "status", label: "Status" },
    { key: "date", label: "Date" },
  ];

  const residentColumns = [
    { key: "name", label: "Name" },
    { key: "flat", label: "Flat" },
    { key: "phone", label: "Phone" },
    { key: "status", label: "Status" },
  ];
  // AdminDashboard.jsx (Part 2/2)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
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
        {/* Dashboard Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              Admin Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Welcome back! Here's what's happening today.
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Last Updated : {lastUpdated || "--"}
            </p>
          </div>

          <button
            onClick={() => fetchDashboard()}
            className="mt-5 lg:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
          >
            <RefreshCcw
              size={18}
              className={loading ? "animate-spin" : ""}
            />
            Refresh Dashboard
          </button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
          {dashboardCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500">{card.title}</p>

                    {loading ? (
                      <Skeleton className="h-10 w-20 mt-3" />
                    ) : (
                      <h2 className="text-4xl font-bold mt-3 dark:text-white">
                        {card.value}
                      </h2>
                    )}

                    <div className="flex items-center gap-2 mt-4">
                      {card.positive ? (
                        <ArrowUpRight
                          className="text-green-600"
                          size={18}
                        />
                      ) : (
                        <ArrowDownRight
                          className="text-red-600"
                          size={18}
                        />
                      )}

                      <span
                        className={
                          card.positive
                            ? "text-green-600 font-semibold"
                            : "text-red-600 font-semibold"
                        }
                      >
                        {card.trend}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`bg-gradient-to-br ${card.gradient} text-white p-5 rounded-2xl`}
                  >
                    <Icon size={32} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-5 dark:text-white">
              Society Statistics
            </h2>

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
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-5 dark:text-white">
              Complaint Status
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  {pieData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={COLORS[i]}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Complaints */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <TableHeader title="Recent Complaints" />

          <div className="mb-5">
            <TableSearch
              value={complaintSearch}
              onChange={(e) =>
                setComplaintSearch(e.target.value)
              }
              placeholder="Search complaints..."
            />
          </div>

          {complaintRows.length ? (
            <>
              <DataTable
                columns={complaintColumns}
                data={complaintRows}
              />

              <TablePagination
                currentPage={complaintPage}
                totalPages={complaintTotalPages}
                onPrevious={() =>
                  setComplaintPage((p) => Math.max(1, p - 1))
                }
                onNext={() =>
                  setComplaintPage((p) =>
                    Math.min(complaintTotalPages, p + 1)
                  )
                }
              />
            </>
          ) : (
            <TableEmpty message="No complaints found." />
          )}
        </div>

        {/* Residents */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <TableHeader title="Recent Residents" />

          <div className="mb-5">
            <TableSearch
              value={residentSearch}
              onChange={(e) =>
                setResidentSearch(e.target.value)
              }
              placeholder="Search residents..."
            />
          </div>

          {residentRows.length ? (
            <>
              <DataTable
                columns={residentColumns}
                data={residentRows}
              />

              <TablePagination
                currentPage={residentPage}
                totalPages={residentTotalPages}
                onPrevious={() =>
                  setResidentPage((p) => Math.max(1, p - 1))
                }
                onNext={() =>
                  setResidentPage((p) =>
                    Math.min(residentTotalPages, p + 1)
                  )
                }
              />
            </>
          ) : (
            <TableEmpty message="No residents found." />
          )}
        </div>

        {/* Upcoming Events */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <TableHeader title="Upcoming Events" />

          {upcomingEvents.length === 0 ? (
            <TableEmpty message="No upcoming events." />
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="border rounded-xl p-4 flex justify-between"
                >
                  <div>
                    <h3 className="font-semibold dark:text-white">
                      {event.title}
                    </h3>
                    <p className="text-gray-500">
                      {event.location}
                    </p>
                  </div>

                  <div className="text-blue-600 font-semibold">
                    {new Date(
                      event.event_date
                    ).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System Status */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <TableHeader title="System Status" />

          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div className="flex justify-between">
              <span>Backend API</span>
              <span className="text-green-600">Online</span>
            </div>

            <div className="flex justify-between">
              <span>Database</span>
              <span className="text-green-600">Connected</span>
            </div>

            <div className="flex justify-between">
              <span>Authentication</span>
              <span className="text-green-600">Active</span>
            </div>

            <div className="flex justify-between">
              <span>Dashboard Refresh</span>
              <span>Every 30 sec</span>
            </div>

            <div className="flex justify-between">
              <span>Last Updated</span>
              <span>{lastUpdated || "--"}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminDashboard;