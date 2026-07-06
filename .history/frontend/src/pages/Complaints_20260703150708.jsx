import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">
            My Complaints
          </h1>

          <Link
            to="/create-complaint"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + New Complaint
          </Link>
        </div>

        {complaints.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
            No complaints found.
          </div>
        ) : (
          complaints.map((complaint) => (
            <div
              key={complaint.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 mb-4"
            >
              <h3 className="text-xl font-semibold mb-2">
                {complaint.title}
              </h3>

              <p className="text-gray-700 mb-3">
                {complaint.description}
              </p>

              <p
                className={`font-semibold ${getStatusColor(
                  complaint.status
                )}`}
              >
                Status: {complaint.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Complaints;