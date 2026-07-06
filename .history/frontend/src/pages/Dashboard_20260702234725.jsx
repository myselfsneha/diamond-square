import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function Dashboard() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    residents: 0,
    guards: 0,
    visitorsToday: 0,
    complaints: 0,
    notices: 0,
    events: 0,
    documents: 0,
    pendingPayments: 0,
  });

  const [recentComplaints, setRecentComplaints] = useState([]);
  const [recentVisitors, setRecentVisitors] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await api.get("/dashboard");

      setStats(res.data.stats || {});
      setRecentComplaints(res.data.recentComplaints || []);
      setRecentVisitors(res.data.recentVisitors || []);
      setUpcomingEvents(res.data.upcomingEvents || []);
    } catch (err) {
      console.log(err);
      alert("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="p-6 text-center">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Residents",
      value: stats.residents,
      color: "bg-blue-600",
      icon: "👥",
    },
    {
      title: "Guards",
      value: stats.guards,
      color: "bg-indigo-600",
      icon: "🛡️",
    },
    {
      title: "Visitors Today",
      value: stats.visitorsToday,
      color: "bg-green-600",
      icon: "🚪",
    },
    {
      title: "Complaints",
      value: stats.complaints,
      color: "bg-red-600",
      icon: "📝",
    },
    {
      title: "Events",
      value: stats.events,
      color: "bg-purple-600",
      icon: "📅",
    },
    {
      title: "Notices",
      value: stats.notices,
      color: "bg-yellow-500",
      icon: "📢",
    },
    {
      title: "Documents",
      value: stats.documents,
      color: "bg-cyan-600",
      icon: "📄",
    },
    {
      title: "Pending Payments",
      value: stats.pendingPayments,
      color: "bg-pink-600",
      icon: "💰",
    },
  ];

const pieData = [
  {
    name: "Pending",
    value: stats.pendingPayments || 0,
  },
  {
    name: "Completed",
    value:
      (stats.residents || 0) -
      (stats.pendingPayments || 0),
  },
];

const visitorData = [
  {
    name: "Visitors",
    count: stats.visitorsToday || 0,
  },
  {
    name: "Complaints",
    count: stats.complaints || 0,
  },
  {
    name: "Events",
    count: stats.events || 0,
  },
  {
    name: "Documents",
    count: stats.documents || 0,
  },
];

const COLORS = [
  "#3B82F6",
  "#10B981",
];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {cards.map((card, index) => (
            <div
              key={index}
              className={`${card.color} text-white rounded-xl shadow-lg p-6 hover:scale-105 transition`}
            >
              <div className="text-4xl mb-3">
                {card.icon}
              </div>

              <p className="text-sm opacity-80">
                {card.title}
              </p>

              <h2 className="text-4xl font-bold mt-2">
                {card.value}
              </h2>
            </div>
          ))}

        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-8">

          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-xl font-bold mb-4">
              Recent Complaints
            </h2>

            {recentComplaints.length === 0 ? (
              <p>No complaints.</p>
            ) : (
              recentComplaints.map((item) => (
                <div
                  key={item.id}
                  className="border-b py-3"
                >
                  <p className="font-semibold">
                    {item.title}
                  </p>

                  <p className="text-sm text-gray-500">
                    {item.name}
                  </p>

                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {item.status}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-xl font-bold mb-4">
              Recent Visitors
            </h2>

            {recentVisitors.length === 0 ? (
              <p>No visitors.</p>
            ) : (
              recentVisitors.map((item, index) => (
                <div
                  key={index}
                  className="border-b py-3"
                >
                  <p className="font-semibold">
                    {item.visitor_name}
                  </p>

                  <p className="text-sm">
                    {item.status}
                  </p>

                  <p className="text-xs text-gray-500">
                    {new Date(item.visit_date).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-xl font-bold mb-4">
              Upcoming Events
            </h2>

            {upcomingEvents.length === 0 ? (
              <p>No upcoming events.</p>
            ) : (
              upcomingEvents.map((item, index) => (
                <div
                  key={index}
                  className="border-b py-3"
                >
                  <p className="font-semibold">
                    {item.title}
                  </p>

                  <p className="text-xs text-gray-500">
                    {new Date(item.event_date).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;