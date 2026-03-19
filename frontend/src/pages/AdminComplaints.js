import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const API = process.env.REACT_APP_API;

function AdminComplaints() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  const fetchData = useCallback(async () => {
    const res = await axios.get(`${API}/api/complaints`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setData(res.data);
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const update = async (id, status) => {
    await axios.put(`${API}/api/complaints/${id}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchData();
  };

  return (
    <Layout>
      {data.map(c => (
        <div key={c._id}>
          {c.message}
          <button onClick={() => update(c._id, "approved")}>Approve</button>
          <button onClick={() => update(c._id, "rejected")}>Reject</button>
        </div>
      ))}
    </Layout>
  );
}

export default AdminComplaints;