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
      const res = await api.get(
        "/dashboard/stats"
      );

      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Admin Dashboard
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-gray-500">
              Residents
            </h2>
            <p className="text-3xl font-bold">
              {stats.totalResidents}
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-gray-500">
              Complaints
            </h2>
            <p className="text-3xl font-bold">
              {stats.totalComplaints}
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-gray-500">
              Events
            </h2>
            <p className="text-3xl font-bold">
              {stats.totalEvents}
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-gray-500">
              Polls
            </h2>
            <p className="text-3xl font-bold">
              {stats.totalPolls}
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-gray-500">
              Guards
            </h2>
            <p className="text-3xl font-bold">
              {stats.totalGuards}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;