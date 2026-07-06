import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

import DataTable from "../components/table/DataTable";
import TableHeader from "../components/table/TableHeader";
import TableSearch from "../components/table/TableSearch";
import TablePagination from "../components/table/TablePagination";
import TableEmpty from "../components/table/TableEmpty";

function Notices() {
  const [notices, setNotices] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const rowsPerPage = 10;

  useEffect(() => {
    fetchNotices();

    const interval = setInterval(fetchNotices, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await api.get("/notices");

      const sorted = [...(res.data || [])].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setNotices(sorted);
    } catch (error) {
      console.log(error);
      setNotices([]);
    }
  };

  const filteredNotices = useMemo(() => {
    return notices.filter((notice) =>
      `${notice.title || ""} ${notice.description || ""} ${
        notice.created_by || ""
      }`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [notices, search]);

  const totalPages = Math.ceil(filteredNotices.length / rowsPerPage);

  const currentNotices = filteredNotices.slice(
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
      key: "created_by",
      label: "Posted By",
      render: (notice) => notice.created_by || "Admin",
    },
    {
      key: "created_at",
      label: "Date",
      render: (notice) =>
        notice.created_at
          ? new Date(notice.created_at).toLocaleString()
          : "N/A",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <TableHeader
          title="Notice Board"
          subtitle={`Total Notices: ${filteredNotices.length}`}
        />

        <div className="mb-6">
          <TableSearch
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search notices..."
          />
        </div>

        {filteredNotices.length === 0 ? (
          <TableEmpty message="No notices found." />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={currentNotices}
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

export default Notices;