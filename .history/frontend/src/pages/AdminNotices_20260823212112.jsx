import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Search,
  Plus,
  Pencil,
  Trash2,
  FileText,
  RefreshCw,
  Sparkles,
} from "lucide-react";

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
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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

    const interval = setInterval(() => {
      fetchNotices(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchNotices = async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);

      const res = await api.get("/notices");

      setNotices(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
      setNotices([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
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
      setSaving(true);

      if (editingId) {
        await api.put(`/notices/${editingId}`, form);
        alert("Notice updated successfully");
      } else {
        await api.post("/notices", form);
        alert("Notice created successfully");
      }

      resetForm();
      await fetchNotices();
    } catch (error) {
      console.log(error);
      alert("Failed to save notice");
    } finally {
      setSaving(false);
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

  const totalPages = Math.max(
    1,
    Math.ceil(filteredNotices.length / itemsPerPage)
  );

  const paginatedNotices = filteredNotices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalNotices = notices.length;

  const columns = [
  {
    key: "title",
    label: "Title",
    render: (notice) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <Bell className="w-5 h-5 text-blue-600" />
        </div>

        <div>
          <div className="font-semibold">
            {notice.title}
          </div>
          <div className="text-xs text-gray-500">
            Society Notice
          </div>
        </div>
      </div>
    ),
  },
  {
    key: "description",
    label: "Description",
    render: (notice) => (
      <div className="max-w-md line-clamp-2 whitespace-pre-wrap">
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
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition"
        >
          <Pencil size={16} />
          Edit
        </button>

        <button
          onClick={() => deleteNotice(notice.id)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    ),
  },
];

return (
  <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-900 dark:to-black">
    <Navbar />

    <div className="max-w-7xl mx-auto p-6">

      <div className="grid md:grid-cols-3 gap-5 mb-8">

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <p className="text-sm text-gray-500">
            Total Notices
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {totalNotices}
          </h2>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <p className="text-sm text-gray-500">
            Search Results
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {filteredNotices.length}
          </h2>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => fetchNotices(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg p-6 flex items-center justify-center gap-3"
        >
          <RefreshCw
            size={20}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh Notices
        </motion.button>

      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8"
      >
        <TableHeader title="Notice Management" />

        <form
          onSubmit={saveNotice}
          className="space-y-5 mt-6"
        >
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Notice Title"
            required
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white px-4 py-3"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={6}
            placeholder="Notice Description"
            required
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white px-4 py-3 resize-none"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              <Plus size={18} />
              {saving
                ? "Saving..."
                : editingId
                ? "Update Notice"
                : "Create Notice"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </motion.div>
            <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8"
      >
        <TableSearch
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search notices..."
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-6">
          {loading ? (
            <div className="text-center py-10">
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

              <div className="mt-6">
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredNotices.length}
                  pageSize={itemsPerPage}
                  onPrevious={() =>
                    setCurrentPage((p) =>
                      Math.max(1, p - 1)
                    )
                  }
                  onNext={() =>
                    setCurrentPage((p) =>
                      Math.min(totalPages, p + 1)
                    )
                  }
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400"
      >
        Diamond Square Admin Panel • Version 2.0
      </motion.div>

    </div>
  </div>
);
}

export default AdminNotices;