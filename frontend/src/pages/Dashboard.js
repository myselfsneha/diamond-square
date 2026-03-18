import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://diamond-square-api.onrender.com/api/notices",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotices(res.data);
    };

    fetchNotices();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

      {notices.map((n) => (
        <div key={n._id} className="border p-3 mb-2">
          <h3 className="font-bold">{n.title}</h3>
          <p>{n.message}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;