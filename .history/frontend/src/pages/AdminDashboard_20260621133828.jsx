import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminDashboard() {
  const [stats, setStats] = useState({
    residents: 0,
    complaints: 0,
    notices: 0,
    maintenance: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        residentsRes,
        complaintsRes,
        noticesRes,
        maintenanceRes,
      ] = await Promise.all([
        api.get("/admin/residents"),
        api.get("/complaints"),
        api.get("/notices"),
        api.get("/maintenance"),
      ]);

      setStats({
        residents: residentsRes.data?.length || 0,
        complaints: complaintsRes.data?.length || 0,
        notices: noticesRes.data?.length || 0,
        maintenance: maintenanceRes.data?.length || 0,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Admin Dashboard
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-600">
              Residents
            </h2>

            <p className="text-4xl font-bold text-blue-600 mt-2">
              {stats.residents}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-600">
              Complaints
            </h2>

            <p className="text-4xl font-bold text-red-600 mt-2">
              {stats.complaints}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-600">
              Notices
            </h2>

            <p className="text-4xl font-bold text-green-600 mt-2">
              {stats.notices}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-600">
              Maintenance
            </h2>

            <p className="text-4xl font-bold text-purple-600 mt-2">
              {stats.maintenance}
            </p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Admin Actions
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              Manage Residents
            </div>

            <div className="border rounded-lg p-4">
              Manage Complaints
            </div>

            <div className="border rounded-lg p-4">
              Create Notices
            </div>

            <div className="border rounded-lg p-4">
              Manage Maintenance
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;