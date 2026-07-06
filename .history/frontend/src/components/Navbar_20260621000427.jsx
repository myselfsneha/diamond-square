import { Link } from "react-router-dom";

function Navbar() {
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex flex-wrap gap-4 items-center">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/notices">Notices</Link>
      <Link to="/complaints">Complaints</Link>
      <Link to="/maintenance">Maintenance</Link>
      <Link to="/contacts">Contacts</Link>

      <button
        onClick={logout}
        className="ml-auto bg-red-500 px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;