import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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

  const totalPages = Math.ceil(
    filteredComplaints.length / rowsPerPage
  );

  const currentComplaints = filteredComplaints.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <TableHeader
            title="My Complaints"
            subtitle={`Total Complaints: ${filteredComplaints.length}`}
          />

          <Link
            to="/create-complaint"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            + New Complaint
          </Link>
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

        {filteredComplaints.length === 0 ? (
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

export default Complaints;