// src/pages/AdminDashboard.jsx

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

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

  const cards = [
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Admin Dashboard
        </h1>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">
                    {card.title}
                  </p>

                  <h2 className="text-3xl font-bold mt-2">
                    {card.value}
                  </h2>
                </div>

                <div
                  className={`${card.color} text-white text-3xl p-3 rounded-xl`}
                >
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Recent Activity
            </h2>

            <ul className="space-y-3 text-gray-600">
              <li>✅ New residents registered</li>
              <li>✅ New complaints submitted</li>
              <li>✅ Upcoming events scheduled</li>
              <li>✅ Polls available for voting</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              System Status
            </h2>

            <ul className="space-y-3 text-gray-600">
              <li>🟢 Backend Connected</li>
              <li>🟢 Database Connected</li>
              <li>🟢 Authentication Active</li>
              <li>🟢 Notifications Working</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;