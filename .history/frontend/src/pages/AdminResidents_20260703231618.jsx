import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { toast } from "react-toastify";

import DataTable from "../components/table/DataTable";
import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";
import LoadingSpinner from "../components/common/LoadingSpinner";

function AdminResidents() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const rowsPerPage = 10;

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/residents");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.residents || [];

      setResidents(data);
    } catch (error) {
      console.error(error);
      setResidents([]);
      toast.error("Failed to load residents.");
    } finally {
      setLoading(false);
    }
  };

  const deleteResident = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resident?")) {
      return;
    }

    try {
      setDeletingId(id);

      await api.delete(`/admin/residents/${id}`);

      setResidents((prev) =>
        prev.filter((resident) => resident.id !== id)
      );

      toast.success("Resident deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete resident.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredResidents = useMemo(() => {
    return residents.filter((resident) =>
      `${resident.name || ""} ${resident.email || ""} ${resident.phone || ""} ${resident.flat_number || ""}`
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
    },
    {
      key: "approval_status",
      label: "Status",
      render: (resident) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            resident.approval_status === "approved"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {resident.approval_status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (resident) => (
        <button
          onClick={() => deleteResident(resident.id)}
          disabled={deletingId === resident.id}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-3 py-1 rounded-lg"
        >
          {deletingId === resident.id ? "Deleting..." : "Delete"}
        </button>
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
          <LoadingSpinner text="Loading residents..." />
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