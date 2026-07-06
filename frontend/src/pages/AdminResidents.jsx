import { useEffect, useMemo, useState } from "react";
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

      const data = Array.isArray(res.data.users)
        ? res.data.users
        : [];

      setResidents(data);
    } catch (error) {
      console.error(error);
      setResidents([]);
      toast.error("Failed to load residents.");
    } finally {
      setLoading(false);
    }
  };

  const toggleAdmin = async (id) => {
    console.log("Target User ID:", id);

    const currentUser = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    console.log("Current Logged-in User:", currentUser);

    try {
      const res = await api.put(`/admin/toggle-admin/${id}`);

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
      console.error(error);

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
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update status."
      );
    }
  };

  const deleteResident = async (id) => {
    if (!window.confirm("Delete this resident?")) return;

    try {
      const res = await api.delete(
        `/admin/delete-user/${id}`
      );

      toast.success(res.data.message);

      setResidents((prev) =>
        prev.filter((user) => user.id !== id)
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete resident."
      );
    }
  };

  const approveResident = async (id) => {
  try {
    const res = await api.put(`/admin/approve/${id}`);

    toast.success("Resident approved successfully!");

    alert(
      `Resident Approved!\n\nOTP for Resident:\n${res.data.otp}`
    );

    fetchResidents();
  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.message ||
      "Failed to approve resident."
    );
  }
};

  const filteredResidents = useMemo(() => {
    return residents.filter((resident) =>
      `${resident.name || ""} ${resident.email || ""} ${
        resident.phone || ""
      } ${resident.flat_number || ""}`
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
          {resident.role}
        </span>
      ),
    },
    {
      key: "approval_status",
      label: "Approval",
      render: (resident) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            resident.approval_status === "approved"
              ? "bg-green-100 text-green-700"
              : resident.approval_status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {resident.approval_status}
        </span>
      ),
    },
    {
      key: "is_active",
      label: "Active",
      render: (resident) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            resident.is_active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {resident.is_active ? "Active" : "Inactive"}
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
          onClick={() => approveResident(resident.id)}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg"
        >
          Approve
        </button>
      )}

      <button
        onClick={() => toggleAdmin(resident.id)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg"
      >
        {resident.role === "admin"
          ? "Remove Admin"
          : "Make Admin"}
      </button>

      <button
        onClick={() => toggleStatus(resident.id)}
        className={`px-3 py-1 rounded-lg text-white ${
          resident.is_active
            ? "bg-orange-600 hover:bg-orange-700"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {resident.is_active
          ? "Deactivate"
          : "Activate"}
      </button>

      <button
        onClick={() => deleteResident(resident.id)}
        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
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
          title="Manage Residents"
          subtitle={`Total Residents: ${filteredResidents.length}`}
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
          <div className="flex justify-center items-center h-[70vh]">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Loading residents...
            </p>
          </div>
        ) : filteredResidents.length === 0 ? (
          <TableEmpty message="No residents found." />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={currentResidents}
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

export default AdminResidents;