import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock3,
  Mail,
  Phone,
  Home,
  User,
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

function AdminApprovals() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const rowsPerPage = 10;

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        "/admin/pending-users"
      );

      setUsers(
        Array.isArray(data.users)
          ? data.users
          : []
      );
    } catch {
      toast.error(
        "Unable to load pending approvals."
      );
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (id) => {
    try {
      await api.put(`/admin/approve/${id}`);

      setUsers((prev) =>
        prev.filter((u) => u.id !== id)
      );

      toast.success("Resident approved.");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Approval failed."
      );
    }
  };

  const rejectUser = async (id) => {
    const reason =
      prompt("Reason for rejection") || "";

    if (!reason.trim()) return;

    try {
      await api.put(`/admin/reject/${id}`, {
        reason,
      });

      setUsers((prev) =>
        prev.filter((u) => u.id !== id)
      );

      toast.success("Resident rejected.");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Rejection failed."
      );
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      `${user.name} ${user.email} ${user.phone} ${user.flat_number}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [users, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / rowsPerPage)
  );

  const currentUsers = filteredUsers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const columns = [
    {
      key: "name",
      label: "Resident",
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <User
              size={18}
              className="text-emerald-600"
            />
          </div>

          <div>
            <p className="font-semibold">
              {user.name}
            </p>

            <p className="text-xs text-slate-500">
              {user.resident_type}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (user) => (
        <div className="flex items-center gap-2">
          <Mail size={15} />
          {user.email}
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (user) => (
        <div className="flex items-center gap-2">
          <Phone size={15} />
          {user.phone}
        </div>
      ),
    },
    {
      key: "flat",
      label: "Flat",
      render: (user) => (
        <div className="flex items-center gap-2">
          <Home size={15} />
          {user.flat_number || "-"}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (user) => (
        <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
          <Clock3 size={14} />
          {user.approval_status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (user) => (
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() =>
              approveUser(user.id)
            }
            className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
          >
            <CheckCircle2 size={16} />
            Approve
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() =>
              rejectUser(user.id)
            }
            className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
          >
            <XCircle size={16} />
            Reject
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
          title="Resident Approvals"
          subtitle={`${filteredUsers.length} pending approval${
            filteredUsers.length !== 1
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
            placeholder="Search residents..."
          />
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-12 text-center text-slate-500 shadow-card dark:bg-slate-900">
            Loading pending approvals...
          </div>
        ) : filteredUsers.length === 0 ? (
          <TableEmpty message="No pending resident approvals." />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={currentUsers}
              keyField="id"
            />

            <TablePagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={filteredUsers.length}
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

export default AdminApprovals;