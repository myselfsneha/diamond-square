import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const API = process.env.REACT_APP_API;

function MyComplaints() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(`${API}/api/complaints/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    };

    if (token) fetch();
  }, [token]);

  return (
    <Layout>
      <h1>My Complaints</h1>

      {data.map(c => (
        <div key={c._id}>
          {c.message} - {c.status}
        </div>
      ))}
    </Layout>
  );
}

export default MyComplaints;