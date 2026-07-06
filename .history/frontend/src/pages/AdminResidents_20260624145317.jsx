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
      setResidents(res.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load residents");
    } finally {
      setLoading(false);
    }
  };

  const deleteResident = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this resident permanently?"
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
    switch (status) {
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

  const filteredResidents = residents.filter((resident) =>
    `${resident.name || ""} ${resident.email || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <h1 className="text-3xl font-bold text-blue-600">
            Manage Residents
          </h1>

          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Total Residents: {filteredResidents.length}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow p-6">
            Loading residents...
          </div>
        ) : filteredResidents.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6">
            No residents found.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredResidents.map((resident) => (
              <div
                key={resident.id}
                className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-bold">
                    {resident.name}
                  </h2>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      resident.approval_status
                    )}`}
                  >
                    {resident.approval_status || "N/A"}
                  </span>
                </div>

                <div className="space-y-2 text-gray-600">
                  <p>📧 {resident.email}</p>

                  <p>
                    📱 {resident.phone || "Not Provided"}
                  </p>

                  <p>
                    🏠 {resident.flat_number || "N/A"}
                  </p>

                  <p>
                    👤 {resident.role || "resident"}
                  </p>
                </div>

                {resident.role === "admin" && (
                  <div className="mt-4 bg-purple-100 text-purple-700 px-3 py-2 rounded-lg text-center font-medium">
                    Administrator
                  </div>
                )}

                <button
                  onClick={() =>
                    deleteResident(resident.id)
                  }
                  className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
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