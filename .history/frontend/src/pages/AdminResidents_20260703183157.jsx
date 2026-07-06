import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

import DataTable from "../components/table/DataTable";
import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

function AdminResidents() {
  const [residents, setResidents] = useState([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const res = await api.get("/admin/residents");

      setResidents(
        Array.isArray(res.data)
          ? res.data
          : res.data.residents || []
      );
    } catch (error) {
      console.log(error);
      setResidents([]);
    }
  };

  const deleteResident = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resident?"))
      return;

    try {
      await api.delete(`/admin/residents/${id}`);

      setResidents((prev) =>
        prev.filter((resident) => resident.id !== id)
      );
    } catch (error) {
      console.log(error);
      alert("Failed to delete resident");
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

  const totalPages = Math.ceil(
    filteredResidents.length / rowsPerPage
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
    },
    {
      key: "actions",
      label: "Actions",
      render: (resident) => (
        <button
          onClick={() => deleteResident(resident.id)}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
        >
          Delete
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
        