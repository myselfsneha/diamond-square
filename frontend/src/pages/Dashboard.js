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

      <div className="grid grid-cols-2 gap-6">

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-3xl mt-2">{stats.users}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Complaints</h2>
          <p className="text-3xl mt-2">{stats.complaints}</p>
        </div>

      </div>
    </Layout>
  );
}

export default Dashboard;