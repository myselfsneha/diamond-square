import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/complaints");
      setComplaints(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/complaints/${id}`, { status });

      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status } : c
        )
      );
    } catch (error) {
      console.log(error);
      alert("Failed to update complaint");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Manage Complaints
        </h1>

        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div
              key={complaint.id}
              className="bg-white rounded-xl shadow p-5"
            >
              <h2 className="text-xl font-semibold">
                {complaint.title}
              </h2>

              <p className="text-gray-600 mt-2">
                {complaint.description}
              </p>

              <p className="mt-3 font-medium">
                Status: {complaint.status}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() =>
                    updateStatus(complaint.id, "Pending")
                  }
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Pending
                </button>

                <button
                  onClick={() =>
                    updateStatus(complaint.id, "Resolved")
                  }
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Resolved
                </button>

                <button
                  onClick={() =>
                    updateStatus(complaint.id, "Rejected")
                  }
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Rejected
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminComplaints;