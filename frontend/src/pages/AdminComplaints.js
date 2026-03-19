import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const API = process.env.REACT_APP_API;

function AdminComplaints() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  const fetchComplaints = async () => {
    const res = await axios.get(`${API}/api/complaints`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setData(res.data);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (id, status) => {
    await axios.put(
      `${API}/api/complaints/${id}`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    fetchComplaints(); // refresh
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">All Complaints</h1>

      {data.map(c => (
        <div key={c._id} className="bg-white p-4 rounded shadow mb-3">
          <p className="font-semibold">{c.user?.name}</p>
          <p>{c.message}</p>

          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">{c.status}</span>

            <div className="flex gap-2">
              <button
                onClick={() => updateStatus(c._id, "approved")}
                className="bg-green-500 text-white px-2 py-1 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => updateStatus(c._id, "rejected")}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </Layout>
  );
}

export default AdminComplaints;