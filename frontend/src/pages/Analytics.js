import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import Layout from "../components/Layout";

const API = process.env.REACT_APP_API;

function Analytics() {
  const [data, setData] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(`${API}/api/complaints`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const complaints = res.data;

      const pending = complaints.filter(c => c.status === "pending").length;
      const approved = complaints.filter(c => c.status === "approved").length;
      const rejected = complaints.filter(c => c.status === "rejected").length;

      setData({
        labels: ["Pending", "Approved", "Rejected"],
        datasets: [{
          label: "Complaints",
          data: [pending, approved, rejected],
          backgroundColor: ["yellow", "green", "red"]
        }]
      });
    };

    fetch();
  }, [token]);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      <Bar data={data} />
    </Layout>
  );
}

export default Analytics;