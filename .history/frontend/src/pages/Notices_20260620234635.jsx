import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Notices() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await api.get("/notices");
      setNotices(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1>Notice Board</h1>

        {notices.length === 0 ? (
          <p>No notices found.</p>
        ) : (
          notices.map((notice) => (
            <div
              key={notice.id}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                marginBottom: "10px"
              }}
            >
              <h3>{notice.title}</h3>

              <p>{notice.description}</p>

              <small>
                By: {notice.created_by}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notices;