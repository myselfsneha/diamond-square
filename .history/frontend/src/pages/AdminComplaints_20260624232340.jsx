import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);

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
      setComplaints(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/complaints/${id}`, {
        status,
      });

      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint.id === id
            ? { ...complaint, status }
            : complaint
        )
      );
    } catch (error) {
      console.log(error);
      alert("Failed to update complaint");
    }
  };

  const deleteComplaint = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this complaint?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/complaints/${id}`);

      setComplaints((prev) =>
        prev.filter(
          (complaint) => complaint.id !== id
        )
      );

      alert("Complaint deleted");
    } catch (error) {
      console.log(error);
      alert("Failed to delete complaint");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "text-green-600";
      case "In Progress":
        return "text-blue-600";
      default:
        return "text-yellow-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          Manage Complaints
        </h1>

        <p className="text-gray-600 mb-6">
          Total Complaints: {complaints.length}
        </p>

        {complaints.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-5">
            No complaints found.
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div
                key={complaint.id}
                className="bg-white rounded-xl shadow p-5"
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
                      <p>
                        👤 {complaint.name}
                      </p>

                      <p>
                        📱 {complaint.phone}
                      </p>

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
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
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
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
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
                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Resolved
                  </button>

                  <button
                    onClick={() =>
                      deleteComplaint(
                        complaint.id
                      )
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
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