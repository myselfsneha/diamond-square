// AdminGuards.jsx (Part 1)

import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

import DataTable from "../components/table/DataTable";
import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

function AdminGuards() {
  const [guards, setGuards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 8;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    shift: "Morning",
  });

  useEffect(() => {
    fetchGuards();

    const interval = setInterval(fetchGuards, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchGuards = async () => {
    try {
      setLoading(true);

      const res = await api.get("/guards");

      setGuards(
        Array.isArray(res.data.guards)
          ? res.data.guards
          : []
      );
    } catch (error) {
      console.log(error);
      setGuards([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setEditingId(null);

    setForm({
      name: "",
      phone: "",
      shift: "Morning",
    });
  };

  const saveGuard = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/guards/${editingId}`, form);
        alert("Guard updated successfully");
      } else {
        await api.post("/guards", form);
        alert("Guard added successfully");
      }

      resetForm();
      fetchGuards();
    } catch (error) {
      console.log(error);
      alert("Failed to save guard");
    }
  };

  const editGuard = (guard) => {
    setEditingId(guard.id);

    setForm({
      name: guard.name,
      phone: guard.phone,
      shift: guard.shift,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteGuard = async (id) => {
    if (!window.confirm("Delete this guard?")) return;

    try {
      await api.delete(`/guards/${id}`);

      setGuards((prev) =>
        prev.filter((guard) => guard.id !== id)
      );

      alert("Guard deleted successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to delete guard");
    }
  };

  const filteredGuards = useMemo(() => {
    return guards.filter((guard) =>
      `${guard.name} ${guard.phone} ${guard.shift}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [guards, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredGuards.length / rowsPerPage)
  );

  const tableRows = filteredGuards
    .slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    )
    .map((guard) => ({
      name: guard.name,
      phone: guard.phone,
      shift: guard.shift,
      added: guard.created_at
        ? new Date(guard.created_at).toLocaleDateString()
        : "-",
      actions: (
        <div className="flex gap-2">
          <button
            onClick={() => editGuard(guard)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
          >
            Edit
          </button>

          <button
            onClick={() => deleteGuard(guard.id)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ),
    }));

  const columns = [
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "shift", label: "Shift" },
    { key: "added", label: "Added On" },
    { key: "actions", label: "Actions" },
  ];
  // AdminGuards.jsx (Part 2)

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">

          <TableHeader
            title="Guards Management"
            buttonText="Refresh"
            onClick={fetchGuards}
          />

          <form
            onSubmit={saveGuard}
            className="grid md:grid-cols-3 gap-4 mt-6"
          >
            <input
              type="text"
              name="name"
              placeholder="Guard Name"
              value={form.name}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />

            <select
              name="shift"
              value={form.shift}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
            </select>

            <div className="md:col-span-3 flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                {editingId ? "Update Guard" : "Add Guard"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
          <TableSearch
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search guards..."
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-center">
            Loading...
          </div>
        ) : tableRows.length === 0 ? (
          <TableEmpty message="No guards found." />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={tableRows}
            />

            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevious={() =>
                setCurrentPage((p) => Math.max(1, p - 1))
              }
              onNext={() =>
                setCurrentPage((p) =>
                  Math.min(totalPages, p + 1)
                )
              }
            />
          </>
        )}
      </div>
    </div>
  );
}

export default AdminGuards;