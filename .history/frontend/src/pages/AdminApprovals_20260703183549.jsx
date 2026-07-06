import { useEffect, useMemo, useState } from "react";
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
      const res = await api.get("/admin/pending-users");

      setUsers(
        Array.isArray(res.data.users)
          ? res.data.users
          : []
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (id) => {
    try {
      const res = await api.put(`/admin/approve-user/${id}`);

      if (res.data.success) {
        setUsers((prev) =>
          prev.filter((user) => user.id !== id)
        );

        toast.success(res.data.message);
      } else {
        toast.error("Failed to approve user");
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to approve user"
      );
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      `${user.name || ""} ${user.email || ""} ${user.phone || ""} ${user.flat_number || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [users, search]);

  const totalPages = Math.ceil(
    filteredUsers.length / rowsPerPage
  );

  const currentUsers = filteredUsers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const columns = [
    {
      key: "name",
      label: "Name",
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
      key: "flat_number",
      label: "Flat",
      render: (user) => user.flat_number || "N/A",
    },
    {
      key: "approval_status",
      label: "Status",
      render: (user) => (
        <span className="text-orange-600 font-semibold">
          {user.approval_status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (user) => (
        <button
          onClick={() => approveUser(user.id)}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg"
        >
          Approve
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <TableHeader
          title="Pending User Approvals"
          subtitle={`Pending Users: ${filteredUsers.length}`}
        />

        <div className="mb-6">
          <TableSearch
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search pending users..."
          />
        </div>

        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 text-gray-900 dark:text-white">
            Loading...
          </div>
        ) : filteredUsers.length === 0 ? (
          <TableEmpty message="No pending users." />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={currentUsers}
              rowKey="id"
            />

            <TablePagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default AdminApprovals;