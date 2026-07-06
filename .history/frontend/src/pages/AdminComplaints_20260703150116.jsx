import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();

    const interval = setInterval(() => {
      fetchComplaints();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/complaints");

      setComplaints(
        Array.isArray(res.data) ? res.data : []
      );
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Failed to load complaints"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(`/complaints/${id}`, {
        status,
      });

      if (res.data.message) {
        setComplaints((prev) =>
          prev.map((complaint) =>
            complaint.id === id
              ? { ...complaint, status }
              : complaint
          )
        );

        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update complaint"
      );
    }
  };

  const deleteComplaint = async (id) => {
    if (!window.confirm("Delete this complaint?")) return;

    try {
      const res = await api.delete(`/complaints/${id}`);

      setComplaints((prev) =>
        prev.filter((complaint) => complaint.id !== id)
      );

      toast.success(
        res.data.message ||
          "Complaint deleted successfully"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete complaint"
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "text-green-600";
      case "In Progress":
        return "text-blue-600";
      case "Pending":
        return "text-yellow-600";
      default:
        return "text-gray-800 dark:text-white";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          Manage Complaints
        </h1>

        <p className="text-gray-800 dark:text-white mb-6">
          Total Complaints: {complaints.length}
        </p>

        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
            Loading...
          </div>
        ) : complaints.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
            No complaints found.
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div
                key={complaint.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow p-5"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {complaint.title}
                    </h2>

                    <p className="text-gray-700 mt-2">
                      {complaint.description}
                    </p>

                    <div className="mt-4 space-y-1">
                      <p>👤 {complaint.name}</p>

                      <p>📱 {complaint.phone}</p>

                      <p>
                        🏠 {complaint.flat_number || "N/A"}
                      </p>

                      <p
                        className={`font-semibold ${getStatusColor(
                          complaint.status
                        )}`}
                      >
                        Status: {complaint.status}
                      </p>

                      <p className="text-sm text-gray-500">
                        {new Date(
                          complaint.created_at
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-5">
                  <button
                    onClick={() =>
                      updateStatus(
                        complaint.id,
                        "Pending"
                      )
                    }
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    Pending
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        complaint.id,
                        "In Progress"
                      )
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    In Progress
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        complaint.id,
                        "Resolved"
                      )
                    }
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Resolved
                  </button>

                  <button
                    onClick={() =>
                      deleteComplaint(complaint.id)
                    }
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminComplaints;