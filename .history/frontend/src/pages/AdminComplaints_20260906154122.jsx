import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

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
      setLoading(true);

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
              ? {
                  ...complaint,
                  status,
                }
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
    if (!window.confirm("Delete this complaint?"))
      return;

    try {
      const res = await api.delete(
        `/complaints/${id}`
      );

      setComplaints((prev) =>
        prev.filter(
          (complaint) => complaint.id !== id
        )
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

  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (c) => c.status === "Pending"
  ).length;

  const progressComplaints = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;

  const resolvedComplaints = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredComplaints.length / rowsPerPage
    )
  );

  const currentComplaints =
    filteredComplaints.slice(
      (page - 1) * rowsPerPage,
      page * rowsPerPage
    );

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-700";

      case "In Progress":
        return "bg-blue-100 text-blue-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };
    const columns = [
    {
      key: "title",
      label: "Complaint",
      render: (complaint) => (
        <div>
          <p className="font-semibold text-gray-800 dark:text-white">
            {complaint.title}
          </p>

          <p className="text-sm text-gray-500 line-clamp-2">
            {complaint.description}
          </p>
        </div>
      ),
    },

    {
      key: "name",
      label: "Resident",
      render: (complaint) => (
        <div>
          <p className="font-semibold">
            {complaint.name}
          </p>

          <p className="text-xs text-gray-500">
            {complaint.phone}
          </p>
        </div>
      ),
    },

    {
      key: "status",
      label: "Status",
      render: (complaint) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
            complaint.status
          )}`}
        >
          {complaint.status}
        </span>
      ),
    },

    {
      key: "created_at",
      label: "Created",
      render: (complaint) => (
        <span className="text-sm">
          {new Date(
            complaint.created_at
          ).toLocaleDateString()}
        </span>
      ),
    },

    {
      key: "actions",
      label: "Actions",
      render: (complaint) => (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() =>
              updateStatus(
                complaint.id,
                "Pending"
              )
            }
            className="px-3 py-1 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition"
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
            className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            Progress
          </button>

          <button
            onClick={() =>
              updateStatus(
                complaint.id,
                "Resolved"
              )
            }
            className="px-3 py-1 rounded-lg bg-green-600 hover:bg-green-700 text-white transition"
          >
            Resolve
          </button>

          <button
            onClick={() =>
              deleteComplaint(complaint.id)
            }
            className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-6 py-8"
      >

        <TableHeader
          title="Manage Complaints"
          subtitle={`Total Complaints : ${filteredComplaints.length}`}
        />

        {/* Statistics */}

        <div className="grid md:grid-cols-4 gap-5 mt-8 mb-8">

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <ClipboardList className="text-indigo-600 mb-3" />

            <p className="text-gray-500 text-sm">
              Total
            </p>

            <h2 className="text-3xl font-bold dark:text-white">
              {totalComplaints}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <AlertTriangle className="text-yellow-500 mb-3" />

            <p className="text-gray-500 text-sm">
              Pending
            </p>

            <h2 className="text-3xl font-bold text-yellow-600">
              {pendingComplaints}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <Clock className="text-blue-600 mb-3" />

            <p className="text-gray-500 text-sm">
              In Progress
            </p>

            <h2 className="text-3xl font-bold text-blue-600">
              {progressComplaints}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <CheckCircle2 className="text-green-600 mb-3" />

            <p className="text-gray-500 text-sm">
              Resolved
            </p>

            <h2 className="text-3xl font-bold text-green-600">
              {resolvedComplaints}
            </h2>
          </div>

        </div>

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
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 text-center">
            <div className="h-10 w-10 mx-auto border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />

            <p className="text-gray-600 dark:text-gray-300">
              Loading complaints...
            </p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10">
            <TableEmpty message="No complaints found." />
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">

              <DataTable
                columns={columns}
                data={currentComplaints}
                rowKey="id"
              />

            </div>

            <TablePagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />

            <div className="grid md:grid-cols-3 gap-5 mt-8">

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg dark:text-white mb-3">
                  Complaint Summary
                </h3>

                <div className="space-y-3 text-sm">

                  <div className="flex justify-between">
                    <span>Total Complaints</span>
                    <span className="font-semibold">
                      {totalComplaints}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Pending</span>
                    <span className="text-yellow-600 font-semibold">
                      {pendingComplaints}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>In Progress</span>
                    <span className="text-blue-600 font-semibold">
                      {progressComplaints}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Resolved</span>
                    <span className="text-green-600 font-semibold">
                      {resolvedComplaints}
                    </span>
                  </div>

                </div>
              </div>

              <div className="md:col-span-2 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 rounded-2xl shadow-lg text-white p-6">

                <h3 className="text-2xl font-bold mb-2">
                  Complaint Management
                </h3>

                <p className="text-blue-100 leading-7">
                  Review new complaints, update their progress,
                  resolve resident issues quickly, and keep the
                  complaint queue organized using the action buttons.
                </p>

              </div>

            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default AdminComplaints;