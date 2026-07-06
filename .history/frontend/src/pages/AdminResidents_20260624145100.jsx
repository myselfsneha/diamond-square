// src/pages/AdminResidents.jsx

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminResidents() {
  const [residents, setResidents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const res = await api.get("/admin/residents");
      setResidents(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load residents");
    } finally {
      setLoading(false);
    }
  };

  const deleteResident = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resident?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/residents/${id}`);

      setResidents((prev) =>
        prev.filter((resident) => resident.id !== id)
      );

      alert("Resident deleted successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to delete resident");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const filteredResidents = residents.filter((resident) =>
    `${resident.name || ""} ${resident.email || ""} ${resident.phone || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="p-6 text-center text-lg">
          Loading residents...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-blue-600">
            Manage Residents
          </h1>

          <div className="bg-white shadow rounded-xl px-5 py-3">
            <span className="font-semibold">
              Total Residents: {residents.length}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {filteredResidents.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 text-center">
            No residents found.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredResidents.map((resident) => (
              <div
                key={resident.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {resident.name}
                  </h2>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(
                      resident.role
                    )}`}
                  >
                    {resident.role || "Resident"}
                  </span>
                </div>

                <div className="space-y-2 text-gray-600">
                  <p>
                    📧 {resident.email || "N/A"}
                  </p>

                  <p>
                    📱 {resident.phone || "N/A"}
                  </p>

                  <p>
                    🏠 {resident.flat_number || "N/A"}
                  </p>
                </div>

                <div className="mt-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      resident.approval_status
                    )}`}
                  >
                    {resident.approval_status || "Unknown"}
                  </span>
                </div>

                <button
                  onClick={() => deleteResident(resident.id)}
                  className="mt-5 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Delete Resident
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminResidents;