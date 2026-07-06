import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return (
    <div>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1>Diamond Square Dashboard</h1>

        <h3>
          Welcome, {user?.name}
        </h3>

        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "20px",
            flexWrap: "wrap"
          }}
        >
          <div
            onClick={() => navigate("/notices")}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              width: "200px",
              cursor: "pointer"
            }}
          >
            <h3>Notices</h3>
            <p>View society notices</p>
          </div>

          <div
            onClick={() => navigate("/complaints")}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              width: "200px",
              cursor: "pointer"
            }}
          >
            <h3>Complaints</h3>
            <p>Track complaint status</p>
          </div>

          <div
            onClick={() => navigate("/maintenance")}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              width: "200px",
              cursor: "pointer"
            }}
          >
            <h3>Maintenance</h3>
            <p>View maintenance dues</p>
          </div>

          <div
            onClick={() => navigate("/contacts")}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              width: "200px",
              cursor: "pointer"
            }}
          >
            <h3>Contacts</h3>
            <p>Important society contacts</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;