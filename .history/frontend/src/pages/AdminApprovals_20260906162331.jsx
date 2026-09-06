// AdminApprovals.jsx (Part 1)

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  UserCheck,
  Users,
  CheckCircle2,
  XCircle,
} from "lucide-react";
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

      const res = await api.get("/admin/pending-users");

      setUsers(
        Array.isArray(res.data?.users)
          ? res.data.users
          : []
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to load pending residents.");
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (id) => {
    try {
      const res = await api.put(`/admin/approve/${id}`);

      if (res.data.success) {
        setUsers((prev) =>
          prev.filter((user) => user.id !== id)
        );

        toast.success("Resident approved.");
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to approve resident."
      );
    }
  };

  const rejectUser = async (id) => {
    const reason = prompt("Reason for rejection:");

    if (reason === null) return;

    try {
      const res = await api.put(
        `/admin/reject/${id}`,
        { reason }
      );

      if (res.data.success) {
        setUsers((prev) =>
          prev.filter((user) => user.id !== id)
        );

        toast.success("Resident rejected.");
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to reject resident."
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
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {user.name}
          </div>

          <div className="text-xs text-gray-500">
            Flat {user.flat_number || "N/A"}
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "phone",
      label: "Phone",
    },
    {
      key: "resident_type",
      label: "Type",
    },
    {
      key: "approval_status",
      label: "Status",
      render: () => (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
          Pending
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (user) => (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => approveUser(user.id)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition flex items-center gap-2"
          >
            <CheckCircle2 size={16} />
            Approve
          </button>

          <button
            onClick={() => rejectUser(user.id)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition flex items-center gap-2"
          >
            <XCircle size={16} />
            Reject
          </button>
        </div>
      ),
    },
  ];
  // AdminApprovals.jsx (Part 2)

  let tableContent;

  if (loading) {
    tableContent = (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-10 text-center">
        <p className="text-gray-500">
          Loading pending residents...
        </p>
      </div>
    );
  } else if (filteredUsers.length === 0) {
    tableContent = (
      <TableEmpty message="No pending residents." />
    );
  } else {
    tableContent = (
      <>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
          <DataTable
            columns={columns}
            data={currentUsers}
            rowKey="id"
          />
        </div>

        <div className="mt-6">
          <TablePagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-6 py-8"
      >
        <TableHeader
          title="Pending Resident Approvals"
          subtitle="Review and approve new resident registrations"
        />

        {/* Statistics */}
        <div className="grid md:grid-cols-2 gap-5 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <Users
              size={30}
              className="text-blue-600 mb-4"
            />
            <p className="text-gray-500 text-sm">
              Pending Residents
            </p>
            <h2 className="text-3xl font-bold dark:text-white">
              {users.length}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <UserCheck
              size={30}
              className="text-green-600 mb-4"
            />
            <p className="text-gray-500 text-sm">
              Showing Results
            </p>
            <h2 className="text-3xl font-bold text-green-600">
              {filteredUsers.length}
            </h2>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <TableSearch
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search pending residents..."
          />
        </div>

        {/* Table */}
        {tableContent}
      </motion.div>
    </div>
  );
}

export default AdminApprovals;