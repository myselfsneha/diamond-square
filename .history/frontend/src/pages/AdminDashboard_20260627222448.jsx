import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    pendingApprovals: 0,
    totalComplaints: 0,
    totalEvents: 0,
    totalPolls: 0,
    totalGuards: 0,
  });

  const [recentComplaints, setRecentComplaints] = useState([]);
  const [recentResidents, setRecentResidents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/dashboard/stats");

      setStats(res.data);
      setRecentComplaints(res.data.recentComplaints || []);
      setRecentResidents(res.data.recentResidents || []);
      setUpcomingEvents(res.data.upcomingEvents || []);
    } catch (error) {
      console.log(error);
    }
  };

  const cards = [
    {
      title: "Members",
      value: stats.totalMembers,
      icon: "👥",
      color: "bg-blue-500",
    },
    {
      title: "Approvals",
      value: stats.pendingApprovals,
      icon: "⏳",
      color: "bg-orange-500",
    },
    {
      title: "Complaints",
      value: stats.totalComplaints,
      icon: "🛠️",
      color: "bg-red-500",
    },
    {
      title: "Events",
      value: stats.totalEvents,
      icon: "📅",
      color: "bg-green-500",
    },
    {
      title: "Polls",
      value: stats.totalPolls,
      icon: "🗳️",
      color: "bg-purple-500",
    },
    {
      title: "Guards",
      value: stats.totalGuards,
      icon: "👮",
      color: "bg-yellow-500",
    },
  ];

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

  const COLORS = ["#8b5cf6", "#f59e0b"];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          Admin Dashboard
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow p-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500">
                    {card.title}
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {card.value}
                  </h2>
                </div>

                <div
                  className={`${card.color} text-white p-4 rounded-xl text-2xl`}
                >
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Society Statistics
            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="#2563eb"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Polls vs Guards
            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >
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
                        COLORS[
                          index % COLORS.length
                        ]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

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
                  recentComplaints.map((complaint) => (
                    <tr
                      key={complaint.id}
                      className="border-t"
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
                      className="p-4 text-center"
                    >
                      No complaints found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Recent Residents
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">
                    Name
                  </th>
                  <th className="p-3 text-left">
                    Flat
                  </th>
                  <th className="p-3 text-left">
                    Phone
                  </th>
                  <th className="p-3 text-left">
                    Status
                  </th>
                  <th className="p-3 text-left">
                    Joined
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentResidents.length > 0 ? (
                  recentResidents.map((resident) => (
                    <tr
                      key={resident.id}
                      className="border-t"
                    >
                      <td className="p-3">
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
                      No residents found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Recent Activity
            </h2>

            <ul className="space-y-3">
              <li>
                👥 Total Members:{" "}
                {stats.totalMembers}
              </li>

              <li>
                ⏳ Pending Approvals:{" "}
                {stats.pendingApprovals}
              </li>

              <li>
                🛠️ Total Complaints:{" "}
                {stats.totalComplaints}
              </li>

              <li>
                📅 Total Events:{" "}
                {stats.totalEvents}
              </li>

              <li>
                🗳️ Total Polls:{" "}
                {stats.totalPolls}
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Upcoming Events
            </h2>

            <ul className="space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <li key={event.id}>
                    📅 {event.title}
                  </li>
                ))
              ) : (
                <li>
                  No upcoming events
                </li>
              )}
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              System Status
            </h2>

            <ul className="space-y-3">
              <li>🟢 Backend Online</li>
              <li>🟢 Database Connected</li>
              <li>🟢 Authentication Active</li>
              <li>🟢 Notifications Active</li>
            </ul>
          </div>
        </div>

              </div>
    </div>
  );
}

export default AdminDashboard;