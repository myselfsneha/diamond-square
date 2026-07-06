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
    totalResidents: 0,
    totalComplaints: 0,
    totalEvents: 0,
    totalPolls: 0,
    totalGuards: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/dashboard/stats");
      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const cardData = [
    {
      title: "Residents",
      value: stats.totalResidents,
      color: "bg-blue-500",
      icon: "👥",
    },
    {
      title: "Complaints",
      value: stats.totalComplaints,
      color: "bg-red-500",
      icon: "🛠",
    },
    {
      title: "Events",
      value: stats.totalEvents,
      color: "bg-green-500",
      icon: "📅",
    },
    {
      title: "Polls",
      value: stats.totalPolls,
      color: "bg-purple-500",
      icon: "🗳",
    },
    {
      title: "Guards",
      value: stats.totalGuards,
      color: "bg-yellow-500",
      icon: "👮",
    },
  ];

  const chartData = [
    {
      name: "Residents",
      value: stats.totalResidents,
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
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Admin Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow p-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500">
                    {card.title}
                  </p>

                  <h2 className="text-3xl font-bold">
                    {card.value}
                  </h2>
                </div>

                <div
                  className={`${card.color} text-white p-3 rounded-xl text-2xl`}
                >
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Society Overview
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

          {/* Pie Chart */}
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

        {/* Status Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Recent Activity
            </h2>

            <ul className="space-y-3">
              <li>✅ Residents registered</li>
              <li>✅ Complaints submitted</li>
              <li>✅ Events scheduled</li>
              <li>✅ Polls active</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              System Status
            </h2>

            <ul className="space-y-3">
              <li>🟢 Backend Connected</li>
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