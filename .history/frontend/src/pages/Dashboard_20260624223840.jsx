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
    residents: 0,
    notices: 0,
    complaints: 0,
    events: 0,
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
        residents: res.data.residents || 0,
        notices: res.data.notices || 0,
        complaints: res.data.complaints || 0,
        events: res.data.events || 0,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-6">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Diamond Square Dashboard
        </h1>

        <h3 className="text-xl mb-8">
          Welcome, {user?.name}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white shadow rounded-xl p-5">
            <h3 className="text-gray-500">
              Residents
            </h3>

            <p className="text-3xl font-bold text-blue-600">
              {stats.residents}
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-5">
            <h3 className="text-gray-500">
              Notices
            </h3>

            <p className="text-3xl font-bold text-green-600">
              {stats.notices}
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-5">
            <h3 className="text-gray-500">
              Complaints
            </h3>

            <p className="text-3xl font-bold text-red-600">
              {stats.complaints}
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-5">
            <h3 className="text-gray-500">
              Events
            </h3>

            <p className="text-3xl font-bold text-purple-600">
              {stats.events}
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
        </div>
      </div>
    </div>
  );
}

export default Dashboard;