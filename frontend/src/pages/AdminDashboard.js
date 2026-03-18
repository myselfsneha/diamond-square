import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [notices, setNotices] = useState([]);
  const [complaints, setComplaints] = useState([]);

  const token = localStorage.getItem("token");

  // ================= USERS =================
  const getUsers = async () => {
    const res = await axios.get(
      "https://diamond-square-api.onrender.com/api/admin/users",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setUsers(res.data);
  };

  // ================= NOTICE =================
  const createNotice = async () => {
    await axios.post(
      "https://diamond-square-api.onrender.com/api/notices",
      {
        title: "Water Issue",
        message: "Water supply off tomorrow",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("Notice Created");
  };

  // ================= COMPLAINTS =================
  const getComplaints = async () => {
    const res = await axios.get(
      "https://diamond-square-api.onrender.com/api/complaints",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setComplaints(res.data);
  };

  // ================= MAINTENANCE =================
  const createBill = async () => {
    await axios.post(
      "https://diamond-square-api.onrender.com/api/maintenance",
      {
        month: "March",
        amount: 2000,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("Bill Created");
  };

  useEffect(() => {
    getUsers();
    getComplaints();
  }, []);

  return (
    <div className="flex">

      {/* SIDEBAR */}
      <div className="w-64 bg-black text-white min-h-screen p-4">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>

        <button className="block mb-2" onClick={getUsers}>Users</button>
        <button className="block mb-2" onClick={getComplaints}>Complaints</button>
        <button className="block mb-2" onClick={createNotice}>Create Notice</button>
        <button className="block mb-2" onClick={createBill}>Create Bill</button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6">

        <h1 className="text-2xl font-bold mb-4">Admin Dashboard 👑</h1>

        {/* USERS */}
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        {users.map((u) => (
          <div key={u._id} className="border p-2 mb-2 rounded">
            <p>{u.name} - {u.phone}</p>
          </div>
        ))}

        {/* COMPLAINTS */}
        <h2 className="text-xl font-semibold mt-6 mb-2">Complaints</h2>
        {complaints.map((c) => (
          <div key={c._id} className="border p-2 mb-2 rounded">
            <p>{c.message}</p>
            <p>Status: {c.status}</p>
          </div>
        ))}

      </div>
    </div>
  );
}

export default AdminDashboard;