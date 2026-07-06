// Part 1/4

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminResidents() {
  const [residents, setResidents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const res = await api.get("/admin/residents");

      console.log("FIRST RESIDENT:", res.data[0]);

      setResidents(res.data || []);
    } catch (error) {
      console.log(error);
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
      console.log(error);
      alert("Failed to delete resident");
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

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          Manage Residents
        </h1>

        <p className="text-gray-600 mb-6">
          Total Residents: {filteredResidents.length}
        </p>

        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <input
            type="text"
            placeholder="Search residents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div className="grid gap-4">

          {filteredResidents.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-5">
              No residents found.
            </div>
          ) : (
            filteredResidents.map((resident) => (
              <div
                key={resident.id}
                className="bg-white rounded-xl shadow p-5"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {resident.name}
                    </h2>

                    <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                      {resident.approval_status || "approved"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-gray-700">
                  <p>📧 {resident.email}</p>

                  <p>
                    📱 {resident.phone || "N/A"}
                  </p>

                  <p>
                    🏠 {resident.flat_number || "N/A"}
                  </p>

                  <p>
                    👤 {resident.role}
                  </p>

                  <p className="font-medium text-blue-600">
                    {resident.role === "admin"
                      ? "Administrator"
                      : "Resident"}
                  </p>
                </div>

                <button
                  onClick={() => deleteResident(resident.id)}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Delete Resident
                </button>
              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}

export default AdminResidents;