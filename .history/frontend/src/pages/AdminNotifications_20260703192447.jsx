// Part 1/3

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import api from "../services/api";

import DataTable from "../components/table/DataTable";
import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "General",
    is_active: 1,
  });

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const res = await api.get("/notifications");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.notifications || [];

      data.sort(
        (a, b) =>
          new Date(b.created_at || 0) -
          new Date(a.created_at || 0)
      );

      setNotifications(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load notifications.");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
            ? 1
            : 0
          : value,
    }));
  };

  const resetForm = () => {
    setEditingId(null);

    setForm({
      title: "",
      message: "",
      type: "General",
      is_active: 1,
    });
  };

  const saveNotification = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      if (editingId) {
        const res = await api.put(
          `/notifications/${editingId}`,
          form
        );

        const updated =
          res.data.notification || {
            id: editingId,
            ...form,
          };

        setNotifications((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? { ...item, ...updated }
              : item
          )
        );

        toast.success("Notification updated.");
      } else {
        const res = await api.post(
          "/notifications",
          form
        );

        const created =
          res.data.notification || res.data;

        setNotifications((prev) => [
          created,
          ...prev,
        ]);

        toast.success("Notification created.");
      }

      resetForm();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Operation failed."
      );
    } finally {
      setSaving(false);
    }
  };

  const editNotification = (notification) => {
    setEditingId(notification.id);

    setForm({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      is_active: notification.is_active,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteNotification = async (id) => {
    if (!window.confirm("Delete this notification?"))
      return;

    try {
      await api.delete(`/notifications/${id}`);

      setNotifications((prev) =>
        prev.filter((item) => item.id !== id)
      );

      toast.success("Notification deleted.");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Delete failed."
      );
    }
  };
  // Part 2/3

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const matchesSearch = `${item.title} ${item.message}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesType =
        typeFilter === "All" ||
        item.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [notifications, search, typeFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, typeFilter]);

  const totalPages = Math.ceil(
    filteredNotifications.length / rowsPerPage
  );

  const currentNotifications = filteredNotifications.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const getTypeColor = (type) => {
    switch (type) {
      case "Emergency":
        return "bg-red-100 text-red-700";

      case "Maintenance":
        return "bg-yellow-100 text-yellow-700";

      case "Event":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const columns = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Message",
      accessor: (row) => (
        <div className="max-w-md whitespace-pre-wrap">
          {row.message}
        </div>
      ),
    },
    {
      header: "Type",
      accessor: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-sm ${getTypeColor(
            row.type
          )}`}
        >
          {row.type}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            row.is_active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Created By",
      accessor: (row) => row.created_by_name || "-",
    },
    {
      header: "Created",
      accessor: (row) =>
        row.created_at
          ? new Date(row.created_at).toLocaleString()
          : "-",
    },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => editNotification(row)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
          >
            Edit
          </button>

          <button
            onClick={() => deleteNotification(row.id)}
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
          title="Notification Management"
          subtitle={`Total Notifications: ${filteredNotifications.length}`}
          buttonText="Refresh"
          onButtonClick={fetchNotifications}
        />

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">

          <h2 className="text-xl font-bold mb-5">
            {editingId
              ? "Edit Notification"
              : "Create Notification"}
          </h2>

          <form
            onSubmit={saveNotification}
            className="grid md:grid-cols-2 gap-4"
          >// Part 3/3

            <input
              type="text"
              name="title"
              placeholder="Notification Title"
              value={form.title}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
              required
            />

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="border rounded-lg px-4 py-2"
            >
              <option>General</option>
              <option>Maintenance</option>
              <option>Emergency</option>
              <option>Event</option>
            </select>

            <textarea
              name="message"
              placeholder="Notification Message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              className="border rounded-lg px-4 py-2 md:col-span-2"
              required
            />

            <label className="flex items-center gap-3 md:col-span-2">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active === 1}
                onChange={handleChange}
              />
              Active Notification
            </label>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Notification"
                  : "Create Notification"}
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

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-4 py-2"
            />

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border rounded-lg px-4 py-2"
            >
              <option>All</option>
              <option>General</option>
              <option>Maintenance</option>
              <option>Emergency</option>
              <option>Event</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={currentNotifications}
          loading={loading}
          emptyMessage="No notifications found."
        />

        <TablePagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

export default AdminNotifications;