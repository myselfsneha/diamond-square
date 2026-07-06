// ResidentDashboard.jsx
// PART 1/3

import { useEffect, useMemo, useState } from "react";
import {
  Home,
  AlertTriangle,
  CheckCircle2,
  CalendarDays,
  Users,
  Bell,
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
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Navbar from "../components/Navbar";
import api from "../services/api";

function ResidentDashboard() {
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  const [stats, setStats] = useState({
    notices: 0,
    complaints: 0,
    resolved: 0,
    events: 0,
    visitors: 0,
    dues: 0,
  });

  const [recentComplaints, setRecentComplaints] = useState([]);
  const [recentNotices, setRecentNotices] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentVisitors, setRecentVisitors] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/dashboard/resident");

      setStats({
        notices: data.notices || 0,
        complaints: data.complaints || 0,
        resolved: data.resolved || 0,
        events: data.events || 0,
        visitors: data.visitors || 0,
        dues: data.dues || 0,
      });

      setRecentComplaints(data.recentComplaints || []);
      setRecentNotices(data.recentNotices || []);
      setUpcomingEvents(data.upcomingEvents || []);
      setRecentVisitors(data.recentVisitors || []);

      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: "Notices",
      value: stats.notices,
      icon: Bell,
      gradient: "from-blue-500 to-cyan-500",
      trend: "+3%",
      positive: true,
    },
    {
      title: "Complaints",
      value: stats.complaints,
      icon: AlertTriangle,
      gradient: "from-red-500 to-pink-500",
      trend: "+5%",
      positive: false,
    },
    {
      title: "Resolved",
      value: stats.resolved,
      icon: CheckCircle2,
      gradient: "from-green-500 to-emerald-500",
      trend: "+8%",
      positive: true,
    },
    {
      title: "Events",
      value: stats.events,
      icon: CalendarDays,
      gradient: "from-purple-500 to-indigo-500",
      trend: "+2%",
      positive: true,
    },
    {
      title: "Visitors",
      value: stats.visitors,
      icon: Users,
      gradient: "from-orange-500 to-yellow-500",
      trend: "+7%",
      positive: true,
    },
    {
      title: "Maintenance",
      value: `₹${stats.dues}`,
      icon: Home,
      gradient: "from-slate-700 to-slate-900",
      trend: "Pending",
      positive: false,
    },
  ];

  const chartData = useMemo(
    () => [
      { name: "Complaints", value: stats.complaints },
      { name: "Resolved", value: stats.resolved },
      { name: "Events", value: stats.events },
      { name: "Visitors", value: stats.visitors },
    ],
    [stats]
  );

  const pieData = useMemo(
    () => [
      {
        name: "Resolved",
        value: stats.resolved,
      },
      {
        name: "Pending",
        value: stats.complaints - stats.resolved,
      },
    ],
    [stats]
  );

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}

        <div className="flex flex-col lg:flex-row justify-between items-center mb-8">

          <div>
            <h1 className="text-4xl font-bold text-slate-800">
              Resident Dashboard
            </h1>

            <p className="text-slate-500 mt-2">
              Welcome back! Here's your society overview.
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

        {/* Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">

          {dashboardCards.map((card, index) => {

            const Icon = card.icon;

            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow hover:shadow-xl transition p-6"
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
                    className={`bg-gradient-to-br ${card.gradient} text-white p-5 rounded-2xl`}
                  >
                    <Icon size={34} />
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* PART 2 STARTS HERE */}

                {/* Charts */}

        <div className="grid lg:grid-cols-2 gap-6 mb-8">

          {/* Bar Chart */}

          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-xl font-semibold mb-5">
              Society Activity
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

          {/* Pie Chart */}

          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="text-xl font-semibold mb-5">
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
                  {pieData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />

              </PieChart>
            </ResponsiveContainer>

          </div>

        </div>

        {/* Recent Complaints */}

        <div className="bg-white rounded-2xl shadow p-6 mb-8">

          <div className="flex justify-between items-center mb-5">

            <h2 className="text-xl font-semibold">
              My Recent Complaints
            </h2>

            <span className="text-sm text-gray-500">
              Last 5 Complaints
            </span>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="bg-gray-100">

                  <th className="p-3 text-left">
                    Title
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

                  recentComplaints.map((complaint) => (

                    <tr
                      key={complaint.id}
                      className="border-t hover:bg-gray-50"
                    >

                      <td className="p-3">
                        {complaint.title}
                      </td>

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
                      colSpan="3"
                      className="p-4 text-center text-gray-500"
                    >
                      No complaints found.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* Latest Notices */}

        <div className="bg-white rounded-2xl shadow p-6 mb-8">

          <div className="flex justify-between items-center mb-5">

            <h2 className="text-xl font-semibold">
              Latest Notices
            </h2>

            <span className="text-sm text-gray-500">
              Society Updates
            </span>

          </div>

          <div className="space-y-4">

            {recentNotices.length > 0 ? (

              recentNotices.map((notice) => (

                <div
                  key={notice.id}
                  className="border rounded-xl p-4 hover:bg-gray-50 transition"
                >

                  <h3 className="font-semibold text-lg">
                    {notice.title}
                  </h3>

                  <p className="text-gray-600 mt-2 line-clamp-2">
                    {notice.content}
                  </p>

                  <p className="text-xs text-gray-400 mt-3">
                    {new Date(
                      notice.created_at
                    ).toLocaleDateString()}
                  </p>

                </div>

              ))

            ) : (

              <div className="text-center text-gray-500 py-6">
                No notices available.
              </div>

            )}

          </div>

        </div>

        {/* PART 3 STARTS HERE */}

                {/* Upcoming Events + Recent Visitors */}

        <div className="grid lg:grid-cols-2 gap-6 mb-8">

          {/* Upcoming Events */}

          <div className="bg-white rounded-2xl shadow p-6">

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-xl font-semibold">
                Upcoming Events
              </h2>

              <span className="text-sm text-gray-500">
                Next Events
              </span>

            </div>

            {upcomingEvents.length > 0 ? (

              <div className="space-y-4">

                {upcomingEvents.map((event) => (

                  <div
                    key={event.id}
                    className="border rounded-xl p-4 hover:bg-gray-50 transition"
                  >

                    <h3 className="font-semibold text-lg">
                      {event.title}
                    </h3>

                    <p className="text-gray-600 mt-2">
                      📅{" "}
                      {new Date(
                        event.event_date
                      ).toLocaleDateString()}
                    </p>

                    {event.event_time && (
                      <p className="text-gray-600">
                        🕒 {event.event_time}
                      </p>
                    )}

                    {event.location && (
                      <p className="text-gray-600">
                        📍 {event.location}
                      </p>
                    )}

                  </div>

                ))}

              </div>

            ) : (

              <div className="text-center text-gray-500 py-6">
                No upcoming events.
              </div>

            )}

          </div>

          {/* Recent Visitors */}

          <div className="bg-white rounded-2xl shadow p-6">

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-xl font-semibold">
                Recent Visitors
              </h2>

              <span className="text-sm text-gray-500">
                Latest Entries
              </span>

            </div>

            {recentVisitors.length > 0 ? (

              <div className="space-y-4">

                {recentVisitors.map((visitor) => (

                  <div
                    key={visitor.id}
                    className="border rounded-xl p-4 hover:bg-gray-50 transition"
                  >

                    <h3 className="font-semibold">
                      {visitor.visitor_name}
                    </h3>

                    <p className="text-gray-600 mt-2">
                      Purpose : {visitor.purpose}
                    </p>

                    <p className="text-gray-600">
                      Visit :
                      {" "}
                      {new Date(
                        visitor.visit_date
                      ).toLocaleDateString()}
                    </p>

                    <span
                      className={`inline-block mt-3 px-3 py-1 rounded-full text-sm ${
                        visitor.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : visitor.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {visitor.status}
                    </span>

                  </div>

                ))}

              </div>

            ) : (

              <div className="text-center text-gray-500 py-6">
                No recent visitors.
              </div>

            )}

          </div>

        </div>

        {/* Quick Actions */}

        <div className="bg-white rounded-2xl shadow p-6 mb-8">

          <h2 className="text-xl font-semibold mb-6">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <button
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 font-semibold transition"
            >
              Raise Complaint
            </button>

            <button
              className="bg-green-600 hover:bg-green-700 text-white rounded-xl py-4 font-semibold transition"
            >
              Visitor Entry
            </button>

            <button
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-4 font-semibold transition"
            >
              View Notices
            </button>

            <button
              className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-4 font-semibold transition"
            >
              Pay Maintenance
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ResidentDashboard;