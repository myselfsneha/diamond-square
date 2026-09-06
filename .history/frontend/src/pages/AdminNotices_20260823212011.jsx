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
    