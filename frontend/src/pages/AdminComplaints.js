import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const API = process.env.REACT_APP_API;

function AdminComplaints() {
  const [data, setData] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(`${API}/api/complaints`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setData(res.data);
    };

    fetch();
  }, [token]);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">All Complaints</h1>

      {data.map(c => (
        <div key={c._id} className="bg-white p-4 rounded shadow mb-3">
          <p className="font-semibold">{c.user?.name}</p>
          <p>{c.message}</p>
          <span className="text-sm text-gray-500">{c.status}</span>
        </div>
      ))}
    </Layout>
  );
}

export default AdminComplaints;