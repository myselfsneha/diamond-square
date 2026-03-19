import { Link } from "react-router-dom";

function Layout({ children }) {
  return (
    <div>
      <nav className="bg-black text-white p-4 flex gap-4">
        <Link to="/complaint">Complaint</Link>
        <Link to="/my-complaints">My</Link>
        <Link to="/admin/complaints">Admin</Link>
        <Link to="/payment">Payment</Link>
      </nav>

      <div className="p-6">{children}</div>
    </div>
  );
}

export default Layout;