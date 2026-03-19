import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";

const API = process.env.REACT_APP_API;

function Analytics() {
  const [data, setData] = useState({ labels: [], datasets: [] });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const run = async () => {
      const res = await axios.get(`${API}/api/complaints`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const c = res.data;

      setData({
        labels: ["Pending", "Approved"],
        datasets: [{
          label: "Complaints",
          data: [
            c.filter(x => x.status === "pending").length,
            c.filter(x => x.status === "approved").length
          ],
          backgroundColor: ["orange", "green"]
        }]
      });
    };

    if (token) run();
  }, [token]);

  return data.datasets.length ? <Bar data={data} /> : "Loading...";
}

export default Analytics;