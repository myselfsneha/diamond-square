import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Search,
  Filter,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
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
  const [refreshing, setRefreshing] = useState(false);

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

    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);

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
      setRefreshing(false);
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

  const totalPages = Math.max(
    1,
    Math.ceil(filteredNotifications.length / rowsPerPage)
  );

  const currentNotifications = filteredNotifications.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalActive = notifications.filter(
    (n) => n.is_active
  ).length;

  const totalInactive =
    notifications.length - totalActive;

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
      key: "title",
      label: "Title",
      render: (row) => (
        <div className="font-semibold">
          {row.title}
        </div>
      ),
    },
    {
      key: "message",
      label: "Message",
      render: (row) => (
        <div className="max-w-md whitespace-pre-wrap">
          {row.message}
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(
            row.type
          )}`}
        >
          {row.type}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
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
      key: "createdBy",
      label: "Created By",
      render: (row) => row.created_by_name || "-",
    },
    {
      key: "created",
      label: "Created",
      render: (row) =>
        row.created_at
          ? new Date(row.created_at).toLocaleString()
          : "-",
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => editNotification(row)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg flex items-center gap-1"
          >
            <Pencil size={15} />
            Edit
          </button>

          <button
            onClick={() => deleteNotification(row.id)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg flex items-center gap-1"
          >
            <Trash2 size={15} />
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-slate-950">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        <TableHeader
          title="Notification Management"
          subtitle={`${filteredNotifications.length} Notifications`}
          buttonText={
            refreshing ? "Refreshing..." : "Refresh"
          }
          onButtonClick={() => fetchNotifications(true)}
        />

        <div className="grid md:grid-cols-3 gap-5 my-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">
                  Total Notifications
                </p>
                <h2 className="text-3xl font-bold">
                  {notifications.length}
                </h2>
              </div>
              <Bell className="text-blue-600" size={34} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">
                  Active
                </p>
                <h2 className="text-3xl font-bold text-green-600">
                  {totalActive}
                </h2>
              </div>
              <ShieldCheck
                className="text-green-600"
                size={34}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">
                  Inactive
                </p>
                <h2 className="text-3xl font-bold text-red-600">
                  {totalInactive}
                </h2>
              </div>
              <Sparkles
                className="text-red-500"
                size={34}
              />
            </div>
          </div>
        </div>
        