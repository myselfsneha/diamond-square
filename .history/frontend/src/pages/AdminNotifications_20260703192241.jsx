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