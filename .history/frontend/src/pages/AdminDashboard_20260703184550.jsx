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
      className={`animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700 ${className}`}
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
        stats.totalComplaints - stats.resolvedComplaints,
    },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  const filteredComplaints = useMemo(() => {
    return recentComplaints.filter((item) =>
      `${item.title} ${item.name}`
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

  const complaintRows = filteredComplaints.slice(
    (complaintPage - 1) * rowsPerPage,
    complaintPage * rowsPerPage
  );

  const residentRows = filteredResidents.slice(
    (residentPage - 1) * rowsPerPage,
    residentPage * rowsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
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
            <h1 className="text-4xl font-bold text-slate-800 dark:text-white">
              Admin Dashboard
            </h1>

            <p className="text-slate-500 dark:text-slate-400 mt-2">
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

        {/* Dashboard Cards */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
          {dashboardCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-slate-700 dark:text-white">
                      {card.title}
                    </p>

                    {loading ? (
                      <Skeleton className="h-10 w-24 mt-3" />
                    ) : (
                      <h2 className="text-4xl font-bold mt-3 dark:text-white">
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

        {/* Charts */}

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              Society Statistics
            </h2>

            {loading ? (
              <Skeleton className="h-[300px] w-full" />
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
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              Complaint Status
            </h2>

            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    outerRadius={100}
                    label
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Complaints */}

        <DataTable>
          <TableHeader
            title="Recent Complaints"
            count={filteredComplaints.length}
          />

          <TableSearch
            value={complaintSearch}
            onChange={setComplaintSearch}
            placeholder="Search complaints..."
          />

          {complaintRows.length === 0 ? (
            <TableEmpty text="No complaints found." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Resident</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {complaintRows.map((item) => (
                    <tr key={item.id}>
                      <td>{item.title}</td>
                      <td>{item.name}</td>
                      <td>{item.status}</td>
                      <td>
                        {new Date(
                          item.created_at
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <TablePagination
            page={complaintPage}
            setPage={setComplaintPage}
            total={filteredComplaints.length}
            rowsPerPage={rowsPerPage}
          />
        </DataTable>

        {/* Recent Residents */}

        <div className="mt-8">
          <DataTable>
            <TableHeader
              title="Recent Residents"
              count={filteredResidents.length}
            />

            <TableSearch
              value={residentSearch}
              onChange={setResidentSearch}
              placeholder="Search residents..."
            />

            {residentRows.length === 0 ? (
              <TableEmpty text="No residents found." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Flat</th>
                      <th>Phone</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {residentRows.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.flat_number}</td>
                        <td>{item.phone}</td>
                        <td>{item.approval_status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <TablePagination
              page={residentPage}
              setPage={setResidentPage}
              total={filteredResidents.length}
              rowsPerPage={rowsPerPage}
            />
          </DataTable>
        </div>

        {/* Bottom Section */}

        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-5 dark:text-white">
              Upcoming Events
            </h2>

            {upcomingEvents.length === 0 ? (
              <TableEmpty text="No upcoming events." />
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex justify-between border rounded-xl p-4"
                  >
                    <div>
                      <h3 className="font-semibold dark:text-white">
                        {event.title}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {event.location}
                      </p>
                    </div>

                    <span className="text-blue-600 font-semibold">
                      {new Date(
                        event.event_date
                      ).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6 dark:text-white">
              System Status
            </h2>

            <div className="space-y-4 dark:text-white">
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

              <div className="flex justify-between">
                <span>Current Time</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminDashboard;