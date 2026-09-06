import { useEffect, useMemo, useState } from "react";
import { ShieldCheck, Plus, RefreshCw, Search } from "lucide-react";
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
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            guard.shift === "Morning"
              ? "bg-yellow-100 text-yellow-700"
              : guard.shift === "Evening"
              ? "bg-blue-100 text-blue-700"
              : "bg-purple-100 text-purple-700"
          }`}
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