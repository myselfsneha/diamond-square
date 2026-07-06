import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-6">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Diamond Square Dashboard
        </h1>

        <h3 className="text-xl mb-6">
          Welcome, {user?.name}
        </h3>

        <div className="flex flex-wrap gap-5">
          <div
            onClick={() => navigate("/notices")}
            className="border rounded-lg p-5 w-52 cursor-pointer bg-white shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold">
              Notices
            </h3>

            <p className="text-gray-600">
              View society notices
            </p>
          </div>

          <div
            onClick={() => navigate("/complaints")}
            className="border rounded-lg p-5 w-52 cursor-pointer bg-white shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold">
              Complaints
            </h3>

            <p className="text-gray-600">
              Track complaint status
            </p>
          </div>

          <div
            onClick={() => navigate("/maintenance")}
            className="border rounded-lg p-5 w-52 cursor-pointer bg-white shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold">
              Maintenance
            </h3>

            <p className="text-gray-600">
              View maintenance dues
            </p>
          </div>

          <div
            onClick={() => navigate("/contacts")}
            className="border rounded-lg p-5 w-52 cursor-pointer bg-white shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold">
              Contacts
            </h3>

            <p className="text-gray-600">
              Important society contacts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;