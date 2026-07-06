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
  Plus,
  Bell,
  ClipboardList,
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
  Legend,
} from "recharts";

import Navbar from "../components/Navbar";
import api from "../services/api";

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
  const [recentNotices, setRecentNotices] = useState([]);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/dashboard/stats");

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

      setRecentComplaints(data.recentComplaints || []);
      setRecentResidents(data.recentResidents || []);
      setUpcomingEvents(data.upcomingEvents || []);
      setRecentNotices(data.recentNotices || []);
      setActivity(data.activity || []);

      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error(err);
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
      title: "Pending",
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

  const monthlyData = useMemo(
    () => [
      { month: "Jan", complaints: 8 },
      { month: "Feb", complaints: 5 },
      { month: "Mar", complaints: 10 },
      { month: "Apr", complaints: 7 },
      { month: "May", complaints: 4 },
      { month: "Jun", complaints: 12 },
      { month: "Jul", complaints: 6 },
    ],
    []
  );

  const complaintStatus = [
    {
      name: "Resolved",
      value: stats.resolvedComplaints,
    },
    {
      name: "Open",
      value:
        stats.totalComplaints -
        stats.resolvedComplaints,
    },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  const chartData = [
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
];

const pieData = [
  {
    name: "Polls",
    value: stats.totalPolls,
  },
  {
    name: "Guards",
    value: stats.totalGuards,
  },
];

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}

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
            onClick={fetchDashboard}
            className="mt-4 lg:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
          >
            <RefreshCcw size={18} />
            Refresh Dashboard
          </button>

        </div>

        {/* Stat Cards */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">

          {dashboardCards.map((card, index) => {

            const Icon = card.icon;

            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow hover:shadow-xl transition-all duration-300 p-6"
              >
                <div className="flex justify-between items-center">

                  <div>

                    <p className="text-gray-500">
                      {card.title}
                    </p>

                    <h2 className="text-4xl font-bold mt-3">
                      {loading ? "--" : card.value}
                    </h2>

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
                        className={`text-sm font-semibold ${
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
              </div>
            );

          })}

        </div>

                {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
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

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Polls vs Guards
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[index % COLORS.length]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Recent Complaints
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">
                    Title
                  </th>
                  <th className="p-3 text-left">
                    Resident
                  </th>
                  <th className="p-3 text-left">
                    Status
                  </th>
                  <th className="p-3 text-left">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentComplaints.length > 0 ? (
                  recentComplaints.map(
                    (complaint) => (
                      <tr
                        key={complaint.id}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="p-3">
                          {complaint.title}
                        </td>

                        <td className="p-3">
                          {complaint.name}
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              complaint.status ===
                              "Resolved"
                                ? "bg-green-100 text-green-700"
                                : complaint.status ===
                                  "Pending"
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
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-4 text-center"
                    >
                      No complaints found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

                {/* Recent Residents */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              Recent Residents
            </h2>

            <span className="text-sm text-gray-500">
              Latest registrations
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Flat</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Joined</th>
                </tr>
              </thead>

              <tbody>
                {recentResidents.length > 0 ? (
                  recentResidents.map((resident) => (
                    <tr
                      key={resident.id}
                      className="border-t hover:bg-gray-50"
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
                          className={`px-3 py-1 rounded-full text-sm ${
                            resident.approval_status ===
                            "approved"
                              ? "bg-green-100 text-green-700"
                              : resident.approval_status ===
                                "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {resident.approval_status}
                        </span>
                      </td>

                      <td className="p-3">
                        {new Date(
                          resident.created_at
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-4 text-center"
                    >
                      No residents found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Widgets */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Recent Activity
            </h2>

            <ul className="space-y-3">
              <li>👥 Total Members: {stats.totalMembers}</li>

              <li>
                ⏳ Pending Approvals:{" "}
                {stats.pendingApprovals}
              </li>

              <li>
                🛠️ Total Complaints:{" "}
                {stats.totalComplaints}
              </li>

              <li>
                📅 Total Events: {stats.totalEvents}
              </li>

              <li>
                🗳️ Total Polls: {stats.totalPolls}
              </li>

              <li>
                👮 Total Guards: {stats.totalGuards}
              </li>
            </ul>
          </div>

                    {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Upcoming Events
              </h2>

              <span className="text-sm text-gray-500">
                Next 5 Events
              </span>
            </div>

            <ul className="space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <li
                    key={event.id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <span>📅 {event.title}</span>

                    <span className="text-sm text-gray-500">
                      {new Date(
                        event.event_date
                      ).toLocaleDateString()}
                    </span>
                  </li>
                ))
              ) : (
                <li>No upcoming events.</li>
              )}
            </ul>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              System Status
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Backend</span>
                <span className="text-green-600 font-semibold">
                  🟢 Online
                </span>
              </div>

              <div className="flex justify-between">
                <span>Database</span>
                <span className="text-green-600 font-semibold">
                  🟢 Connected
                </span>
              </div>

              <div className="flex justify-between">
                <span>Authentication</span>
                <span className="text-green-600 font-semibold">
                  🟢 Active
                </span>
              </div>

              <div className="flex justify-between">
                <span>Notifications</span>
                <span className="text-green-600 font-semibold">
                  🟢 Running
                </span>
              </div>

              <div className="flex justify-between">
                <span>Server Time</span>
                <span className="font-medium">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;