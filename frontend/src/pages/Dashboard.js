import { useEffect, useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API;

function Dashboard() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/api/notices`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotices(res.data);
    };

    fetch();
  }, []);

  return (
    <div>
      <h1>User Dashboard</h1>
      {notices.map(n => <p key={n._id}>{n.title}</p>)}
    </div>
  );
}

export default Dashboard;