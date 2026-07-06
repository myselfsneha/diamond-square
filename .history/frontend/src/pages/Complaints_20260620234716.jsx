import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Complaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/complaints/my");
      setComplaints(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1>My Complaints</h1>

        {complaints.length === 0 ? (
          <p>No complaints found.</p>
        ) : (
          complaints.map((complaint) => (
            <div
              key={complaint.id}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                marginBottom: "10px"
              }}
            >
              <h3>{complaint.title}</h3>

              <p>{complaint.description}</p>

              <p>Status: {complaint.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Complaints;