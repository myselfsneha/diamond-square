import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const API = process.env.REACT_APP_API;

function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    complaints: 0,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      const res = await axios.get(`${API}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats(res.data);
    };

    fetchStats();
  }, [token]);

  return (
  <Layout>
    <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

    <div className="grid md:grid-cols-2 gap-6">

      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-lg">Total Users</h2>
        <p className="text-4xl font-bold mt-2">{stats.users}</p>
      </div>

      <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-lg">Complaints</h2>
        <p className="text-4xl font-bold mt-2">{stats.complaints}</p>
      </div>

    </div>
  </Layout>
);
}

export default Dashboard;