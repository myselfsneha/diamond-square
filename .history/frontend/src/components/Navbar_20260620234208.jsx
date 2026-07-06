import { Link } from "react-router-dom";

function Navbar() {
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";
  };

  return (
    <div
      style={{
        padding: "15px",
        background: "#f5f5f5",
        display: "flex",
        gap: "15px"
      }}
    >
      <Link to="/dashboard">Dashboard</Link>

      <Link to="/notices">Notices</Link>

      <Link to="/complaints">Complaints</Link>

      <Link to="/maintenance">Maintenance</Link>

      <Link to="/contacts">Contacts</Link>

      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default Navbar;