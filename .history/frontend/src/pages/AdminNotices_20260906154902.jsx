import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  FileText,
  PlusCircle,
  Pencil,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

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

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 10;

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchNotices();

    const interval = setInterval(
      fetchNotices,
      10000
    );

    return () => clearInterval(interval);
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);

      const res = await api.get("/notices");

      setNotices(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (error) {
      console.log(error);

      toast.error("Failed to load notices");

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
        await api.put(
          `/notices/${editingId}`,
          form
        );

        toast.success(
          "Notice updated successfully"
        );
      } else {
        await api.post("/notices", form);

        toast.success(
          "Notice created successfully"
        );
      }

      resetForm();
      fetchNotices();
    } catch (error) {
      console.log(error);

      toast.error("Failed to save notice");
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
    if (!window.confirm("Delete this notice?"))
      return;

    try {
      await api.delete(`/notices/${id}`);

      setNotices((prev) =>
        prev.filter(
          (notice) => notice.id !== id
        )
      );

      toast.success(
        "Notice deleted successfully"
      );
    } catch (error) {
      console.log(error);

      toast.error("Failed to delete notice");
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
    Math.ceil(
      filteredNotices.length / itemsPerPage
    )
  );

  const paginatedNotices =
    filteredNotices.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

  const totalNotices = notices.length;
    const recentNotices = notices.filter((notice) => {
    if (!notice.created_at) return false;

    const created = new Date(notice.created_at);
    const today = new Date();

    return (
      created.getDate() === today.getDate() &&
      created.getMonth() === today.getMonth() &&
      created.getFullYear() === today.getFullYear()
    );
  }).length;

  const columns = [
    {
      key: "title",
      label: "Title",
      render: (notice) => (
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {notice.title}
          </div>
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (notice) => (
        <div className="max-w-md whitespace-pre-wrap text-gray-600 dark:text-gray-300">
          {notice.description}
        </div>
      ),
    },
    {
      key: "created",
      label: "Posted",
      render: (notice) => (
        <span className="text-sm text-gray-500">
          {notice.created_at
            ? new Date(
                notice.created_at
              ).toLocaleString()
            : "-"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (notice) => (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => editNotice(notice)}
            className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-lg transition"
          >
            Edit
          </button>

          <button
            onClick={() =>
              deleteNotice(notice.id)
            }
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">

          <div className="flex items-center gap-3 mb-6">
            <Pencil className="text-blue-600" size={24} />
            <div>
              <h2 className="text-xl font-bold dark:text-white">
                {editingId ? "Edit Notice" : "Create Notice"}
              </h2>
              <p className="text-gray-500 text-sm">
                Publish important announcements for all residents.
              </p>
            </div>
          </div>

          <form
            onSubmit={saveNotice}
            className="space-y-5"
          >
            <input
              type="text"
              name="title"
              placeholder="Notice Title"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />

            <textarea
              name="description"
              placeholder="Notice Description..."
              value={form.description}
              onChange={handleChange}
              rows={5}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              required
            />

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
              >
                {editingId
                  ? "Update Notice"
                  : "Create Notice"}
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
            </div>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">

          <TableSearch
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search notices..."
          />

        </div>