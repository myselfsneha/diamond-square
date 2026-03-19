import { Link } from "react-router-dom";

function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-blue-600 text-white p-5">
        <h2 className="text-2xl font-bold mb-6">Diamond Square</h2>

        <nav className="flex flex-col gap-4">
          <Link to="/dashboard" className="hover:bg-blue-500 p-2 rounded">
            Dashboard
          </Link>
          <Link to="/admin" className="hover:bg-blue-500 p-2 rounded">
            Admin
          </Link>
        </nav>
      </div>

      {/* Main */}
      <div className="flex-1 p-6 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

export default Layout;