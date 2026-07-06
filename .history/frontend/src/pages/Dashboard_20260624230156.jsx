import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [stats, setStats] = useState({
    totalMembers: 0,
    pendingApprovals: 0,
    totalComplaints: 0,
    totalEvents: 0,
    totalPolls: 0,
    totalGuards: 0,
  });

  useEffect(() => {
    fetchDashboardStats();

    const interval = setInterval(() => {
      fetchDashboardStats();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get("/dashboard/stats");

      setStats({
        totalMembers: res.data.totalMembers || 0,
        pendingApprovals: res.data.pendingApprovals || 0,
        totalComplaints: res.data.totalComplaints || 0,
        totalEvents: res.data.totalEvents || 0,
        totalPolls: res.data.totalPolls || 0,
        totalGuards: res.data.totalGuards || 0,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-6">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">
          Diamond Square Dashboard
        </h1>

        <h3 className="text-xl mb-8">
          Welcome, {user?.name}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white shadow rounded-xl p-5">
            <h3 className="text-gray-500">
              Members
            </h3>

            <p className="text-3xl font-bold text-blue-600">
              {stats.totalMembers}
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-5">
            <h3 className="text-gray-500">
              Pending
            </h3>

            <p className="text-3xl font-bold text-orange-600">
              {stats.pendingApprovals}
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-5">
            <h3 className="text-gray-500">
              Complaints
            </h3>

            <p className="text-3xl font-bold text-red-600">
              {stats.totalComplaints}
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-5">
            <h3 className="text-gray-500">
              Events
            </h3>

            <p className="text-3xl font-bold text-purple-600">
              {stats.totalEvents}
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-5">
            <h3 className="text-gray-500">
              Polls
            </h3>

            <p className="text-3xl font-bold text-green-600">
              {stats.totalPolls}
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-5">
            <h3 className="text-gray-500">
              Guards
            </h3>

            <p className="text-3xl font-bold text-indigo-600">
              {stats.totalGuards}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-5">
          <div
            onClick={() => navigate("/notices")}
            className="border rounded-lg p-5 w-52 cursor-pointer bg-white shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold">
              Notices
            </h3>

            <p className="text-gray-600">
              View society notices
            </p>
          </div>

          <div
            onClick={() => navigate("/complaints")}
            className="border rounded-lg p-5 w-52 cursor-pointer bg-white shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold">
              Complaints
            </h3>

            <p className="text-gray-600">
              Track complaint status
            </p>
          </div>

          <div
            onClick={() => navigate("/maintenance")}
            className="border rounded-lg p-5 w-52 cursor-pointer bg-white shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold">
              Maintenance
            </h3>

            <p className="text-gray-600">
              View maintenance dues
            </p>
          </div>

          <div
            onClick={() => navigate("/contacts")}
            className="border rounded-lg p-5 w-52 cursor-pointer bg-white shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold">
              Contacts
            </h3>

            <p className="text-gray-600">
              Important society contacts
            </p>
          </div>

          <div
            onClick={() => navigate("/events")}
            className="border rounded-lg p-5 w-52 cursor-pointer bg-white shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold">
              Events
            </h3>

            <p className="text-gray-600">
              Society events
            </p>
          </div>

          <div
            onClick={() => navigate("/polls")}
            className="border rounded-lg p-5 w-52 cursor-pointer bg-white shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold">
              Polls
            </h3>

            <p className="text-gray-600">
              Community voting
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;