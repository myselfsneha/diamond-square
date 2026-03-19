import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const API = process.env.REACT_APP_API;

function MyComplaints() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get(`${API}/api/complaints/my`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setData(res.data));
  }, [token]);

  return (
    <Layout>
      {data.map(c => (
        <div key={c._id}>
          {c.message} - {c.status}
        </div>
      ))}
    </Layout>
  );
}

export default MyComplaints;