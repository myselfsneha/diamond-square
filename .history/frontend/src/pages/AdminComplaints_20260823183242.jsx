import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Clock3,
  CheckCircle2,
  Loader2,
  Trash2,
  User,
  Phone,
  CalendarDays,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import api from "../services/api";

import DataTable from "../components/table/DataTable";
import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const rowsPerPage = 10;

  useEffect(() => {
    fetchComplaints();

    const interval = setInterval(fetchComplaints, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await api.get("/complaints");

      setComplaints(
        Array.isArray(data)
          ? data
          : data.complaints || []
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to load complaints."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/complaints/${id}`, {
        status,
      });

      setComplaints((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status,
              }
            : item
        )
      );

      toast.success("Status updated.");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to update complaint."
      );
    }
  };

  const deleteComplaint = async (id) => {
    if (!window.confirm("Delete complaint?")) return;

    try {
      await api.delete(`/complaints/${id}`);

      setComplaints((prev) =>
        prev.filter((item) => item.id !== id)
      );

      toast.success("Complaint deleted.");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Delete failed."
      );
    }
  };

  const filteredComplaints = useMemo(() => {
    return complaints.filter((item) =>
      `${item.title} ${item.description} ${item.name} ${item.phone}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [complaints, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredComplaints.length / rowsPerPage)
  );

  const currentComplaints =
    filteredComplaints.slice(
      (page - 1) * rowsPerPage,
      page * rowsPerPage
    );

  const statusBadge = (status) => {
    switch (status) {
      case "Resolved":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-300">
            <CheckCircle2 size={14} />
            Resolved
          </span>
        );

      case "In Progress":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            <Loader2 size={14} />
            In Progress
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
            <Clock3 size={14} />
            Pending
          </span>
        );
    }
  };

  const columns = [
    {
      key: "title",
      label: "Complaint",
      render: (item) => (
        <div>
          <p className="font-semibold">
            {item.title}
          </p>

          <p className="mt-1 max-w-sm text-xs text-slate-500 line-clamp-2">
            {item.description}
          </p>
        </div>
      ),
    },
    {
      key: "resident",
      label: "Resident",
      render: (item) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <User size={15} />
            {item.name}
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Phone size={14} />
            {item.phone}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) =>
        statusBadge(item.status),
    },
    {
      key: "created_at",
      label: "Created",
      render: (item) => (
        <div className="flex items-center gap-2">
          <CalendarDays size={15} />
          {new Date(
            item.created_at
          ).toLocaleString()}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item) => (
        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              updateStatus(
                item.id,
                "Pending"
              )
            }
            className="rounded-lg bg-yellow-500 px-3 py-2 text-white hover:bg-yellow-600"
          >
            Pending
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              updateStatus(
                item.id,
                "In Progress"
              )
            }
            className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
          >
            Progress
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              updateStatus(
                item.id,
                "Resolved"
              )
            }
            className="rounded-lg bg-green-600 px-3 py-2 text-white hover:bg-green-700"
          >
            Resolve
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              deleteComplaint(item.id)
            }
            className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700"
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <Navbar />

      <div className="mx-auto max-w-7xl p-6">
        <TableHeader
          title="Complaint Management"
          subtitle={`${filteredComplaints.length} complaint${
            filteredComplaints.length !== 1
              ? "s"
              : ""
          }`}
        />

        <div className="mb-6">
          <TableSearch
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search complaints..."
          />
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow dark:bg-slate-900">
            Loading complaints...
          </div>
        ) : filteredComplaints.length === 0 ? (
          <TableEmpty message="No complaints available." />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={currentComplaints}
              keyField="id"
            />

            <TablePagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={filteredComplaints.length}
              pageSize={rowsPerPage}
              onPrevious={() =>
                setPage((p) =>
                  Math.max(1, p - 1)
                )
              }
              onNext={() =>
                setPage((p) =>
                  Math.min(totalPages, p + 1)
                )
              }
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default AdminComplaints;