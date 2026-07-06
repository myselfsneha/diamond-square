import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Maintenance() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const fetchMaintenance = async () => {
    try {
      const res = await api.get("/maintenance");
      setRecords(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1>Maintenance Reminders</h1>

        {records.length === 0 ? (
          <p>No maintenance records found.</p>
        ) : (
          records.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                marginBottom: "10px"
              }}
            >
              <p>Amount: ₹{item.amount}</p>
              <p>Due Date: {item.due_date}</p>
              <p>Status: {item.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Maintenance;