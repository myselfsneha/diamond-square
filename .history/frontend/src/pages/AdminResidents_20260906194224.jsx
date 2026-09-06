import { useEffect, useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Shield,
} from "lucide-react";

import Navbar from "../components/Navbar";
import api from "../services/api";
import { toast } from "react-toastify";

import DataTable from "../components/table/DataTable";
import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

function AdminResidents() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const rowsPerPage = 10;

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/all-users");

      setResidents(
        Array.isArray(res.data.users)
          ? res.data.users
          : []
      );
    } catch (error) {
      console.error(error);
      setResidents([]);
      toast.error("Failed to load residents.");
    } finally {
      setLoading(false);
    }
  };

  const getApprovalBadgeClass = (status) => {
    if (status === "approved") {
      return "bg-green-100 text-green-700";
    }

    if (status === "pending") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-red-100 text-red-700";
  };

  const toggleAdmin = async (id) => {
    try {
      const res = await api.put(
        `/admin/toggle-admin/${id}`
      );

      toast.success(res.data.message);

      setResidents((prev) =>
        prev.map((user) =>
          user.id === id
            ? {
                ...user,
                role:
                  user.role === "admin"
                    ? "resident"
                    : "admin",
              }
            : user
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update role."
      );
    }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await api.put(
        `/admin/toggle-status/${id}`
      );

      toast.success(res.data.message);

      setResidents((prev) =>
        prev.map((user) =>
          user.id === id
            ? {
                ...user,
                is_active: !user.is_active,
              }
            : user
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update status."
      );
    }
  };

  const deleteResident = async (id) => {
    if (!window.confirm("Delete this resident?"))
      return;

    try {
      const res = await api.delete(
        `/admin/delete-user/${id}`
      );

      toast.success(res.data.message);

      setResidents((prev) =>
        prev.filter((user) => user.id !== id)
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete resident."
      );
    }
  };

  const approveResident = async (id) => {
    try {
      const res = await api.put(
        `/admin/approve/${id}`
      );

      toast.success(
        "Resident approved successfully!"
      );

      alert(
        `Resident Approved!\n\nOTP:\n${res.data.otp}`
      );

      fetchResidents();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to approve resident."
      );
    }
  };

  const filteredResidents = useMemo(() => {
    return residents.filter((resident) =>
      `${resident.name} ${resident.email}
      ${resident.phone}
      ${resident.flat_number}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [residents, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredResidents.length / rowsPerPage)
  );

  const currentResidents = filteredResidents.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalResidents = residents.length;

  const approvedResidents = residents.filter(
    (r) => r.approval_status === "approved"
  ).length;

  const pendingResidents = residents.filter(
    (r) => r.approval_status === "pending"
  ).length;

  const admins = residents.filter(
    (r) => r.role === "admin"
  ).length;

  const columns = [    {
      key: "name",
      label: "Resident",
      render: (resident) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            {resident.name}
          </p>
          <p className="text-xs text-gray-500">
            {resident.email}
          </p>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
    },
    {
      key: "flat_number",
      label: "Flat",
      render: (resident) => (
        <span className="font-semibold">
          {resident.flat_number || "--"}
        </span>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (resident) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            resident.role === "admin"
              ? "bg-purple-100 text-purple-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {resident.role === "admin"
            ? "👑 Admin"
            : "Resident"}
        </span>
      ),
    },
    {
      key: "approval_status",
      label: "Approval",
      render: (resident) => {
        let approvalClassName = "bg-red-100 text-red-700";

        if (resident.approval_status === "approved") {
          approvalClassName = "bg-green-100 text-green-700";
        } else if (resident.approval_status === "pending") {
          approvalClassName = "bg-yellow-100 text-yellow-700";
        }

        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${approvalClassName}`}
          >
            {resident.approval_status}
          </span>
        );
      },
    },
    {
      key: "is_active",
      label: "Status",
      render: (resident) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            resident.is_active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {resident.is_active
            ? "🟢 Active"
            : "🔴 Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (resident) => (
        <div className="flex flex-wrap gap-2">
          {resident.approval_status === "pending" && (
            <button
              onClick={() =>
                approveResident(resident.id)
              }
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
            >
              ✓ Approve
            </button>
          )}

          <button
            onClick={() =>
              toggleAdmin(resident.id)
            }
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm transition"
          >
            {resident.role === "admin"
              ? "Remove Admin"
              : "Make Admin"}
          </button>

          <button
            onClick={() =>
              toggleStatus(resident.id)
            }
            className={`px-3 py-2 rounded-lg text-white text-sm transition ${
              resident.is_active
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {resident.is_active
              ? "Deactivate"
              : "Activate"}
          </button>

          <button
            onClick={() =>
              deleteResident(resident.id)
            }
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const renderResidentsContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">
              Loading residents...
            </p>
          </div>
        </div>
      );
    }

    if (filteredResidents.length === 0) {
      return <TableEmpty message="No residents found." />;
    }

    return (
      <>
        <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
          <DataTable
            columns={columns}
            data={currentResidents}
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">

        <TableHeader
          title="Manage Residents"
          subtitle={`Total Residents: ${filteredResidents.length}`}
        />

        {/* Statistics Cards */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6 mb-8">

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <Users className="text-blue-600 mb-3" />
            <p className="text-gray-500 text-sm">
              Total Residents
            </p>
            <h2 className="text-3xl font-bold dark:text-white">
              {totalResidents}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <UserCheck className="text-green-600 mb-3" />
            <p className="text-gray-500 text-sm">
              Approved
            </p>
            <h2 className="text-3xl font-bold text-green-600">
              {approvedResidents}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <UserX className="text-yellow-500 mb-3" />
            <p className="text-gray-500 text-sm">
              Pending
            </p>
            <h2 className="text-3xl font-bold text-yellow-500">
              {pendingResidents}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <Shield className="text-purple-600 mb-3" />
            <p className="text-gray-500 text-sm">
              Admins
            </p>
            <h2 className="text-3xl font-bold text-purple-600">
              {admins}
            </h2>
          </div>

        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">

          <TableSearch
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, email, phone or flat..."
          />

          {renderResidentsContent()}
        </div>

        {/* Bottom Summary */}

        {!loading && filteredResidents.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl">

            <h3 className="text-xl font-bold mb-4">
              Residents Overview
            </h3>

            <div className="grid md:grid-cols-4 gap-4">

              <div>
                <p className="text-sm opacity-80">
                  Total Residents
                </p>
                <p className="text-2xl font-bold">
                  {totalResidents}
                </p>
              </div>

              <div>
                <p className="text-sm opacity-80">
                  Active Residents
                </p>
                <p className="text-2xl font-bold">
                  {
                    residents.filter(
                      (r) => r.is_active
                    ).length
                  }
                </p>
              </div>

              <div>
                <p className="text-sm opacity-80">
                  Pending Approval
                </p>
                <p className="text-2xl font-bold">
                  {pendingResidents}
                </p>
              </div>

              <div>
                <p className="text-sm opacity-80">
                  Admin Accounts
                </p>
                <p className="text-2xl font-bold">
                  {admins}
                </p>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
export default AdminResidents;