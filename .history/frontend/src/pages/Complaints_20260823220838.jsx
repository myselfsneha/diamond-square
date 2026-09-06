import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../services/api";

import DataTable from "../components/table/DataTable";
import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const rowsPerPage = 10;

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/complaints/my");

      setComplaints(
        Array.isArray(res.data)
          ? res.data
          : res.data.complaints || []
      );
    } catch (error) {
      console.log(error);
      setComplaints([]);
    }
  };

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) =>
      `${complaint.title || ""} ${complaint.description || ""} ${
        complaint.status || ""
      }`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [complaints, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredComplaints.length / rowsPerPage)
  );

  const currentComplaints = filteredComplaints.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const pendingCount = complaints.filter(
    (c) => c.status?.toLowerCase() === "pending"
  ).length;

  const resolvedCount = complaints.filter(
    (c) => c.status?.toLowerCase() === "resolved"
  ).length;

  const rejectedCount = complaints.filter(
    (c) => c.status?.toLowerCase() === "rejected"
  ).length;

  const columns = [
    {
      key: "title",
      label: "Title",
    },
    {
      key: "description",
      label: "Description",
    },
    {
      key: "status",
      label: "Status",
      render: (complaint) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            complaint.status?.toLowerCase() === "resolved"
              ? "bg-green-100 text-green-700"
              : complaint.status?.toLowerCase() === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : complaint.status?.toLowerCase() === "rejected"
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {complaint.status}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-5 mb-8">
          <TableHeader
            title="My Complaints"
            subtitle={`Total Complaints: ${filteredComplaints.length}`}
          />

          <Link
            to="/create-complaint"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-xl shadow-lg transition"
          >
            <Plus size={18} />
            New Complaint
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8"
        >
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">Total</p>
                <h2 className="text-3xl font-bold mt-2">
                  {complaints.length}
                </h2>
              </div>
              <MessageSquare className="text-blue-600" size={34} />
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">Pending</p>
                <h2 className="text-3xl font-bold text-yellow-600 mt-2">
                  {pendingCount}
                </h2>
              </div>
              <Clock className="text-yellow-600" size={34} />
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">Resolved</p>
                <h2 className="text-3xl font-bold text-green-600 mt-2">
                  {resolvedCount}
                </h2>
              </div>
              <CheckCircle2 className="text-green-600" size={34} />
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">Rejected</p>
                <h2 className="text-3xl font-bold text-red-600 mt-2">
                  {rejectedCount}
                </h2>
              </div>
              <XCircle className="text-red-600" size={34} />
            </div>
          </div>
        </motion.div>

        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg p-6">

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

          {filteredComplaints.length === 0 ? (
            <div className="py-12">
              <TableEmpty message="No complaints found." />
            </div>
          ) : (
            <>
              <DataTable
                columns={columns}
                data={currentComplaints}
                rowKey="id"
              />

              <div className="mt-6">
                <TablePagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Complaints;