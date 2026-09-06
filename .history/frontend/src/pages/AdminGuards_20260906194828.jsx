import { useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
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
      toast.error("Failed to load guards.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
        toast.success("Guard updated successfully.");
      } else {
        await api.post("/guards", form);
        toast.success("Guard added successfully.");
      }

      resetForm();
      fetchGuards();
    } catch (error) {
      console.log(error);
      toast.error("Failed to save guard.");
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

      toast.success("Guard deleted successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete guard.");
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

  const getShiftClassName = (shift) => {
    if (shift === "Morning") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (shift === "Evening") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-purple-100 text-purple-700";
  };

  const tableRows = filteredGuards
    .slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    )
    .map((guard) => ({
      name: guard.name,
      phone: guard.phone,
      shift: (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getShiftClassName(guard.shift)}`}
        >
          {guard.shift}
        </span>
      ),
      added: guard.created_at
        ? new Date(guard.created_at).toLocaleDateString()
        : "-",
      actions: (
        <div className="flex gap-2">
          <button
            onClick={() => editGuard(guard)}
            className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm transition"
          >
            Edit
          </button>

          <button
            onClick={() => deleteGuard(guard.id)}
            className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm transition"
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

  let tableContent;

  if (loading) {
    tableContent = (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center text-gray-600 dark:text-gray-300">
        Loading guards...
      </div>
    );
  } else if (tableRows.length === 0) {
    tableContent = <TableEmpty message="No guards found." />;
  } else {
    tableContent = (
      <>
        <DataTable
          columns={columns}
          data={tableRows}
        />

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={() =>
            setCurrentPage((page) =>
              Math.max(page - 1, 1)
            )
          }
          onNext={() =>
            setCurrentPage((page) =>
              Math.min(page + 1, totalPages)
            )
          }
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        <TableHeader
          title="Guards Management"
          subtitle={`Total Guards: ${filteredGuards.length}`}
        />

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-8">

          <form
            onSubmit={saveGuard}
            className="grid md:grid-cols-3 gap-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Guard Name"
              value={form.name}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />

            <select
              name="shift"
              value={form.shift}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option>Morning</option>
              <option>Evening</option>
              <option>Night</option>
            </select>

            <div className="md:col-span-3 flex gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
              >
                <Plus size={18} />
                {editingId ? "Update Guard" : "Add Guard"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition"
                >
                  Cancel
                </button>
              )}

              <button
                type="button"
                onClick={fetchGuards}
                className="ml-auto flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-5 py-3 rounded-xl transition"
              >
                <RefreshCw size={18} />
                Refresh
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-6">
          <TableSearch
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search guards..."
          />
        </div>

        {tableContent}
      </div>
    </div>
  );
}

export default AdminGuards;