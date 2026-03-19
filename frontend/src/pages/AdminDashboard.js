import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const API = process.env.REACT_APP_API;

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  const getUsers = useCallback(async () => {
    const res = await axios.get(`${API}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUsers(res.data);
  }, [token]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-xl mb-4 font-semibold">All Users</h2>

        {users.map(u => (
          <div key={u._id} className="border-b py-2 flex justify-between">
            <span>{u.name}</span>
            <span className="text-gray-500">{u.phone}</span>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default AdminDashboard;