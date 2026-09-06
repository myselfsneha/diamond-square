// Part 1/3

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import api from "../services/api";

import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import DataTable from "../components/table/DataTable";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

const ROWS_PER_PAGE = 10;

function AdminResidents() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchResidents = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/all-users");

      const users = Array.isArray(res.data.users)
        ? res.data.users
        : [];

      users.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
      );

      setResidents(users);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load residents.");
      setResidents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResidents();

    const interval = setInterval(
      fetchResidents,
      10000
    );

    return () => clearInterval(interval);
  }, [fetchResidents]);

  const updateResident = (id, updates) => {
    setResidents((prev) =>
      prev.map((resident) =>
        resident.id === id
          ? { ...resident, ...updates }
          : resident
      )
    );
  };

  const toggleAdmin = async (id) => {
    try {
      const res = await api.put(
        `/admin/toggle-admin/${id}`
      );

      toast.success(res.data.message);

      const resident = residents.find(
        (r) => r.id === id
      );

      updateResident(id, {
        role:
          resident?.role === "admin"
            ? "resident"
            : "admin",
      });
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

      const resident = residents.find(
        (r) => r.id === id
      );

      updateResident(id, {
        is_active: !resident?.is_active,
      });
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update status."
      );
    }
  };

  const approveResident = async (id) => {
    try {
      const res = await api.put(
        `/admin/approve/${id}`
      );

      toast.success("Resident approved.");

      alert(
        `Resident Approved\n\nOTP: ${res.data.otp}`
      );

      updateResident(id, {
        approval_status: "approved",
      });
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Approval failed."
      );
    }
  };
  // Part 2/3

  const deleteResident = async (id) => {
    if (!window.confirm("Delete this resident?"))
      return;

    try {
      const res = await api.delete(
        `/admin/delete-user/${id}`
      );

      toast.success(res.data.message);

      setResidents((prev) =>
        prev.filter((resident) => resident.id !== id)
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Delete failed."
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
    Math.ceil(
      filteredResidents.length / ROWS_PER_PAGE
    )
  );

  const paginatedResidents =
    filteredResidents.slice(
      (currentPage - 1) * ROWS_PER_PAGE,
      currentPage * ROWS_PER_PAGE
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
            resident.approval_status ===
            "approved"
              ? "bg-green-100 text-green-700"
              : resident.approval_status ===
                "pending"
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
            ? "Active"
            : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (resident) => (
        <div className="flex flex-wrap gap-2">
          {resident.approval_status ===
            "pending" && (
            <button
              onClick={() =>
                approveResident(resident.id)
              }
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg"
            >
              Approve
            </button>
          )}

          <button
            onClick={() =>
              toggleAdmin(resident.id)
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg"
          >
            {resident.role === "admin"
              ? "Remove Admin"
              : "Make Admin"}
          </button>

          <button
            onClick={() =>
              toggleStatus(resident.id)
            }
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
            onClick={() =>
              deleteResident(resident.id)
            }
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
          buttonText="Refresh"
          onButtonClick={fetchResidents}
        />

        <TableSearch
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search residents..."
        />
        // Part 3/3

        {loading ? (
          <div className="flex justify-center items-center h-[70vh]">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Loading residents...
            </p>
          </div>
        ) : paginatedResidents.length === 0 ? (
          <TableEmpty message="No residents found." />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={paginatedResidents}
              rowKey="id"
            />

            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default AdminResidents;