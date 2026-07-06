import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import DataTable from "../components/table/DataTable";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchNotices();

    const interval = setInterval(fetchNotices, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);

      const res = await api.get("/notices");

      setNotices(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
      setNotices([]);
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
      title: "",
      description: "",
    });
  };

  const saveNotice = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/notices/${editingId}`, form);
        alert("Notice updated successfully");
      } else {
        await api.post("/notices", form);
        alert("Notice created successfully");
      }

      resetForm();
      fetchNotices();
    } catch (error) {
      console.log(error);
      alert("Failed to save notice");
    }
  };

  const editNotice = (notice) => {
    setEditingId(notice.id);

    setForm({
      title: notice.title,
      description: notice.description,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteNotice = async (id) => {
    if (!window.confirm("Delete this notice?")) return;

    try {
      await api.delete(`/notices/${id}`);

      setNotices((prev) =>
        prev.filter((notice) => notice.id !== id)
      );

      alert("Notice deleted successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to delete notice");
    }
  };
    const filteredNotices = useMemo(() => {
    return notices.filter((notice) =>
      `${notice.title || ""} ${notice.description || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [notices, search]);

  const totalPages = Math.ceil(
    filteredNotices.length / itemsPerPage
  );

  const paginatedNotices = filteredNotices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    {
      key: "title",
      label: "Title",
      render: (notice) => (
        <div className="font-semibold">
          {notice.title}
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (notice) => (
        <div className="max-w-md whitespace-pre-wrap">
          {notice.description}
        </div>
      ),
    },
    {
      key: "created",
      label: "Posted",
      render: (notice) =>
        notice.created_at
          ? new Date(notice.created_at).toLocaleString()
          : "-",
    },
    {
      key: "actions",
      label: "Actions",
      render: (notice) => (
        <div className="flex gap-2">
          <button
            onClick={() => editNotice(notice)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
          >
            Edit
          </button>

          <button
            onClick={() => deleteNotice(notice.id)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        <TableHeader
          title="Notice Management"
          subtitle="Manage society notices"
        />

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">

          <form
            onSubmit={saveNotice}
            className="space-y-4"
          >
            <input
              type="text"
              name="title"
              placeholder="Notice Title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />

            <textarea
              name="description"
              placeholder="Notice Description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              className="w-full border rounded-lg px-4 py-2"
              required
            />

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                {editingId
                  ? "Update Notice"
                  : "Create Notice"}
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

        <TableSearch
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search notices..."
        />
                {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center">
            Loading...
          </div>
        ) : paginatedNotices.length === 0 ? (
          <TableEmpty message="No notices found." />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={paginatedNotices}
            />

            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default AdminNotices;