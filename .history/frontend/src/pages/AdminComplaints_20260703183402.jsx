import { useEffect, useMemo, useState } from "react";
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

    const interval = setInterval(() => {
      fetchComplaints();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/complaints");

      setComplaints(
        Array.isArray(res.data)
          ? res.data
          : res.data.complaints || []
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load complaints"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(`/complaints/${id}`, {
        status,
      });

      if (res.data.message) {
        setComplaints((prev) =>
          prev.map((complaint) =>
            complaint.id === id
              ? { ...complaint, status }
              : complaint
          )
        );

        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update complaint"
      );
    }
  };

  const deleteComplaint = async (id) => {
    if (!window.confirm("Delete this complaint?")) return;

    try {
      const res = await api.delete(`/complaints/${id}`);

      setComplaints((prev) =>
        prev.filter((complaint) => complaint.id !== id)
      );

      toast.success(
        res.data.message ||
          "Complaint deleted successfully"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete complaint"
      );
    }
  };

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) =>
      `${complaint.title || ""} ${complaint.description || ""} ${complaint.name || ""} ${complaint.phone || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [complaints, search]);

  const totalPages = Math.ceil(
    filteredComplaints.length / rowsPerPage
  );

  const currentComplaints = filteredComplaints.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "text-green-600 font-semibold";
      case "In Progress":
        return "text-blue-600 font-semibold";
      case "Pending":
        return "text-yellow-600 font-semibold";
      default:
        return "text-gray-700 dark:text-white";
    }
  };

  const columns = [
    {
      key: "title",
      label: "Title",
    },
    {
      key: "name",
      label: "Resident",
    },
    {
      key: "phone",
      label: "Phone",
    },
    {
      key: "status",
      label: "Status",
      render: (complaint) => (
        <span className={getStatusColor(complaint.status)}>
          {complaint.status}
        </span>
      ),
    },
        {
      key: "created_at",
      label: "Created",
      render: (complaint) =>
        new Date(complaint.created_at).toLocaleString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (complaint) => (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() =>
              updateStatus(complaint.id, "Pending")
            }
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg"
          >
            Pending
          </button>

          <button
            onClick={() =>
              updateStatus(
                complaint.id,
                "In Progress"
              )
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg"
          >
            In Progress
          </button>

          <button
            onClick={() =>
              updateStatus(
                complaint.id,
                "Resolved"
              )
            }
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg"
          >
            Resolved
          </button>

          <button
            onClick={() =>
              deleteComplaint(complaint.id)
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
          title="Manage Complaints"
          subtitle={`Total Complaints: ${filteredComplaints.length}`}
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 text-gray-900 dark:text-white">
            Loading...
          </div>
        ) : filteredComplaints.length === 0 ? (
          <TableEmpty message="No complaints found." />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={currentComplaints}
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

export default AdminComplaints;